import React from 'react';
import {
  Box,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { INTERVIEW_TYPES } from '../../../shared/constants';

/**
 * ReviewTimeline - Stripe 风格复盘时间线
 * 使用 Stripe 风格的竖线 + 圆点标记
 * Chip 使用 Stripe pill 风格
 * @param {Object} props
 * @param {Array} props.entries - 复盘条目数组
 * @param {Function} props.onEdit - 编辑回调
 * @param {Function} props.onDelete - 删除回调
 */
function ReviewTimeline({ entries, onEdit, onDelete }) {
  if (entries.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4, color: '#64748d' }}>
        <Typography variant="body2" sx={{ fontWeight: 300 }}>
          暂无复盘记录，点击"新建复盘"开始记录
        </Typography>
      </Box>
    );
  }

  /** 感受评分颜色 — Stripe 体系 */
  const getFeelingColor = (score) => {
    if (score >= 4) return '#15be53';
    if (score >= 3) return '#ea2261';
    return '#ea2261';
  };

  const getFeelingLabel = (score) => {
    const labels = { 1: '很差', 2: '较差', 3: '一般', 4: '良好', 5: '很棒' };
    return labels[score] || '一般';
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {/* 时间线竖线 */}
      <Box
        sx={{
          position: 'absolute',
          left: 6,
          top: 8,
          bottom: 8,
          width: 2,
          bgcolor: '#e5edf5',
          borderRadius: 1,
        }}
      />
      <List sx={{ pl: 0 }}>
        {entries.map((entry, idx) => {
          const typeLabel = INTERVIEW_TYPES.find((t) => t.id === entry.interviewType)?.label || entry.interviewType || '未分类';
          const dateStr = entry.date
            ? new Date(entry.date).toLocaleDateString('zh-CN')
            : '未知日期';

          return (
            <ListItem key={entry.id} disablePadding sx={{ mb: 0.5, position: 'relative' }}>
              {/* 时间线圆点标记 — Stripe 风格 */}
              <Box
                sx={{
                  position: 'absolute',
                  left: 2,
                  top: 14,
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: idx === 0 ? '#533afd' : '#e5edf5',
                  border: idx === 0 ? '2px solid #533afd' : '2px solid #e5edf5',
                  zIndex: 1,
                }}
              />
              <ListItemButton
                onClick={() => onEdit(entry)}
                sx={{
                  borderRadius: '4px',
                  ml: 3,
                  '&:hover': { bgcolor: 'rgba(83,58,253,0.04)' },
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 500, color: '#061b31' }}>
                        {entry.question ? entry.question.substring(0, 40) + (entry.question.length > 40 ? '...' : '') : '复盘记录'}
                      </Typography>
                      <Chip
                        label={typeLabel}
                        size="small"
                        sx={{
                          fontSize: '0.65rem',
                          height: 18,
                          borderRadius: '4px',
                          bgcolor: 'rgba(83,58,253,0.08)',
                          color: '#533afd',
                          fontWeight: 500,
                          border: '1px solid #b9b9f9',
                        }}
                      />
                      <Chip
                        label={getFeelingLabel(entry.feeling)}
                        size="small"
                        sx={{
                          fontSize: '0.65rem',
                          height: 18,
                          borderRadius: '4px',
                          bgcolor: getFeelingColor(entry.feeling) + '18',
                          color: getFeelingColor(entry.feeling),
                          fontWeight: 500,
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                      <AccessTimeIcon sx={{ fontSize: 14, color: '#64748d' }} />
                      <Typography variant="caption" sx={{ color: '#64748d', fontWeight: 300 }}>
                        {dateStr}
                      </Typography>
                    </Box>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}

export default ReviewTimeline;
