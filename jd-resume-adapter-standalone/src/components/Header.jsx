import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

/**
 * Header - 应用顶部标题栏
 * @param {Object} props
 * @param {Function} props.onReset - 重置回调
 */
function Header({ onReset }) {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 50%, #0d47a1 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AutoFixHighIcon sx={{ fontSize: 32, color: '#90caf9' }} />
          <Box>
            <Typography
              variant="h6"
              component="h1"
              sx={{
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '0.5px',
                fontSize: { xs: '1rem', sm: '1.25rem' },
              }}
            >
              JD 简历适配器
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: '#90caf9', display: { xs: 'none', sm: 'block' } }}
            >
              智能分析岗位描述，精准优化简历内容
            </Typography>
          </Box>
        </Box>

        <IconButton
          color="inherit"
          onClick={onReset}
          title="重置所有内容"
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.15)',
            },
          }}
        >
          <RestartAltIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
