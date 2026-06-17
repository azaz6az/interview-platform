import React, { useState, useCallback } from 'react';
import { Container, Box, Snackbar, Alert } from '@mui/material';
import Header from './components/Header';
import ResumeInput from './components/ResumeInput';
import JDInput from './components/JDInput';
import AnalysisResult from './components/AnalysisResult';
import { analyzeResume } from './engine/analyzer';
import { loadResume, loadJD, saveResume, saveJD } from './utils/storage';

/**
 * App - 应用根组件
 * 管理全局状态：简历文本、JD文本、分析结果
 */
function App() {
  const [resumeText, setResumeText] = useState(() => loadResume() || '');
  const [jdText, setJdText] = useState(() => loadJD() || '');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  /** 处理简历文本变化 */
  const handleResumeChange = useCallback((text) => {
    setResumeText(text);
    saveResume(text);
  }, []);

  /** 处理 JD 文本变化 */
  const handleJdChange = useCallback((text) => {
    setJdText(text);
    saveJD(text);
  }, []);

  /** 执行分析 */
  const handleAnalyze = useCallback(async () => {
    if (!resumeText.trim()) {
      setSnackbar({ open: true, message: '请先输入简历内容', severity: 'warning' });
      return;
    }
    if (!jdText.trim()) {
      setSnackbar({ open: true, message: '请先输入岗位描述', severity: 'warning' });
      return;
    }

    setIsAnalyzing(true);
    setActiveStep(2);

    try {
      // 使用内置分析引擎
      const result = analyzeResume(resumeText, jdText);
      // 模拟异步延迟，让用户感受到分析过程
      await new Promise((resolve) => setTimeout(resolve, 800));
      setAnalysisResult(result);
      setSnackbar({ open: true, message: '分析完成！', severity: 'success' });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `分析出错：${error.message}`,
        severity: 'error',
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [resumeText, jdText]);

  /** 重置所有内容 */
  const handleReset = useCallback(() => {
    setResumeText('');
    setJdText('');
    setAnalysisResult(null);
    setActiveStep(0);
    saveResume('');
    saveJD('');
    setSnackbar({ open: true, message: '已重置所有内容', severity: 'info' });
  }, []);

  /** 关闭 Snackbar */
  const handleCloseSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <Header onReset={handleReset} />

      <Container
        maxWidth="xl"
        sx={{
          py: 3,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          minHeight: 'calc(100vh - 80px)',
        }}
      >
        {/* Step 1: 简历输入 */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <ResumeInput
            value={resumeText}
            onChange={handleResumeChange}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
          />
        </Box>

        {/* Step 2: JD 输入 */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <JDInput
            value={jdText}
            onChange={handleJdChange}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
          />
        </Box>

        {/* Step 3: 分析结果 */}
        <Box sx={{ flex: 1.2, minWidth: 0 }}>
          <AnalysisResult
            result={analysisResult}
            isAnalyzing={isAnalyzing}
            resumeText={resumeText}
          />
        </Box>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
