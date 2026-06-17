import React from 'react';
import { Box, Button, Typography, Chip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { MAX_INTERVIEW_ROUNDS, MIN_INTERVIEW_ROUNDS } from '../../../shared/constants';
import { GRADIENTS, SHADOWS } from '../../../theme/theme';

/**
 * InterviewControls - 面试控制面板（视觉增强版）
 * 渐变按钮 + 彩色 Chip
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
      {/* 轮次指示 */}
      {isStarted && !isFinished && (
        <Chip
          label={`第 ${currentRound} / ${MAX_INTERVIEW_ROUNDS} 轮`}
          sx={{
            borderRadius: 1.5,
            background: 'linear-gradient(135deg, rgba(83,58,253,0.1) 0%, rgba(124,58,237,0.1) 100%)',
            color: '#533afd',
            fontWeight: 600,
            border: '1px solid #b9b9f9',
          }}
        />
      )}

      {/* 开始按钮 */}
      {!isStarted && (
        <Button
          variant="contained"
          size="large"
          startIcon={<PlayArrowIcon />}
          onClick={onStart}
          sx={{
            borderRadius: 2,
            px: 4,
            background: GRADIENTS.primary,
            '&:hover': {
              background: 'linear-gradient(135deg, #4434d4 0%, #6d28d9 100%)',
              boxShadow: SHADOWS.purple,
            },
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
            borderRadius: 2,
            borderColor: '#ea2261',
            color: '#ea2261',
            '&:hover': {
              borderColor: '#c41850',
              bgcolor: 'rgba(234,34,97,0.04)',
              boxShadow: '0 0 0 3px rgba(234,34,97,0.08)',
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
            borderRadius: 2,
            px: 4,
            background: GRADIENTS.primary,
            '&:hover': {
              background: 'linear-gradient(135deg, #4434d4 0%, #6d28d9 100%)',
              boxShadow: SHADOWS.purple,
            },
            fontWeight: 500,
          }}
        >
          重新开始
        </Button>
      )}

      {isStarted && !isFinished && currentRound < MIN_INTERVIEW_ROUNDS && (
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 300 }}>
          至少完成 {MIN_INTERVIEW_ROUNDS} 轮后可结束
        </Typography>
      )}
    </Box>
  );
}

export default InterviewControls;
