import React from 'react';
import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  Chip,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { POSITIONS, DIFFICULTY_LEVELS } from '../../../shared/constants';

/**
 * QuestionFilter - Stripe 风格题目筛选器
 * ToggleButton 改为 Stripe pill 风格
 * 收藏 Chip 使用 Stripe pill
 * @param {Object} props
 * @param {Object} props.filters - 当前筛选条件 { position, difficulty, favoritesOnly }
 * @param {Function} props.onFilterChange - 筛选变更回调
 */
function QuestionFilter({ filters, onFilterChange }) {
  const handlePositionChange = (_e, value) => {
    onFilterChange({ position: value || '' });
  };

  const handleDifficultyChange = (_e, value) => {
    onFilterChange({ difficulty: value || '' });
  };

  const handleFavoritesToggle = () => {
    onFilterChange({ favoritesOnly: !filters.favoritesOnly });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
      {/* 岗位筛选 — Stripe pill ToggleButton */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500, color: '#273951' }}>
          岗位方向
        </Typography>
        <ToggleButtonGroup
          value={filters.position}
          exclusive
          onChange={handlePositionChange}
          size="small"
          sx={{ flexWrap: 'wrap', gap: 0.5 }}
        >
          <ToggleButton
            value=""
            sx={{
              px: 1.5,
              py: 0.5,
              fontSize: '0.75rem',
              borderRadius: '4px',
              fontWeight: 400,
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
              color: '#64748d',
              '&.Mui-selected': {
                bgcolor: 'rgba(83,58,253,0.08)',
                color: '#533afd',
                border: '1px solid #b9b9f9',
              },
            }}
          >
            全部
          </ToggleButton>
          {POSITIONS.map((pos) => (
            <ToggleButton
              key={pos.id}
              value={pos.id}
              sx={{
                px: 1.5,
                py: 0.5,
                fontSize: '0.75rem',
                borderRadius: '4px',
                fontWeight: 400,
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                color: '#64748d',
                '&.Mui-selected': {
                  bgcolor: 'rgba(83,58,253,0.08)',
                  color: '#533afd',
                  border: '1px solid #b9b9f9',
                },
              }}
            >
              {pos.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {/* 难度筛选 — Stripe pill ToggleButton */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500, color: '#273951' }}>
          难度等级
        </Typography>
        <ToggleButtonGroup
          value={filters.difficulty}
          exclusive
          onChange={handleDifficultyChange}
          size="small"
        >
          <ToggleButton
            value=""
            sx={{
              px: 1.5,
              py: 0.5,
              fontSize: '0.75rem',
              borderRadius: '4px',
              fontWeight: 400,
              fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
              color: '#64748d',
              '&.Mui-selected': {
                bgcolor: 'rgba(83,58,253,0.08)',
                color: '#533afd',
                border: '1px solid #b9b9f9',
              },
            }}
          >
            全部
          </ToggleButton>
          {DIFFICULTY_LEVELS.map((d) => (
            <ToggleButton
              key={d.id}
              value={d.id}
              sx={{
                px: 1.5,
                py: 0.5,
                fontSize: '0.75rem',
                borderRadius: '4px',
                fontWeight: 400,
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                color: '#64748d',
                '&.Mui-selected': {
                  bgcolor: 'rgba(83,58,253,0.08)',
                  color: '#533afd',
                  border: '1px solid #b9b9f9',
                },
              }}
            >
              {d.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {/* 我的收藏筛选 — Stripe pill Chip */}
      <Box>
        <Chip
          icon={<FavoriteIcon />}
          label="我的收藏"
          onClick={handleFavoritesToggle}
          sx={{
            cursor: 'pointer',
            borderRadius: '4px',
            fontWeight: 500,
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: '0.75rem',
            ...(filters.favoritesOnly
              ? {
                  bgcolor: 'rgba(21,190,83,0.15)',
                  color: '#108c3d',
                  border: '1px solid rgba(21,190,83,0.3)',
                }
              : {
                  bgcolor: '#ffffff',
                  color: '#64748d',
                  border: '1px solid #e5edf5',
                  variant: 'outlined',
                }),
          }}
        />
      </Box>
    </Box>
  );
}

export default QuestionFilter;
