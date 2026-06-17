import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { useThemeMode } from '../contexts/ThemeModeContext';

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { mode, toggleTheme } = useThemeMode();
  const isDark = mode === 'dark';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* 移动端顶部 AppBar */}
        <AppBar
          position="sticky"
          sx={{
            display: { xs: 'flex', md: 'none' },
            bgcolor: isDark ? 'rgba(30,41,59,0.92)' : 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid',
            borderColor: 'divider',
            color: 'text.primary',
          }}
          elevation={0}
        >
          <Toolbar>
            <IconButton color="inherit" edge="start" onClick={() => setSidebarOpen(true)} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: 'text.primary', letterSpacing: '-0.01em', flex: 1 }}>
              面面俱到
            </Typography>
            <IconButton color="inherit" onClick={toggleTheme} sx={{ color: 'text.secondary' }}>
              {isDark ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* 页面内容 */}
        <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3.5 }, pb: { xs: 10, md: 3.5 }, overflow: 'auto' }}>
          <Outlet />
        </Box>

        <BottomNav />
      </Box>
    </Box>
  );
}

export default AppShell;
