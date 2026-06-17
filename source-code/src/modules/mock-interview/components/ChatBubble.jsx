import React from 'react';
import { Box, Typography } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

/**
 * ChatBubble - Stripe 风格聊天气泡
 * AI 消息：白底 + #e5edf5 边框 + 6px 圆角
 * 用户消息：Stripe Purple #533afd 底 + 白色文字 + 6px 圆角
 * @param {Object} props
 * @param {Object} props.message - { role: 'ai'|'user', content, timestamp }
 */
function ChatBubble({ message }) {
  const isAI = message.role === 'ai';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isAI ? 'row' : 'row-reverse',
        alignItems: 'flex-start',
        gap: 1,
      }}
    >
      {/* 头像 */}
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: isAI ? '#533afd' : '#ea2261',
          color: '#fff',
          flexShrink: 0,
        }}
      >
        {isAI ? <SmartToyIcon sx={{ fontSize: 18 }} /> : <PersonIcon sx={{ fontSize: 18 }} />}
      </Box>

      {/* 气泡内容 — Stripe 风格 */}
      <Box
        sx={{
          maxWidth: '75%',
          px: 2,
          py: 1.5,
          borderRadius: '6px',
          /** AI 消息：白底 + #e5edf5 边框 */
          ...(isAI
            ? {
                bgcolor: '#ffffff',
                border: '1px solid #e5edf5',
                color: '#061b31',
              }
            : {
                /** 用户消息：Stripe Purple 底 + 白色文字 */
                bgcolor: '#533afd',
                color: '#ffffff',
              }),
        }}
      >
        <Typography
          variant="body2"
          sx={{
            whiteSpace: 'pre-wrap',
            lineHeight: 1.7,
            fontWeight: 300,
            fontSize: '0.875rem',
            color: isAI ? '#061b31' : '#ffffff',
          }}
        >
          {message.content}
        </Typography>
      </Box>
    </Box>
  );
}

export default ChatBubble;
