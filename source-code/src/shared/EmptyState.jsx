import React from 'react';
import { Box, Typography, Button } from '@mui/material';

/**
 * EmptyState - 统一空状态组件
 * 用于替换散落在各处的纯文本空状态
 */
function EmptyState({ icon, title, description, actionLabel, onAction, minHeight = 200 }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        minHeight,
        animation: 'fadeIn 0.4s ease-out',
      }}
    >
      {icon && (
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            bgcolor: 'action.hover',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            fontSize: '1.6rem',
          }}
        >
          {icon}
        </Box>
      )}
      <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5, textAlign: 'center' }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', maxWidth: 320, mb: onAction && actionLabel ? 2 : 0 }}>
          {description}
        </Typography>
      )}
      {onAction && actionLabel && (
        <Button variant="outlined" size="small" onClick={onAction} sx={{ mt: 1, borderRadius: 2 }}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}

export default EmptyState;
