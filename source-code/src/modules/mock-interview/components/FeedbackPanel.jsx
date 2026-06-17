import React, { useState } from 'react';
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { POSITIONS, EVALUATION_DIMENSIONS } from '../../../shared/constants';
import questionsData from '../../question-bank/data/questions.json';

/**
 * FeedbackPanel - Stripe 风格面试评分反馈面板
 * 分数颜色改用 Stripe 体系
 * Chip 使用 Stripe pill 风格
 */
function FeedbackPanel({ evaluation, positionId, messages }) {
  if (!evaluation) return null;

  const [compareOpen, setCompareOpen] = useState(false);
  const [compareIdx, setCompareIdx] = useState(0);

  const positionLabel =
    POSITIONS.find((p) => p.id === positionId)?.label || '未知';

  /** 获取用户回答和对应的参考答案 */
  const getComparisonData = () => {
    if (!messages) return [];
    const pairs = [];
    const aiMessages = messages.filter((m) => m.role === 'ai');
    const userMessages = messages.filter((m) => m.role === 'user');

    for (let i = 0; i < userMessages.length; i++) {
      const aiMsg = aiMessages[i];
      const userMsg = userMessages[i];
      const questionId = aiMsg?.questionId;
      const refQuestion = questionsData.find((q) => q.id === questionId);
      pairs.push({
        question: aiMsg?.content || '',
        userAnswer: userMsg?.content || '',
        referenceAnswer: refQuestion?.answer || null,
      });
    }
    return pairs;
  };

  const comparisons = getComparisonData();

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
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 300 }}>
          {positionLabel} · 综合评分（满分5分）
        </Typography>
      </Box>

      <Divider sx={{ my: 2, borderColor: 'divider' }} />

      {/* 各维度得分 */}
      <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1, color: 'text.primary' }}>
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
                primaryTypographyProps={{ fontSize: '0.85rem', color: 'text.primary', fontWeight: 400 }}
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

      <Divider sx={{ my: 2, borderColor: 'divider' }} />

      {/* 改进建议 */}
      {evaluation.suggestions && evaluation.suggestions.length > 0 && (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1, color: 'text.primary' }}>
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
                borderRadius: 2,
                bgcolor: 'rgba(83,58,253,0.04)',
                borderColor: 'divider',
              }}
            >
              <LightbulbIcon sx={{ fontSize: 18, color: '#533afd', mt: 0.2 }} />
              <Typography variant="body2" sx={{ lineHeight: 1.6, color: 'text.primary', fontWeight: 300 }}>
                {s}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* 参考答案对比按钮 */}
      {comparisons.some((c) => c.referenceAnswer) && (
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<CompareArrowsIcon />}
            onClick={() => { setCompareIdx(0); setCompareOpen(true); }}
            sx={{ borderRadius: 2 }}
          >
            查看参考答案
          </Button>
        </Box>
      )}

      {/* 参考答案对比弹窗 */}
      <Dialog
        open={compareOpen}
        onClose={() => setCompareOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 500 }}>
          参考答案对比 ({compareIdx + 1}/{comparisons.length})
        </DialogTitle>
        <DialogContent dividers>
          {comparisons[compareIdx] && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, color: '#533afd', fontWeight: 600 }}>
                面试题目
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'text.primary', lineHeight: 1.7 }}>
                {comparisons[compareIdx].question}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: '#ea2261', fontWeight: 600 }}>
                    你的回答
                  </Typography>
                  <Box sx={{
                    p: 2, borderRadius: 2, bgcolor: 'action.hover', borderColor: 'divider',
                    fontSize: '0.85rem', lineHeight: 1.7, color: 'text.primary', fontWeight: 300,
                    whiteSpace: 'pre-wrap', minHeight: 100,
                  }}>
                    {comparisons[compareIdx].userAnswer}
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: '#15be53', fontWeight: 600 }}>
                    参考答案
                  </Typography>
                  <Box sx={{
                    p: 2, borderRadius: 2, bgcolor: '#f0fdf4', border: '1px solid rgba(21,190,83,0.2)',
                    fontSize: '0.85rem', lineHeight: 1.7, color: 'text.primary', fontWeight: 300,
                    whiteSpace: 'pre-wrap', minHeight: 100,
                  }}>
                    {comparisons[compareIdx].referenceAnswer || '该题目暂无参考答案'}
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            disabled={compareIdx <= 0}
            onClick={() => setCompareIdx((i) => i - 1)}
            sx={{ borderRadius: 2 }}
          >
            上一题
          </Button>
          <Button
            disabled={compareIdx >= comparisons.length - 1}
            onClick={() => setCompareIdx((i) => i + 1)}
            sx={{ borderRadius: 2 }}
          >
            下一题
          </Button>
          <Button variant="contained" onClick={() => setCompareOpen(false)} sx={{ borderRadius: 2 }}>
            关闭
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default FeedbackPanel;
