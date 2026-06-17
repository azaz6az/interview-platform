import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import StarIcon from '@mui/icons-material/Star';

/** 建议类型对应的图标和颜色 */
const TYPE_CONFIG = {
  keyword: {
    icon: <AddCircleOutlineIcon fontSize="small" />,
    color: '#1976d2',
    bgColor: '#e3f2fd',
    label: '关键词补充',
  },
  phrasing: {
    icon: <EditNoteIcon fontSize="small" />,
    color: '#7c4dff',
    bgColor: '#ede7f6',
    label: '措辞调整',
  },
  priority: {
    icon: <SwapVertIcon fontSize="small" />,
    color: '#ed6c02',
    bgColor: '#fff3e0',
    label: '优先级调整',
  },
  skill: {
    icon: <StarIcon fontSize="small" />,
    color: '#2e7d32',
    bgColor: '#e8f5e9',
    label: '技能匹配',
  },
};

/**
 * SuggestionCard - 单条修改建议卡片
 * @param {Object} props
 * @param {Object} props.suggestion - 建议对象 { type, title, description, original?, suggested? }
 * @param {number} props.index - 序号
 */
function SuggestionCard({ suggestion, index }) {
  const config = TYPE_CONFIG[suggestion.type] || TYPE_CONFIG.keyword;

  return (
    <Box
      sx={{
        mb: 1.5,
        p: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: config.color + '40',
        backgroundColor: config.bgColor,
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: `0 2px 8px ${config.color}30`,
          borderColor: config.color,
        },
      }}
    >
      {/* 标题行 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <Box sx={{ color: config.color, display: 'flex', alignItems: 'center' }}>
          {config.icon}
        </Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: config.color }}>
          {suggestion.title}
        </Typography>
        <Chip
          label={config.label}
          size="small"
          sx={{
            ml: 'auto',
            backgroundColor: config.color + '20',
            color: config.color,
            fontSize: '0.7rem',
            height: 22,
          }}
        />
      </Box>

      {/* 描述 */}
      <Typography variant="body2" color="text.primary" sx={{ ml: 3.5, mb: 0.5 }}>
        {suggestion.description}
      </Typography>

      {/* 原文 vs 建议的对比 */}
      {(suggestion.original || suggestion.suggested) && (
        <Box sx={{ ml: 3.5, mt: 1 }}>
          {suggestion.original && (
            <Box
              sx={{
                fontSize: '0.8rem',
                color: 'text.secondary',
                textDecoration: 'line-through',
                mb: 0.25,
              }}
            >
              原文：{suggestion.original}
            </Box>
          )}
          {suggestion.suggested && (
            <Box sx={{ fontSize: '0.8rem', color: config.color, fontWeight: 600 }}>
              建议：{suggestion.suggested}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

export default SuggestionCard;
