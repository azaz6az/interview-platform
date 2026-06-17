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
import { GRADIENTS } from '../../../theme/theme';

/**
 * QuestionFilter - 题目筛选器（视觉增强版）
 * 选中态渐变底色 + 平滑过渡
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

  /** 统一的 ToggleButton 样式 */
  const toggleSx = {
    px: 1.5,
    py: 0.5,
    fontSize: '0.75rem',
    borderRadius: 1.5,
    fontWeight: 400,
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    color: 'text.secondary',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    '&.Mui-selected': {
      background: GRADIENTS.primary,
      color: '#fff',
      border: 'none',
      boxShadow: '0 2px 8px rgba(83,58,253,0.2)',
      '&:hover': {
        background: 'linear-gradient(135deg, #4434d4 0%, #6d28d9 100%)',
      },
    },
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2.5 }}>
      {/* 岗位筛选 */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
          岗位方向
        </Typography>
        <ToggleButtonGroup
          value={filters.position}
          exclusive
          onChange={handlePositionChange}
          size="small"
          sx={{ flexWrap: 'wrap', gap: 0.5 }}
        >
          <ToggleButton value="" sx={toggleSx}>
            全部
          </ToggleButton>
          {POSITIONS.map((pos) => (
            <ToggleButton key={pos.id} value={pos.id} sx={toggleSx}>
              {pos.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {/* 难度筛选 */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
          难度等级
        </Typography>
        <ToggleButtonGroup
          value={filters.difficulty}
          exclusive
          onChange={handleDifficultyChange}
          size="small"
        >
          <ToggleButton value="" sx={toggleSx}>
            全部
          </ToggleButton>
          {DIFFICULTY_LEVELS.map((d) => (
            <ToggleButton key={d.id} value={d.id} sx={toggleSx}>
              {d.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {/* 我的收藏 */}
      <Box>
        <Chip
          icon={<FavoriteIcon />}
          label="我的收藏"
          onClick={handleFavoritesToggle}
          sx={{
            cursor: 'pointer',
            borderRadius: 1.5,
            fontWeight: 500,
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: '0.75rem',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            ...(filters.favoritesOnly
              ? {
                  background: GRADIENTS.success,
                  color: '#fff',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(21,190,83,0.2)',
                  '& .MuiChip-icon': { color: '#fff' },
                }
              : {
                  bgcolor: 'background.paper',
                  color: 'text.secondary',
                  border: '1px solid',
                  borderColor: 'divider',
                }),
          }}
        />
      </Box>
    </Box>
  );
}

export default QuestionFilter;
