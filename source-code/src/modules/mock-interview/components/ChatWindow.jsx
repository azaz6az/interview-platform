import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  Typography,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ChatBubble from './ChatBubble';
import {
  isSpeechSupported,
  createRecognition,
} from '../engine/speechRecognition';

/**
 * ChatWindow - 聊天窗口（Stripe 风格 + 录音体验优化）
 *
 * 核心录音优化：
 * 1. 更大麦克风按钮 48x48，放在输入框左边
 * 2. 波形动画条（录音中在输入框上方显示 5 个动画条）
 * 3. 清晰录音状态：浅紫底 + placeholder "正在聆听..." + 紫色边框
 * 4. interim 显示优化：浅紫色 italic + "(识别中)" 标签
 * 5. 停止录音提示条
 * 6. Stripe Purple 脉冲动画
 * 7. Stripe 风格发送按钮
 * 8. 不支持语音时 Snackbar 提示
 *
 * @param {Object} props
 * @param {Array} props.messages - 消息列表 [{ role, content, timestamp }]
 * @param {Function} props.onSend - 发送消息回调
 * @param {boolean} props.disabled - 是否禁用输入
 * @param {boolean} props.isEvaluating - AI 是否正在评估
 */
function ChatWindow({ messages, onSend, disabled, isEvaluating }) {
  const [input, setInput] = useState('');
  /** interim 识别中文字（尚未确认的语音识别结果） */
  const [interimText, setInterimText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported] = useState(() => isSpeechSupported());
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  /** 首次使用提示 flag */
  const hasShownSpeechTip = useRef(false);

  /** 自动滚动到底部 */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * 组件卸载时停止语音识别并释放资源
   */
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.destroy();
        recognitionRef.current = null;
      }
    };
  }, []);

  /** 首次使用语音时提示推荐 Chrome */
  useEffect(() => {
    if (speechSupported && !hasShownSpeechTip.current) {
      hasShownSpeechTip.current = true;
      setSnackbarMessage('推荐使用 Chrome 浏览器获得最佳语音体验');
      setSnackbarOpen(true);
    }
  }, [speechSupported]);

  const handleSend = () => {
    /** 只发送已确认的 input，interimText 不发送 */
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput('');
    setInterimText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /**
   * 切换语音识别状态：开始/停止录音
   */
  const handleMicToggle = useCallback(() => {
    // 如果正在录音，则停止
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsRecording(false);
      return;
    }

    // 如果浏览器不支持语音识别，用 Snackbar 提示
    if (!speechSupported) {
      setSnackbarMessage('当前浏览器不支持语音输入，推荐使用 Chrome 浏览器');
      setSnackbarOpen(true);
      return;
    }

    try {
      // 创建语音识别实例
      const recognition = createRecognition({
        onResult: ({ transcript, isFinal }) => {
          if (isFinal) {
            // 最终结果：追加到 input，清除 interim
            setInput((prev) => prev + transcript);
            setInterimText('');
            // 最终结果确认后自动停止录音
            if (recognitionRef.current) {
              recognitionRef.current.stop();
              recognitionRef.current = null;
            }
            setIsRecording(false);
          } else {
            // 临时结果：只更新 interimText，不修改 input
            setInterimText(transcript);
          }
        },
        onEnd: () => {
          setIsRecording(false);
          recognitionRef.current = null;
          setInterimText('');
        },
        onError: ({ error }) => {
          console.warn('语音识别错误:', error);
          setIsRecording(false);
          recognitionRef.current = null;
          setInterimText('');
        },
      });

      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
      setInterimText('');
    } catch (err) {
      console.warn('语音识别启动失败:', err.message);
      setIsRecording(false);
    }
  }, [isRecording, speechSupported]);

  /** 关闭 Snackbar */
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: { xs: 400, md: 500 },
        border: '1px solid #e5edf5',
        borderRadius: '6px',
        overflow: 'hidden',
        bgcolor: '#ffffff',
        boxShadow: 'rgba(23,23,23,0.08) 0px 15px 35px 0px',
      }}
    >
      {/* 消息列表 */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          bgcolor: '#fafbfc',
        }}
      >
        {messages.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4, color: '#64748d' }}>
            <Typography variant="body2" sx={{ fontWeight: 300 }}>
              面试即将开始，请准备好你的回答
            </Typography>
          </Box>
        )}
        {messages.map((msg, idx) => (
          <ChatBubble key={idx} message={msg} />
        ))}
        {isEvaluating && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: '#533afd',
                animation: 'pulse 1.5s infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 0.4 },
                  '50%': { opacity: 1 },
                  '100%': { opacity: 0.4 },
                },
              }}
            />
            <Typography variant="body2" sx={{ color: '#64748d', fontWeight: 300 }}>
              AI 正在思考...
            </Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* ===== 录音波形动画条区域（录音中显示） ===== */}
      {isRecording && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            px: 2,
            py: 1,
            bgcolor: 'rgba(83,58,253,0.04)',
          }}
        >
          {[0, 0.15, 0.3, 0.45, 0.6].map((delay, idx) => (
            <Box
              key={idx}
              sx={{
                width: 4,
                height: 4,
                borderRadius: '2px',
                bgcolor: '#533afd',
                animation: `waveBar 0.8s ease-in-out ${delay}s infinite`,
              }}
            />
          ))}
        </Box>
      )}

      {/* ===== 停止录音提示条（录音中显示） ===== */}
      {isRecording && (
        <Box
          sx={{
            px: 2,
            py: 0.75,
            bgcolor: 'rgba(83,58,253,0.04)',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: '#533afd',
              fontWeight: 400,
              fontSize: '0.7rem',
              letterSpacing: '0.02em',
            }}
          >
            点击麦克风按钮停止录音 · 识别完成后自动停止
          </Typography>
        </Box>
      )}

      {/* 输入框区域 — Stripe 风格 */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          p: 1.5,
          borderTop: '1px solid #e5edf5',
          bgcolor: isRecording ? 'rgba(83,58,253,0.04)' : '#ffffff',
          alignItems: 'flex-end',
        }}
      >
        {/* 麦克风按钮 — 48x48 更大，放在输入框左边 */}
        <IconButton
          onClick={handleMicToggle}
          disabled={disabled}
          sx={{
            borderRadius: '4px',
            width: 48,
            height: 48,
            alignSelf: 'flex-end',
            flexShrink: 0,
            bgcolor: isRecording ? '#533afd' : 'rgba(83,58,253,0.06)',
            color: isRecording ? '#fff' : '#533afd',
            animation: isRecording ? 'micPulse 1.5s infinite' : 'none',
            '&:hover': {
              bgcolor: isRecording ? '#4434d4' : 'rgba(83,58,253,0.12)',
            },
            '&.Mui-disabled': {
              bgcolor: 'rgba(255,255,255,0.02)',
              color: '#64748d',
            },
          }}
        >
          {isRecording ? <MicOffIcon /> : <MicIcon />}
        </IconButton>

        {/* 输入框 + interim 显示 */}
        <Box sx={{ flex: 1, minWidth: 0, position: 'relative' }}>
          <TextField
            fullWidth
            multiline
            minRows={1}
            maxRows={3}
            placeholder={isRecording ? '正在聆听你的回答...' : '输入你的回答...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            inputRef={inputRef}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '4px',
                fontSize: '0.9rem',
                fontWeight: 300,
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                /** 录音中：紫色边框 */
                ...(isRecording && {
                  '& fieldset': {
                    borderColor: '#b9b9f9',
                  },
                  '&:hover fieldset': {
                    borderColor: '#533afd',
                  },
                }),
              },
            }}
          />
          {/* interim 识别中文字 — 浅紫色 italic + (识别中) 标签 */}
          {interimText && (
            <Box
              sx={{
                position: 'absolute',
                right: 12,
                bottom: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                pointerEvents: 'none',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: '#b9b9f9',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  fontSize: '0.8rem',
                }}
              >
                {interimText}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#b9b9f9',
                  fontSize: '0.6rem',
                  fontWeight: 400,
                  bgcolor: 'rgba(83,58,253,0.08)',
                  px: 0.5,
                  borderRadius: '2px',
                  lineHeight: 1.2,
                }}
              >
                识别中
              </Typography>
            </Box>
          )}
        </Box>

        {/* 发送按钮 — Stripe Purple CTA 风格 */}
        <IconButton
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          sx={{
            bgcolor: '#533afd',
            color: '#fff',
            borderRadius: '4px',
            width: 40,
            height: 40,
            alignSelf: 'flex-end',
            flexShrink: 0,
            '&:hover': { bgcolor: '#4434d4' },
            '&.Mui-disabled': {
              bgcolor: 'rgba(255,255,255,0.02)',
              color: '#64748d',
            },
          }}
        >
          <SendIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* 不支持语音的 Snackbar 提示 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="info"
          variant="outlined"
          sx={{
            borderColor: '#b9b9f9',
            color: '#533afd',
            bgcolor: '#ffffff',
            borderRadius: '4px',
            '& .MuiAlert-icon': { color: '#533afd' },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ChatWindow;
