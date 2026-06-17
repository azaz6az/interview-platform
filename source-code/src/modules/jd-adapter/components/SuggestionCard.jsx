import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import StarIcon from '@mui/icons-material/Star';

/** 建议类型对应的图标和颜色 — Stripe 体系 */
const TYPE_CONFIG = {
  keyword: {
    icon: <AddCircleOutlineIcon fontSize="small" />,
    color: '#533afd',
    bgColor: 'rgba(83,58,253,0.04)',
    label: '关键词补充',
  },
  phrasing: {
    icon: <EditNoteIcon fontSize="small" />,
    color: '#533afd',
    bgColor: 'rgba(83,58,253,0.06)',
    label: '措辞调整',
  },
  priority: {
    icon: <SwapVertIcon fontSize="small" />,
    color: '#ea2261',
    bgColor: 'rgba(234,34,97,0.04)',
    label: '优先级调整',
  },
  skill: {
    icon: <StarIcon fontSize="small" />,
    color: '#15be53',
    bgColor: 'rgba(21,190,83,0.06)',
    label: '技能匹配',
  },
};

/**
 * SuggestionCard - Stripe 风格单条修改建议卡片
 * 4px 圆角 + Stripe 色彩体系 + 蓝色调阴影
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
        borderRadius: '4px',
        border: '1px solid',
        borderColor: config.color + '40',
        backgroundColor: config.bgColor,
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: 'rgba(23,23,23,0.06) 0px 3px 6px 0px',
          borderColor: config.color,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <Box sx={{ color: config.color, display: 'flex', alignItems: 'center' }}>
          {config.icon}
        </Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 500, color: config.color }}>
          {suggestion.title}
        </Typography>
        <Chip
          label={config.label}
          size="small"
          sx={{
            ml: 'auto',
            borderRadius: '4px',
            backgroundColor: config.color + '18',
            color: config.color,
            fontSize: '0.7rem',
            height: 22,
            fontWeight: 500,
          }}
        />
      </Box>

      <Typography variant="body2" sx={{ ml: 3.5, mb: 0.5, color: '#061b31', fontWeight: 300 }}>
        {suggestion.description}
      </Typography>

      {(suggestion.original || suggestion.suggested) && (
        <Box sx={{ ml: 3.5, mt: 1 }}>
          {suggestion.original && (
            <Box sx={{ fontSize: '0.8rem', color: '#64748d', textDecoration: 'line-through', mb: 0.25 }}>
              原文：{suggestion.original}
            </Box>
          )}
          {suggestion.suggested && (
            <Box sx={{ fontSize: '0.8rem', color: config.color, fontWeight: 500 }}>
              建议：{suggestion.suggested}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

export default SuggestionCard;
