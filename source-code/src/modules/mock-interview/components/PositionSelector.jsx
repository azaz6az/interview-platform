import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Grid,
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import StorageIcon from '@mui/icons-material/Storage';
import SchoolIcon from '@mui/icons-material/School';
import { POSITIONS } from '../../../shared/constants';
import { GRADIENTS, SHADOWS, ACCENT_BG } from '../../../theme/theme';

/** 岗位图标映射 + 配色 */
const ICON_MAP = {
  BarChart: { icon: <BarChartIcon sx={{ fontSize: 40 }} />, bg: ACCENT_BG.purple, color: '#533afd' },
  TrendingUp: { icon: <TrendingUpIcon sx={{ fontSize: 40 }} />, bg: ACCENT_BG.pink, color: '#ea2261' },
  BusinessCenter: { icon: <BusinessCenterIcon sx={{ fontSize: 40 }} />, bg: ACCENT_BG.blue, color: '#3b82f6' },
  Storage: { icon: <StorageIcon sx={{ fontSize: 40 }} />, bg: ACCENT_BG.green, color: '#15be53' },
  School: { icon: <SchoolIcon sx={{ fontSize: 40 }} />, bg: ACCENT_BG.orange, color: '#f59e0b' },
};

/**
 * PositionSelector - 岗位方向选择器（视觉增强版）
 * 每个岗位独立配色 + 选中态渐变边框 + 入场动画
 */
function PositionSelector({ selected, onSelect }) {
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 500,
          mb: 2,
          color: 'text.primary',
          letterSpacing: '-0.01em',
        }}
      >
        选择面试岗位方向
      </Typography>
      <Grid container spacing={2}>
        {POSITIONS.map((pos, idx) => {
          const isSelected = selected === pos.id;
          const iconStyle = ICON_MAP[pos.icon] || ICON_MAP.BarChart;
          return (
            <Grid item xs={6} sm={4} md={2.4} key={pos.id}>
              <Card
                onClick={() => onSelect(pos.id)}
                sx={{
                  cursor: 'pointer',
                  border: isSelected ? '2px solid' : '1px solid',
                  borderColor: isSelected ? iconStyle.color : 'divider',
                  borderRadius: 3,
                  backgroundColor: isSelected ? iconStyle.bg : 'background.paper',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: `fadeInUp 0.4s ease-out ${idx * 0.06}s both`,
                  '&:hover': {
                    borderColor: iconStyle.color,
                    transform: 'translateY(-4px)',
                    boxShadow: SHADOWS.light,
                  },
                }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    py: 3,
                    '&:last-child': { pb: 3 },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: isSelected ? 'rgba(255,255,255,0.8)' : iconStyle.bg,
                      color: iconStyle.color,
                      mb: 1.5,
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {iconStyle.icon}
                  </Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: isSelected ? 600 : 400,
                      color: isSelected ? iconStyle.color : 'text.primary',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {pos.label}
                  </Typography>
                  {isSelected && (
                    <Chip
                      label="已选择"
                      size="small"
                      sx={{
                        mt: 1,
                        height: 22,
                        fontSize: '0.68rem',
                        borderRadius: 1.5,
                        bgcolor: 'rgba(255,255,255,0.9)',
                        color: iconStyle.color,
                        fontWeight: 600,
                        border: `1px solid ${iconStyle.color}30`,
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default PositionSelector;
