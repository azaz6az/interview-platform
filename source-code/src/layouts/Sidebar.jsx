import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import RateReviewIcon from '@mui/icons-material/RateReview';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { GRADIENTS, ACCENT_BG } from '../theme/theme';
import { useThemeMode } from '../contexts/ThemeModeContext';
import { useApiKey } from '../contexts/ApiKeyContext';

const NAV_ITEMS = [
  { label: '仪表盘', icon: <DashboardIcon />, path: '/' },
  { label: 'JD 简历适配', icon: <WorkOutlineIcon />, path: '/jd-adapter' },
  { label: '模拟面试', icon: <QuestionAnswerIcon />, path: '/mock-interview' },
  { label: '面试题库', icon: <LibraryBooksIcon />, path: '/question-bank' },
  { label: '复盘日记', icon: <RateReviewIcon />, path: '/review-diary' },
];

const DRAWER_WIDTH = 240;

function Sidebar({ open, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeMode();
  const isDark = mode === 'dark';
  const { apiKey, isConfigured, saveApiKey } = useApiKey();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tempKey, setTempKey] = useState('');

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
        bgcolor: 'background.paper',
      }}
    >
      {/* Logo 区域 */}
      <Toolbar
        sx={{
          px: 2.5,
          py: 2.5,
          background: isDark ? 'rgba(83,58,253,0.08)' : 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              background: GRADIENTS.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 600,
              fontSize: '1.1rem',
              fontFeatureSettings: '"ss01"',
              boxShadow: '0 4px 12px rgba(83,58,253,0.25)',
            }}
          >
            面
          </Box>
          <Box>
            <Box sx={{ fontWeight: 600, fontSize: '1rem', lineHeight: 1.2, color: 'text.primary', fontFeatureSettings: '"ss01"' }}>
              面面俱到
            </Box>
            <Box sx={{ fontSize: '0.7rem', color: 'text.secondary', fontWeight: 300, mt: 0.25 }}>
              面试备战平台
            </Box>
          </Box>
        </Box>
      </Toolbar>

      {/* 导航列表 */}
      <List sx={{ flex: 1, px: 1.5, pt: 1.5 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => handleNavigate(item.path)}
                sx={{
                  borderRadius: 2,
                  position: 'relative',
                  pl: 1.5,
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&.Mui-selected': {
                    backgroundColor: ACCENT_BG.purple,
                    color: 'primary.main',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 6,
                      bottom: 6,
                      width: 3,
                      borderRadius: '0 4px 4px 0',
                      background: GRADIENTS.primary,
                    },
                    '& .MuiListItemIcon-root': { color: 'primary.main' },
                    '&:hover': { backgroundColor: isDark ? 'rgba(83,58,253,0.18)' : '#ede9fe' },
                  },
                  '&:hover': {
                    backgroundColor: isActive ? undefined : 'action.hover',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? 'primary.main' : 'text.secondary',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'primary.main' : 'text.primary',
                    transition: 'font-weight 0.2s ease',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* 暗色模式切换 + API 设置 */}
      <Box sx={{ px: 2, pb: 1, display: 'flex', gap: 0.5 }}>
        <Tooltip title={isDark ? '切换亮色模式' : '切换暗色模式'} arrow>
          <IconButton
            onClick={toggleTheme}
            sx={{ flex: 1, justifyContent: 'center', borderRadius: 2, color: 'text.secondary', '&:hover': { bgcolor: 'action.hover' } }}
          >
            {isDark ? <LightModeIcon sx={{ fontSize: 20 }} /> : <DarkModeIcon sx={{ fontSize: 20 }} />}
          </IconButton>
        </Tooltip>
        <Tooltip title="API 设置" arrow>
          <IconButton
            onClick={() => { setTempKey(apiKey); setSettingsOpen(true); }}
            sx={{
              flex: 1, justifyContent: 'center', borderRadius: 2, color: isConfigured ? '#15be53' : 'text.secondary',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            {isConfigured ? <CheckCircleIcon sx={{ fontSize: 20 }} /> : <SettingsIcon sx={{ fontSize: 20 }} />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* API 设置弹窗 */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 600 }}>API 设置</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            填入通义千问 API Key，解锁 AI 图片识别和 JD 模拟面试功能。
            <Box component="a" href="https://dashscope.console.aliyun.com/apiKey" target="_blank" rel="noopener noreferrer" sx={{ color: 'primary.main', ml: 0.5 }}>
              点此获取免费 API Key →
            </Box>
          </Typography>
          <TextField
            fullWidth
            size="small"
            label="API Key"
            type="password"
            placeholder="sk-..."
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            sx={{ mb: 1 }}
          />
          {isConfigured && (
            <Chip label="已配置" size="small" sx={{ bgcolor: 'rgba(21,190,83,0.1)', color: '#15be53', fontWeight: 500 }} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)} sx={{ color: 'text.secondary' }}>取消</Button>
          <Button
            variant="contained"
            onClick={() => { saveApiKey(tempKey); setSettingsOpen(false); }}
            sx={{ borderRadius: 2 }}
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>

      {/* 底部小贴士 */}
      <Box
        sx={{
          p: 2,
          mx: 1.5,
          mb: 1.5,
          borderRadius: 2,
          background: isDark ? 'rgba(83,58,253,0.08)' : 'linear-gradient(135deg, #f5f3ff 0%, #fdf2f8 100%)',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ fontSize: '0.7rem', fontWeight: 500, color: 'primary.main', mb: 0.5 }}>
          💡 面试小贴士
        </Box>
        <Box sx={{ fontSize: '0.68rem', color: 'text.secondary', fontWeight: 300, lineHeight: 1.5 }}>
          使用 STAR 法则组织回答，让面试官更容易理解你的能力
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
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
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            borderRight: '1px solid',
            borderColor: 'divider',
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
