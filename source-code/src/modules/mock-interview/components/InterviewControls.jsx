import React from 'react';
import { Box, Button, Typography, Chip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { MAX_INTERVIEW_ROUNDS, MIN_INTERVIEW_ROUNDS } from '../../../shared/constants';

/**
 * InterviewControls - Stripe 风格面试控制面板
 * 按钮采用 Stripe Purple CTA 风格 + 4px 圆角
 * Chip 采用 Stripe pill 风格
 */
function InterviewControls({
  isStarted,
  isFinished,
  currentRound,
  onStart,
  onFinish,
  onReset,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        flexWrap: 'wrap',
      }}
    >
      {/* 轮次指示 — Stripe pill Chip */}
      {isStarted && !isFinished && (
        <Chip
          label={`第 ${currentRound} / ${MAX_INTERVIEW_ROUNDS} 轮`}
          sx={{
            borderRadius: '4px',
            bgcolor: 'rgba(83,58,253,0.08)',
            color: '#533afd',
            fontWeight: 500,
            border: '1px solid #b9b9f9',
          }}
        />
      )}

      {/* 开始按钮 — Stripe Purple CTA */}
      {!isStarted && (
        <Button
          variant="contained"
          size="large"
          startIcon={<PlayArrowIcon />}
          onClick={onStart}
          sx={{
            borderRadius: '4px',
            px: 4,
            bgcolor: '#533afd',
            '&:hover': { bgcolor: '#4434d4' },
            fontWeight: 500,
          }}
        >
          开始面试
        </Button>
      )}

      {isStarted && !isFinished && currentRound >= MIN_INTERVIEW_ROUNDS && (
        <Button
          variant="outlined"
          startIcon={<StopIcon />}
          onClick={onFinish}
          sx={{
            borderRadius: '4px',
            borderColor: '#ea2261',
            color: '#ea2261',
            '&:hover': {
              borderColor: '#c41850',
              bgcolor: 'rgba(234,34,97,0.04)',
            },
          }}
        >
          结束面试
        </Button>
      )}

      {isFinished && (
        <Button
          variant="contained"
          startIcon={<RestartAltIcon />}
          onClick={onReset}
          sx={{
            borderRadius: '4px',
            px: 4,
            bgcolor: '#533afd',
            '&:hover': { bgcolor: '#4434d4' },
            fontWeight: 500,
          }}
        >
          重新开始
        </Button>
      )}

      {isStarted && !isFinished && currentRound < MIN_INTERVIEW_ROUNDS && (
        <Typography variant="caption" sx={{ color: '#64748d', fontWeight: 300 }}>
          至少完成 {MIN_INTERVIEW_ROUNDS} 轮后可结束
        </Typography>
      )}
    </Box>
  );
}

export default InterviewControls;
