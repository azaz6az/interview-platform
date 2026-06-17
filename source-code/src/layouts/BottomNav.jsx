import React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import RateReviewIcon from '@mui/icons-material/RateReview';

const BOTTOM_NAV_ITEMS = [
  { label: '首页', icon: <DashboardIcon />, path: '/' },
  { label: '适配', icon: <WorkOutlineIcon />, path: '/jd-adapter' },
  { label: '面试', icon: <QuestionAnswerIcon />, path: '/mock-interview' },
  { label: '题库', icon: <LibraryBooksIcon />, path: '/question-bank' },
  { label: '复盘', icon: <RateReviewIcon />, path: '/review-diary' },
];

function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentIndex = BOTTOM_NAV_ITEMS.findIndex((item) => item.path === location.pathname);

  return (
    <Paper
      sx={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1100,
        display: { xs: 'block', md: 'none' },
        bgcolor: 'background.paper',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
      elevation={0}
    >
      <BottomNavigation
        value={currentIndex >= 0 ? currentIndex : 0}
        onChange={(_, v) => navigate(BOTTOM_NAV_ITEMS[v].path)}
        showLabels
        sx={{
          bgcolor: 'transparent',
          '& .MuiBottomNavigationAction-root': {
            position: 'relative', transition: 'all 0.2s ease',
            '&.Mui-selected': { color: 'primary.main' },
          },
          '& .Mui-selected .MuiBottomNavigationAction-label': { fontWeight: 600 },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.65rem', fontWeight: 400,
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            transition: 'font-weight 0.2s ease',
            '&.Mui-selected': { fontSize: '0.68rem' },
          },
        }}
      >
        {BOTTOM_NAV_ITEMS.map((item, idx) => (
          <BottomNavigationAction
            key={item.path}
            label={item.label}
            icon={
              <Box sx={{ position: 'relative' }}>
                {item.icon}
                {currentIndex === idx && (
                  <Box sx={{ position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)', width: 16, height: 3, borderRadius: 1.5, background: 'linear-gradient(90deg, #533afd, #7c3aed)', animation: 'fadeIn 0.2s ease-out' }} />
                )}
              </Box>
            }
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}

export default BottomNav;
