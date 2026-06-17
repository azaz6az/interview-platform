import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/**
 * TrendChart - Stripe 风格感受评分趋势图
 * 线条使用 Stripe Purple #533afd
 * 网格使用 #e5edf5
 */
function TrendChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4, color: '#64748d' }}>
        <Typography variant="body2" sx={{ fontWeight: 300 }}>暂无数据</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, color: '#061b31' }}>
        感受评分趋势
      </Typography>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5edf5" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748d' }} />
          <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11, fill: '#64748d' }} />
          <Tooltip
            formatter={(value, name) => [`${value} 分`, name === 'avgScore' ? '平均评分' : name]}
            labelFormatter={(label) => `日期: ${label}`}
            contentStyle={{
              borderRadius: '4px',
              border: '1px solid #e5edf5',
              boxShadow: 'rgba(23,23,23,0.08) 0px 15px 35px 0px',
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          />
          <Line
            type="monotone"
            dataKey="avgScore"
            stroke="#533afd"
            strokeWidth={2}
            dot={{ r: 4, fill: '#533afd' }}
            activeDot={{ r: 6 }}
            name="avgScore"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default TrendChart;
