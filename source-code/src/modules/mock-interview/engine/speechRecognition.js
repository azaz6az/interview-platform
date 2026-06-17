/**
 * speechRecognition.js - Web Speech API 封装模块
 *
 * 提供语音识别功能的统一接口，支持浏览器兼容性检测、
 * 语音识别实例创建及生命周期管理。
 *
 * 使用方式：
 *   import { isSpeechSupported, createRecognition } from './speechRecognition';
 *   if (isSpeechSupported()) {
 *     const recognition = createRecognition({
 *       onResult: ({ transcript, isFinal }) => { ... },
 *       onEnd: () => { ... },
 *       onError: ({ error }) => { ... },
 *     });
 *     recognition.start();
 *     // ... later
 *     recognition.stop();
 *   }
 */

/**
 * 检测当前浏览器是否支持 Web Speech API
 * @returns {boolean} 是否支持语音识别
 */
export function isSpeechSupported() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  return typeof SpeechRecognition === 'function';
}

/**
 * 创建语音识别实例
 *
 * @param {Object} callbacks - 回调函数集合
 * @param {Function} callbacks.onResult - 识别结果回调
 *   参数: { transcript: string, isFinal: boolean }
 *   - transcript: 识别到的文本
 *   - isFinal: 是否为最终结果（true=最终确认, false=临时结果）
 * @param {Function} [callbacks.onEnd] - 识别结束回调
 * @param {Function} [callbacks.onError] - 错误回调
 *   参数: { error: string } 错误类型描述
 * @returns {{ start: Function, stop: Function }} 识别控制器
 * @throws {Error} 浏览器不支持时抛出异常
 */
export function createRecognition({ onResult, onEnd, onError }) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    throw new Error('当前浏览器不支持语音识别，推荐使用 Chrome 浏览器');
  }

  // 创建识别实例并配置参数
  const recognition = new SpeechRecognition();
  recognition.lang = 'zh-CN';
  recognition.interimResults = true;
  recognition.continuous = false;

  // 内部运行状态标记
  let isRunning = false;

  // 处理识别结果
  recognition.onresult = (event) => {
    const last = event.results.length - 1;
    const result = event.results[last];
    const transcript = result[0].transcript;
    const isFinal = result.isFinal;

    if (onResult) {
      onResult({ transcript, isFinal });
    }
  };

  // 处理识别结束
  recognition.onend = () => {
    isRunning = false;
    if (onEnd) {
      onEnd();
    }
  };

  // 处理识别错误
  recognition.onerror = (event) => {
    isRunning = false;
    const errorMessage = getErrorMessage(event.error);
    if (onError) {
      onError({ error: errorMessage });
    }
  };

  /**
   * 启动语音识别
   * 如果已在运行中则忽略调用
   */
  function start() {
    if (isRunning) return;
    try {
      recognition.start();
      isRunning = true;
    } catch (err) {
      // 可能上一次识别尚未完全停止，忽略该错误
      console.warn('语音识别启动失败:', err.message);
    }
  }

  /**
   * 停止语音识别
   */
  function stop() {
    if (!isRunning) return;
    try {
      recognition.stop();
      isRunning = false;
    } catch (err) {
      console.warn('语音识别停止失败:', err.message);
    }
  }

  /**
   * 销毁识别实例，释放资源
   * 移除所有事件监听器并停止正在进行的识别
   */
  function destroy() {
    recognition.onresult = null;
    recognition.onend = null;
    recognition.onerror = null;
    if (isRunning) {
      try { recognition.stop(); } catch (e) { /* ignore */ }
      isRunning = false;
    }
  }

  return { start, stop, destroy };
}

/**
 * 将 Speech API 错误码转换为用户友好的中文描述
 * @param {string} errorCode - SpeechRecognition 错误码
 * @returns {string} 中文错误描述
 */
function getErrorMessage(errorCode) {
  const errorMap = {
    'no-speech': '未检测到语音输入，请重试',
    'audio-capture': '未找到麦克风设备，请检查麦克风连接',
    'not-allowed': '麦克风权限被拒绝，请在浏览器设置中允许麦克风访问',
    'network': '网络错误，请检查网络连接后重试',
    'aborted': '语音识别被中断',
    'service-not-allowed': '语音识别服务不可用',
    'bad-grammar': '语法错误',
    'language-not-supported': '不支持的语言',
  };
  return errorMap[errorCode] || `语音识别错误：${errorCode}`;
}
