import React, { lazy, Suspense } from 'react';
import { Routes, Route, Link as RouterLink } from 'react-router-dom';
import AppShell from '../layouts/AppShell';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { GRADIENTS } from '../theme/theme';
import ErrorBoundary from '../shared/ErrorBoundary';

/** 懒加载页面组件 */
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const JdAdapterPage = lazy(() => import('../pages/JdAdapterPage'));
const MockInterviewPage = lazy(() => import('../pages/MockInterviewPage'));
const QuestionBankPage = lazy(() => import('../pages/QuestionBankPage'));
const ReviewDiaryPage = lazy(() => import('../pages/ReviewDiaryPage'));

/** 加载占位 */
function LoadingFallback() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <CircularProgress sx={{ color: '#533afd' }} />
    </Box>
  );
}

/** 404 页面 — 渐变背景 + 装饰几何图形 */
function NotFoundPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '60vh',
        gap: 2,
        position: 'relative',
      }}
    >
      {/* 装饰圆 */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '15%',
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'rgba(83,58,253,0.05)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(234,34,97,0.05)',
        }}
      />

      <Typography
        variant="h1"
        sx={{
          fontWeight: 300,
          background: GRADIENTS.warm,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-2px',
        }}
      >
        404
      </Typography>
      <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 400 }}>
        页面不存在
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 300 }}>
        抱歉，您访问的页面不存在或已被移除
      </Typography>
      <Button
        component={RouterLink}
        to="/"
        variant="contained"
        sx={{
          mt: 2,
          borderRadius: 2,
          px: 4,
          background: GRADIENTS.primary,
          '&:hover': {
            background: 'linear-gradient(135deg, #4434d4 0%, #6d28d9 100%)',
          },
        }}
      >
        返回首页
      </Button>
    </Box>
  );
}

/**
 * AppRouter - 路由配置
 */
function AppRouter() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/jd-adapter" element={<JdAdapterPage />} />
            <Route path="/mock-interview" element={<MockInterviewPage />} />
            <Route path="/question-bank" element={<QuestionBankPage />} />
            <Route path="/review-diary" element={<ReviewDiaryPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default AppRouter;
