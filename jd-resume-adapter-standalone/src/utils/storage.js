/**
 * storage.js - localStorage 工具模块
 * 保存和读取最近使用的简历、JD 文本
 */

const STORAGE_KEYS = {
  RESUME: 'jd-resume-adapter:resume',
  JD: 'jd-resume-adapter:jd',
};

/**
 * 保存简历文本到 localStorage
 * @param {string} text - 简历文本
 */
export function saveResume(text) {
  try {
    localStorage.setItem(STORAGE_KEYS.RESUME, text);
  } catch (e) {
    // localStorage 满或不可用时静默失败
    console.warn('保存简历到 localStorage 失败:', e.message);
  }
}

/**
 * 从 localStorage 读取简历文本
 * @returns {string|null} 简历文本
 */
export function loadResume() {
  try {
    return localStorage.getItem(STORAGE_KEYS.RESUME);
  } catch (e) {
    console.warn('从 localStorage 读取简历失败:', e.message);
    return null;
  }
}

/**
 * 保存 JD 文本到 localStorage
 * @param {string} text - JD 文本
 */
export function saveJD(text) {
  try {
    localStorage.setItem(STORAGE_KEYS.JD, text);
  } catch (e) {
    console.warn('保存 JD 到 localStorage 失败:', e.message);
  }
}

/**
 * 从 localStorage 读取 JD 文本
 * @returns {string|null} JD 文本
 */
export function loadJD() {
  try {
    return localStorage.getItem(STORAGE_KEYS.JD);
  } catch (e) {
    console.warn('从 localStorage 读取 JD 失败:', e.message);
    return null;
  }
}

/**
 * 清除所有存储的数据
 */
export function clearAll() {
  try {
    localStorage.removeItem(STORAGE_KEYS.RESUME);
    localStorage.removeItem(STORAGE_KEYS.JD);
  } catch (e) {
    console.warn('清除 localStorage 失败:', e.message);
  }
}
