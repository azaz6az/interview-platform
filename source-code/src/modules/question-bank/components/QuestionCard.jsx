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

/**
 * QuestionCard - Stripe 风格题目卡片
 * 白底 + #e5edf5 边框 + 6px 圆角 + 蓝色调阴影
 * Chip 使用 Stripe pill 风格
 * 收藏按钮使用 Stripe Purple/Ruby
 */
function QuestionCard({ question, isFavorite, onToggleFavorite, onViewDetail }) {
  const difficulty = DIFFICULTY_LEVELS.find((d) => d.id === question.difficulty) || DIFFICULTY_LEVELS[0];

  return (
    <Card
      sx={{
        cursor: 'pointer',
        border: '1px solid #e5edf5',
        borderRadius: '6px',
        boxShadow: 'rgba(23,23,23,0.08) 0px 15px 35px 0px',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: 'rgba(50,50,93,0.25) 0px 30px 45px -30px, rgba(0,0,0,0.1) 0px 18px 36px -18px',
          transform: 'translateY(-1px)',
        },
      }}
      onClick={() => onViewDetail(question)}
    >
      <CardContent sx={{ '&:last-child': { pb: 2 } }}>
        {/* 标签行 — Stripe pill Chip */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
          <Chip
            label={difficulty.label}
            size="small"
            sx={{
              bgcolor: difficulty.color + '18',
              color: difficulty.color,
              fontWeight: 500,
              fontSize: '0.7rem',
              height: 22,
              borderRadius: '4px',
            }}
          />
          <Chip
            label={question.category}
            size="small"
            variant="outlined"
            sx={{
              fontSize: '0.7rem',
              height: 22,
              borderRadius: '4px',
              borderColor: '#e5edf5',
              color: '#64748d',
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
                  color: isFavorite ? '#ea2261' : '#64748d',
                  '&:hover': { color: '#ea2261' },
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
            color: '#061b31',
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
