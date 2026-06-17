import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * ScoreGauge - Stripe 风格匹配度评分仪表盘
 * 使用 SVG 绘制圆弧进度条
 * 颜色使用 Stripe 体系
 * @param {Object} props
 * @param {number} props.score - 匹配度分数 (0-100)
 */
function ScoreGauge({ score }) {
  const clampedScore = Math.max(0, Math.min(100, score));

  const size = 160;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (clampedScore / 100) * circumference;
  const offset = circumference - progress;

  /** 颜色使用 Stripe 体系 */
  const getColor = (s) => {
    if (s >= 80) return '#15be53';
    if (s >= 60) return '#533afd';
    if (s >= 40) return '#ea2261';
    return '#ea2261';
  };

  const getColorLabel = (s) => {
    if (s >= 80) return '优秀匹配';
    if (s >= 60) return '良好匹配';
    if (s >= 40) return '一般匹配';
    return '需要优化';
  };

  const color = getColor(clampedScore);

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5edf5" strokeWidth={strokeWidth} strokeLinecap="round" />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-in-out, stroke 0.5s ease' }}
        />
      </svg>
      <Box sx={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h3" component="span" sx={{ fontWeight: 300, color, lineHeight: 1, letterSpacing: '-0.64px' }}>
          {clampedScore}
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748d', mt: 0.5, fontSize: '0.75rem', fontWeight: 300 }}>
          {getColorLabel(clampedScore)}
        </Typography>
      </Box>
    </Box>
  );
}

export default ScoreGauge;
