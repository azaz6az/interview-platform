import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';

/**
 * ErrorBoundary - 全局错误边界
 * 捕获子组件渲染错误，显示友好的 fallback UI
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: 2,
            p: 3,
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'rgba(234,34,97,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1,
            }}
          >
            <Typography variant="h3" sx={{ color: '#ea2261' }}>!</Typography>
          </Box>
          <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 400 }}>
            页面出了点问题
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 400, fontWeight: 300 }}>
            抱歉，页面渲染时发生了错误。你可以尝试刷新页面或返回首页。
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={this.handleReset}
              sx={{ borderRadius: 2 }}
            >
              重试
            </Button>
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={this.handleGoHome}
              sx={{ borderRadius: 2 }}
            >
              返回首页
            </Button>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
