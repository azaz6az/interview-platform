import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import RateReviewIcon from '@mui/icons-material/RateReview';

/** 侧边栏导航项 */
const NAV_ITEMS = [
  { label: '仪表盘', icon: <DashboardIcon />, path: '/' },
  { label: 'JD 简历适配', icon: <WorkOutlineIcon />, path: '/jd-adapter' },
  { label: '模拟面试', icon: <QuestionAnswerIcon />, path: '/mock-interview' },
  { label: '面试题库', icon: <LibraryBooksIcon />, path: '/question-bank' },
  { label: '复盘日记', icon: <RateReviewIcon />, path: '/review-diary' },
];

const DRAWER_WIDTH = 220;

/**
 * Sidebar - Stripe 风格侧边栏
 * 白色背景 + 右边 border #e5edf5
 * 选中态：Stripe Purple #533afd 背景 + 白色文字 + 4px 圆角
 * 非选中 hover：rgba(83,58,253,0.05) 浅紫底
 * @param {Object} props
 * @param {boolean} props.open - 是否展开（移动端抽屉模式）
 * @param {Function} props.onClose - 关闭回调（移动端）
 */
function Sidebar({ open, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    onClose?.();
  };

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: '#ffffff',
      }}
    >
      {/* Logo 区域 — Stripe Purple 方块 + "面面俱到" 文字 */}
      <Toolbar sx={{ px: 2, py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1,
              backgroundColor: '#533afd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 500,
              fontSize: '1.1rem',
              fontFeatureSettings: '"ss01"',
            }}
          >
            面
          </Box>
          <Box>
            <Box
              sx={{
                fontWeight: 500,
                fontSize: '1rem',
                lineHeight: 1.2,
                color: '#061b31',
                fontFeatureSettings: '"ss01"',
              }}
            >
              面面俱到
            </Box>
            <Box sx={{ fontSize: '0.7rem', color: '#64748d', fontWeight: 300 }}>
              面试备战平台
            </Box>
          </Box>
        </Box>
      </Toolbar>

      {/* 分割线 */}
      <Box sx={{ borderBottom: '1px solid #e5edf5' }} />

      {/* 导航列表 */}
      <List sx={{ flex: 1, px: 1, pt: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => handleNavigate(item.path)}
                sx={{
                  borderRadius: 1,
                  /** 选中态：Stripe Purple 背景 + 白色文字 */
                  '&.Mui-selected': {
                    backgroundColor: '#533afd',
                    color: '#fff',
                    '& .MuiListItemIcon-root': { color: '#fff' },
                    '&:hover': { backgroundColor: '#4434d4' },
                  },
                  /** 非选中 hover：浅紫色底 */
                  '&:hover': {
                    backgroundColor: isActive ? undefined : 'rgba(83,58,253,0.05)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: isActive ? '#fff' : '#061b31' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 500 : 400,
                    color: isActive ? '#fff' : '#061b31',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
    >
      {/* 移动端临时抽屉 */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* 桌面端永久抽屉 */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            borderRight: '1px solid #e5edf5',
            bgcolor: '#ffffff',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}

export default Sidebar;
