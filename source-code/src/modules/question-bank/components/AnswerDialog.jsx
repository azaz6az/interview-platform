import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { DIFFICULTY_LEVELS, POSITIONS } from '../../../shared/constants';

/**
 * AnswerDialog - Stripe 风格查看参考答案弹窗
 * Chip 使用 Stripe pill 风格
 * 按钮使用 Stripe Purple CTA
 */
function AnswerDialog({ question, onClose }) {
  if (!question) return null;

  const difficulty = DIFFICULTY_LEVELS.find((d) => d.id === question.difficulty) || DIFFICULTY_LEVELS[0];
  const position = POSITIONS.find((p) => p.id === question.position);

  return (
    <Dialog
      open={!!question}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      scroll="paper"
    >
      <DialogTitle sx={{ pb: 1, color: 'text.primary', fontWeight: 500 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
          <Chip
            label={difficulty.label}
            size="small"
            sx={{
              borderRadius: '4px',
              bgcolor: difficulty.color + '18',
              color: difficulty.color,
              fontWeight: 500,
              fontSize: '0.7rem',
            }}
          />
          <Chip
            label={question.category}
            size="small"
            sx={{
              borderRadius: '4px',
              fontSize: '0.7rem',
              bgcolor: 'background.paper',
              color: 'text.secondary',
              border: '1px solid',
              borderColor: 'divider',
            }}
          />
          {position && (
            <Chip
              label={position.label}
              size="small"
              sx={{
                borderRadius: '4px',
                fontSize: '0.7rem',
                bgcolor: 'rgba(83,58,253,0.08)',
                color: '#533afd',
                border: '1px solid #b9b9f9',
                fontWeight: 500,
              }}
            />
          )}
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 500, color: 'text.primary' }}>
          {question.question}
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: 'divider' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1, color: '#533afd' }}>
          参考答案
        </Typography>
        <Typography
          variant="body2"
          sx={{
            lineHeight: 1.8,
            whiteSpace: 'pre-wrap',
            bgcolor: 'action.hover',
            p: 2,
            borderRadius: '4px',
            borderColor: 'divider',
            color: 'text.primary',
            fontWeight: 300,
          }}
        >
          {question.answer}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          variant="contained"
          size="small"
          sx={{
            borderRadius: '4px',
            bgcolor: '#533afd',
            '&:hover': { bgcolor: '#4434d4' },
            fontWeight: 500,
          }}
        >
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AnswerDialog;
