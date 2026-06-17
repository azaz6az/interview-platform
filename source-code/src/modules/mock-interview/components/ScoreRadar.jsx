import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { EVALUATION_DIMENSIONS } from '../../../shared/constants';

/**
 * ScoreRadar - Stripe 风格多维度评分雷达图
 * 使用 Stripe Purple #533afd 替代原蓝色
 */
function ScoreRadar({ evaluation }) {
  if (!evaluation) return null;

  const data = EVALUATION_DIMENSIONS.map((dim) => ({
    dimension: dim.label,
    score: evaluation.dimensions?.[dim.key] ?? 0,
    fullMark: 5,
  }));

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, color: '#061b31' }}>
        多维度评分
      </Typography>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#e5edf5" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fontSize: 12, fill: '#64748d', fontWeight: 300 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 5]}
            tick={{ fontSize: 10, fill: '#64748d' }}
            tickCount={6}
          />
          <Radar
            name="评分"
            dataKey="score"
            stroke="#533afd"
            fill="#533afd"
            fillOpacity={0.15}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default ScoreRadar;
