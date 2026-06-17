import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import EmptyState from '../../../shared/EmptyState';

function TrendChart({ data }) {
  if (!data || data.length === 0) {
    return <EmptyState icon="📈" title="暂无趋势数据" description="创建复盘记录后，这里会显示你的感受评分趋势" />;
  }

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, color: 'text.primary' }}>
        感受评分趋势
      </Typography>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={'var(--mui-palette-divider)'} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--mui-palette-text-secondary)' }} />
          <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11, fill: 'var(--mui-palette-text-secondary)' }} />
          <Tooltip
            formatter={(value, name) => [`${value} 分`, name === 'avgScore' ? '平均评分' : name]}
            labelFormatter={(label) => `日期: ${label}`}
            contentStyle={{
              borderRadius: '4px',
              border: '1px solid',
              borderColor: 'var(--mui-palette-divider)',
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
