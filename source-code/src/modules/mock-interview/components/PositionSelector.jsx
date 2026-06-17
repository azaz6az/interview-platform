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

/** 岗位图标映射 */
const ICON_MAP = {
  BarChart: <BarChartIcon sx={{ fontSize: 40 }} />,
  TrendingUp: <TrendingUpIcon sx={{ fontSize: 40 }} />,
  BusinessCenter: <BusinessCenterIcon sx={{ fontSize: 40 }} />,
  Storage: <StorageIcon sx={{ fontSize: 40 }} />,
  School: <SchoolIcon sx={{ fontSize: 40 }} />,
};

/**
 * PositionSelector - Stripe 风格岗位方向选择器
 * 选中态：Stripe Purple #533afd 边框 + 浅紫底
 * 卡片：6px 圆角 + #e5edf5 边框 + 蓝色调阴影
 */
function PositionSelector({ selected, onSelect }) {
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 400,
          mb: 2,
          color: '#061b31',
          letterSpacing: '-0.01em',
        }}
      >
        选择面试岗位方向
      </Typography>
      <Grid container spacing={2}>
        {POSITIONS.map((pos) => {
          const isSelected = selected === pos.id;
          return (
            <Grid item xs={6} sm={4} md={2.4} key={pos.id}>
              <Card
                onClick={() => onSelect(pos.id)}
                sx={{
                  cursor: 'pointer',
                  border: '2px solid',
                  borderColor: isSelected ? '#533afd' : '#e5edf5',
                  borderRadius: '6px',
                  backgroundColor: isSelected ? 'rgba(83,58,253,0.04)' : '#ffffff',
                  boxShadow: isSelected
                    ? 'rgba(50,50,93,0.25) 0px 30px 45px -30px, rgba(0,0,0,0.1) 0px 18px 36px -18px'
                    : 'rgba(23,23,23,0.08) 0px 15px 35px 0px',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#533afd',
                    transform: 'translateY(-2px)',
                    boxShadow: 'rgba(50,50,93,0.25) 0px 30px 45px -30px, rgba(0,0,0,0.1) 0px 18px 36px -18px',
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
                      color: isSelected ? '#533afd' : '#64748d',
                      mb: 1,
                    }}
                  >
                    {ICON_MAP[pos.icon] || <BarChartIcon sx={{ fontSize: 40 }} />}
                  </Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: isSelected ? 500 : 400,
                      color: isSelected ? '#533afd' : '#061b31',
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
                        height: 20,
                        fontSize: '0.7rem',
                        borderRadius: '4px',
                        bgcolor: 'rgba(83,58,253,0.08)',
                        color: '#533afd',
                        fontWeight: 500,
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
