import React from 'react';
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { POSITIONS, EVALUATION_DIMENSIONS } from '../../../shared/constants';

/**
 * FeedbackPanel - Stripe 风格面试评分反馈面板
 * 分数颜色改用 Stripe 体系
 * Chip 使用 Stripe pill 风格
 */
function FeedbackPanel({ evaluation, positionId }) {
  if (!evaluation) return null;

  const positionLabel =
    POSITIONS.find((p) => p.id === positionId)?.label || '未知';

  /** 获取分数对应颜色 — Stripe 体系 */
  const getScoreColor = (score) => {
    if (score >= 4) return '#15be53';
    if (score >= 3) return '#ea2261';
    return '#ea2261';
  };

  return (
    <Box>
      {/* 总分 */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 300, color: getScoreColor(evaluation.overallScore), letterSpacing: '-0.64px' }}>
          {evaluation.overallScore}
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748d', fontWeight: 300 }}>
          {positionLabel} · 综合评分（满分5分）
        </Typography>
      </Box>

      <Divider sx={{ my: 2, borderColor: '#e5edf5' }} />

      {/* 各维度得分 */}
      <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1, color: '#061b31' }}>
        维度评分
      </Typography>
      <List dense>
        {EVALUATION_DIMENSIONS.map((dim) => {
          const score = evaluation.dimensions?.[dim.key] ?? 0;
          return (
            <ListItem key={dim.key} disableGutters>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <StarIcon sx={{ fontSize: 18, color: getScoreColor(score) }} />
              </ListItemIcon>
              <ListItemText
                primary={dim.label}
                primaryTypographyProps={{ fontSize: '0.85rem', color: '#061b31', fontWeight: 400 }}
              />
              <Chip
                label={`${score} / 5`}
                size="small"
                sx={{
                  borderRadius: '4px',
                  fontWeight: 500,
                  color: getScoreColor(score),
                  bgcolor: getScoreColor(score) + '18',
                  fontSize: '0.7rem',
                }}
              />
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ my: 2, borderColor: '#e5edf5' }} />

      {/* 改进建议 */}
      {evaluation.suggestions && evaluation.suggestions.length > 0 && (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1, color: '#061b31' }}>
            改进建议
          </Typography>
          {evaluation.suggestions.map((s, idx) => (
            <Box
              key={idx}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1,
                mb: 1,
                p: 1.5,
                borderRadius: '4px',
                bgcolor: 'rgba(83,58,253,0.04)',
                border: '1px solid #e5edf5',
              }}
            >
              <LightbulbIcon sx={{ fontSize: 18, color: '#533afd', mt: 0.2 }} />
              <Typography variant="body2" sx={{ lineHeight: 1.6, color: '#061b31', fontWeight: 300 }}>
                {s}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default FeedbackPanel;
