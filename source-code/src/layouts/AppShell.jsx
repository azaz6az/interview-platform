import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

/**
 * AppShell - 统一布局外壳（Stripe 风格）
 * 桌面侧边栏 / 移动端底部 Tab + 顶部 sticky AppBar（白色 + backdrop-filter blur）
 */
function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* 桌面侧边栏 + 移动端抽屉 */}
      <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />

      {/* 主内容区 */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        {/* 移动端顶部 AppBar — Stripe 风格：白色 sticky + backdrop blur */}
        <AppBar
          position="sticky"
          sx={{
            display: { xs: 'flex', md: 'none' },
            bgcolor: 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid #e5edf5',
            color: '#061b31',
          }}
          elevation={0}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleSidebarToggle}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 400,
                fontSize: '1rem',
                color: '#061b31',
                letterSpacing: '-0.01em',
              }}
            >
              面面俱到
            </Typography>
          </Toolbar>
        </AppBar>

        {/* 页面内容 */}
        <Box
          component="main"
          sx={{
            flex: 1,
            p: { xs: 1.5, md: 3 },
            pb: { xs: 9, md: 3 },
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Box>

        {/* 移动端底部导航 */}
        <BottomNav />
      </Box>
    </Box>
  );
}

export default AppShell;
