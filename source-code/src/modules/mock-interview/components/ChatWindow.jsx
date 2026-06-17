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
import { GRADIENTS, SHADOWS } from '../../../theme/theme';

/**
 * ChatWindow - 聊天窗口
 * 渐变发送按钮 + 录音波形动画 + 答题计时器
 */
function ChatWindow({ messages, onSend, disabled, isEvaluating }) {
  const [input, setInput] = useState('');
  const [interimText, setInterimText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported] = useState(() => isSpeechSupported());
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const hasShownSpeechTip = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.destroy();
        recognitionRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (speechSupported && !hasShownSpeechTip.current) {
      hasShownSpeechTip.current = true;
      setSnackbarMessage('推荐使用 Chrome 浏览器获得最佳语音体验');
      setSnackbarOpen(true);
    }
  }, [speechSupported]);

  /** 答题计时器 */
  useEffect(() => {
    if (!isEvaluating && !disabled) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isEvaluating, disabled]);

  /** 每次 AI 发送新问题后重置计时器 */
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === 'ai') {
      setElapsedSeconds(0);
    }
  }, [messages.length]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput('');
    setInterimText('');
    setElapsedSeconds(0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMicToggle = useCallback(() => {
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsRecording(false);
      return;
    }

    if (!speechSupported) {
      setSnackbarMessage('当前浏览器不支持语音输入，推荐使用 Chrome 浏览器');
      setSnackbarOpen(true);
      return;
    }

    try {
      const recognition = createRecognition({
        onResult: ({ transcript, isFinal }) => {
          if (isFinal) {
            setInput((prev) => prev + transcript);
            setInterimText('');
            if (recognitionRef.current) {
              recognitionRef.current.stop();
              recognitionRef.current = null;
            }
            setIsRecording(false);
          } else {
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

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: { xs: 420, md: 520 },
        borderColor: 'divider',
        borderRadius: 3,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        boxShadow: SHADOWS.card,
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
          bgcolor: 'action.hover',
        }}
      >
        {messages.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                fontSize: '1.5rem',
              }}
            >
              🎤
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary', mb: 0.5 }}>
              准备好了吗？
            </Typography>
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
                background: GRADIENTS.primary,
                animation: 'pulse 1.5s infinite',
              }}
            />
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 300 }}>
              AI 正在思考...
            </Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* 录音波形动画条区域 */}
      {isRecording && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.75,
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
                background: GRADIENTS.primary,
                animation: `waveBar 0.8s ease-in-out ${delay}s infinite`,
              }}
            />
          ))}
        </Box>
      )}

      {/* 停止录音提示条 */}
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
              fontWeight: 500,
              fontSize: '0.7rem',
              letterSpacing: '0.02em',
            }}
          >
            点击麦克风按钮停止录音 · 识别完成后自动停止
          </Typography>
        </Box>
      )}

      {/* 输入框区域 */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          p: 1.5,
          pt: 2.5,
          borderColor: 'divider',
          bgcolor: isRecording ? 'rgba(83,58,253,0.04)' : 'background.paper',
          alignItems: 'flex-end',
          position: 'relative',
        }}
      >
        {/* 答题计时器 */}
        {!isEvaluating && !disabled && elapsedSeconds > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: -28,
              left: 12,
              fontSize: '0.7rem',
              color: elapsedSeconds > 60 ? '#ea2261' : 'text.secondary',
              fontWeight: 500,
              bgcolor: 'rgba(255,255,255,0.9)',
              px: 1,
              py: 0.25,
              borderRadius: 1,
              borderColor: 'divider',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            ⏱ {Math.floor(elapsedSeconds / 60)}:{String(elapsedSeconds % 60).padStart(2, '0')}
          </Box>
        )}

        {/* 麦克风按钮 */}
        <IconButton
          onClick={handleMicToggle}
          disabled={disabled}
          sx={{
            borderRadius: 2,
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
              bgcolor: 'rgba(0,0,0,0.04)',
              color: 'text.secondary',
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
                borderRadius: 2,
                fontSize: '0.9rem',
                fontWeight: 300,
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
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
          {/* interim 识别中文字 */}
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
                  fontWeight: 500,
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

        {/* 发送按钮 — 渐变背景 */}
        <IconButton
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          sx={{
            background: GRADIENTS.primary,
            color: '#fff',
            borderRadius: 2,
            width: 42,
            height: 42,
            alignSelf: 'flex-end',
            flexShrink: 0,
            '&:hover': {
              background: 'linear-gradient(135deg, #4434d4 0%, #6d28d9 100%)',
              boxShadow: '0 4px 12px rgba(83,58,253,0.3)',
            },
            '&.Mui-disabled': {
              background: 'rgba(0,0,0,0.06)',
              color: 'text.secondary',
            },
          }}
        >
          <SendIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Snackbar */}
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
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: SHADOWS.light,
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
