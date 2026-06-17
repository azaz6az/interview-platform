import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { POSITIONS } from '../../../shared/constants';

/**
 * WeaknessAnalysis - Stripe 风格薄弱环节分析面板
 * Chip 使用 Stripe pill 风格
 * 颜色使用 Stripe 体系
 */
function WeaknessAnalysis({ weaknesses }) {
  if (!weaknesses || weaknesses.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4, color: '#64748d' }}>
        <Typography variant="body2" sx={{ fontWeight: 300 }}>暂无数据，请先创建复盘记录</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, color: '#061b31' }}>
        Top 3 薄弱环节
      </Typography>
      <List>
        {weaknesses.map((w, idx) => {
          const positionLabel = POSITIONS.find((p) => p.id === w.interviewType)?.label || w.interviewType;
          return (
            <ListItem key={idx} disableGutters>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <WarningAmberIcon sx={{ color: '#ea2261', fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#061b31' }}>
                      {w.category}
                    </Typography>
                    <Chip
                      label={positionLabel}
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
                  </Box>
                }
                secondary={
                  <Typography variant="caption" sx={{ color: '#64748d', fontWeight: 300 }}>
                    平均评分 {w.avgScore}/5 · 共 {w.count} 次
                  </Typography>
                }
              />
            </ListItem>
          );
        })}
      </List>

      {/* 推荐练习题 */}
      {weaknesses.some((w) => w.recommendedQuestions && w.recommendedQuestions.length > 0) && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1, color: '#061b31' }}>
            推荐练习
          </Typography>
          {weaknesses.map(
            (w, wIdx) =>
              w.recommendedQuestions &&
              w.recommendedQuestions.map((q, qIdx) => (
                <Box
                  key={`${wIdx}-${qIdx}`}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 0.5,
                    mb: 0.5,
                    pl: 2,
                  }}
                >
                  <ArrowForwardIcon sx={{ fontSize: 14, color: '#533afd', mt: 0.3 }} />
                  <Typography variant="caption" sx={{ lineHeight: 1.5, color: '#64748d', fontWeight: 300 }}>
                    {q.question.substring(0, 60)}...
                  </Typography>
                </Box>
              ))
          )}
        </Box>
      )}
    </Box>
  );
}

export default WeaknessAnalysis;
