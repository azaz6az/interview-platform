import React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import RateReviewIcon from '@mui/icons-material/RateReview';

/** 底部导航项 */
const BOTTOM_NAV_ITEMS = [
  { label: '首页', icon: <DashboardIcon />, path: '/' },
  { label: '适配', icon: <WorkOutlineIcon />, path: '/jd-adapter' },
  { label: '面试', icon: <QuestionAnswerIcon />, path: '/mock-interview' },
  { label: '题库', icon: <LibraryBooksIcon />, path: '/question-bank' },
  { label: '复盘', icon: <RateReviewIcon />, path: '/review-diary' },
];

/**
 * BottomNav - Stripe 风格底部 Tab 导航
 * 白色背景 + 顶部 border #e5edf5
 * 选中色 Stripe Purple #533afd
 * 文字 Inter weight 400
 */
function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentIndex = BOTTOM_NAV_ITEMS.findIndex(
    (item) => item.path === location.pathname
  );

  const handleChange = (_event, newValue) => {
    navigate(BOTTOM_NAV_ITEMS[newValue].path);
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        display: { xs: 'block', md: 'none' },
        bgcolor: '#ffffff',
        borderTop: '1px solid #e5edf5',
        boxShadow: 'none',
      }}
      elevation={0}
    >
      <BottomNavigation
        value={currentIndex >= 0 ? currentIndex : 0}
        onChange={handleChange}
        showLabels
        sx={{
          '& .Mui-selected': { color: '#533afd' },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.65rem',
            fontWeight: 400,
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            '&.Mui-selected': { fontSize: '0.7rem' },
          },
        }}
      >
        {BOTTOM_NAV_ITEMS.map((item) => (
          <BottomNavigationAction
            key={item.path}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}

export default BottomNav;
