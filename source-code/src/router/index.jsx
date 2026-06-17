import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppShell from '../layouts/AppShell';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

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
      <CircularProgress />
    </Box>
  );
}

/**
 * AppRouter - 路由配置
 */
function AppRouter() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/jd-adapter" element={<JdAdapterPage />} />
          <Route path="/mock-interview" element={<MockInterviewPage />} />
          <Route path="/question-bank" element={<QuestionBankPage />} />
          <Route path="/review-diary" element={<ReviewDiaryPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
