import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { DIFFICULTY_LEVELS } from '../../../shared/constants';
import { SHADOWS } from '../../../theme/theme';

/** 难度对应的渐变色条 */
const DIFFICULTY_GRADIENTS = {
  easy: 'linear-gradient(90deg, #15be53, #10b981)',
  medium: 'linear-gradient(90deg, #3b82f6, #6366f1)',
  hard: 'linear-gradient(90deg, #ea2261, #f43f5e)',
};

/**
 * QuestionCard - 题目卡片（视觉增强版）
 * 顶部难度色条 + hover 浮动 + 彩色阴影
 */
function QuestionCard({ question, isFavorite, onToggleFavorite, onViewDetail }) {
  const difficulty = DIFFICULTY_LEVELS.find((d) => d.id === question.difficulty) || DIFFICULTY_LEVELS[0];
  const gradientBar = DIFFICULTY_GRADIENTS[question.difficulty] || DIFFICULTY_GRADIENTS.easy;

  return (
    <Card
      sx={{
        cursor: 'pointer',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: gradientBar,
          borderRadius: '12px 12px 0 0',
        },
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: SHADOWS.light,
          borderColor: 'transparent',
        },
      }}
      onClick={() => onViewDetail(question)}
    >
      <CardContent sx={{ '&:last-child': { pb: 2 } }}>
        {/* 标签行 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
          <Chip
            label={difficulty.label}
            size="small"
            sx={{
              bgcolor: difficulty.color + '15',
              color: difficulty.color,
              fontWeight: 600,
              fontSize: '0.68rem',
              height: 22,
              borderRadius: 1.5,
            }}
          />
          <Chip
            label={question.category}
            size="small"
            variant="outlined"
            sx={{
              fontSize: '0.68rem',
              height: 22,
              borderRadius: 1.5,
              borderColor: 'divider',
              color: 'text.secondary',
            }}
          />
          <Box sx={{ ml: 'auto' }}>
            <Tooltip title={isFavorite ? '取消收藏' : '收藏'}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(question.id);
                }}
                sx={{
                  color: isFavorite ? '#ea2261' : 'text.secondary',
                  transition: 'all 0.2s ease',
                  '&:hover': { color: '#ea2261', transform: 'scale(1.15)' },
                }}
              >
                {isFavorite ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* 题目文本 */}
        <Typography
          variant="body2"
          sx={{
            lineHeight: 1.7,
            fontWeight: 300,
            color: 'text.primary',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {question.question}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default QuestionCard;
