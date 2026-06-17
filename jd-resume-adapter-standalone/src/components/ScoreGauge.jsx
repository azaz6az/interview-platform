import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * ScoreGauge - 匹配度评分仪表盘
 * 使用 SVG 绘制圆弧进度条，展示分数
 * @param {Object} props
 * @param {number} props.score - 匹配度分数 (0-100)
 */
function ScoreGauge({ score }) {
  const clampedScore = Math.max(0, Math.min(100, score));

  // 圆弧参数
  const size = 160;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (clampedScore / 100) * circumference;
  const offset = circumference - progress;

  // 根据分数决定颜色
  const getColor = (s) => {
    if (s >= 80) return '#2e7d32';
    if (s >= 60) return '#ed6c02';
    if (s >= 40) return '#f57c00';
    return '#d32f2f';
  };

  const getColorLabel = (s) => {
    if (s >= 80) return '优秀匹配';
    if (s >= 60) return '良好匹配';
    if (s >= 40) return '一般匹配';
    return '需要优化';
  };

  const color = getColor(clampedScore);

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* 背景圆弧 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e0e0e0"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* 进度圆弧 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 1s ease-in-out, stroke 0.5s ease',
          }}
        />
      </svg>

      {/* 中心文字 */}
      <Box
        sx={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="h3"
          component="span"
          sx={{
            fontWeight: 800,
            color,
            lineHeight: 1,
          }}
        >
          {clampedScore}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            mt: 0.5,
            fontSize: '0.75rem',
          }}
        >
          {getColorLabel(clampedScore)}
        </Typography>
      </Box>
    </Box>
  );
}

export default ScoreGauge;
