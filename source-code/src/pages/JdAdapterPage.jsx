import React from 'react';
import { Box, Button, Snackbar, Alert } from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ResumeInput from '../modules/jd-adapter/components/ResumeInput';
import JDInput from '../modules/jd-adapter/components/JDInput';
import AnalysisResult from '../modules/jd-adapter/components/AnalysisResult';
import { useJdAdapter } from '../contexts/JdAdapterContext';

/**
 * JdAdapterPage - Stripe 风格 JD 简历适配页面
 * 标题 weight 300 + 负 letter-spacing
 * 分析按钮改为 Stripe Purple CTA 风格
 */
function JdAdapterPage() {
  const {
    resumeText,
    jdText,
    jdImage,
    analysisResult,
    isAnalyzing,
    snackbar,
    setResumeText,
    setJdText,
    setJdImage,
    handleAnalyze,
    handleReset,
    closeSnackbar,
  } = useJdAdapter();

  return (
    <Box>
      {/* 操作栏 — Stripe Purple CTA 风格按钮 */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<AutoFixHighIcon />}
          onClick={handleAnalyze}
          disabled={isAnalyzing || !resumeText.trim() || !jdText.trim()}
          sx={{
            borderRadius: '4px',
            px: 4,
            bgcolor: '#533afd',
            '&:hover': { bgcolor: '#4434d4' },
            '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.02)', color: '#64748d' },
            fontWeight: 500,
          }}
        >
          {isAnalyzing ? '分析中...' : '分析适配'}
        </Button>
        <Button
          variant="outlined"
          startIcon={<RestartAltIcon />}
          onClick={handleReset}
          sx={{
            borderRadius: '4px',
            borderColor: '#b9b9f9',
            color: '#533afd',
            '&:hover': {
              borderColor: '#533afd',
              bgcolor: 'rgba(83,58,253,0.04)',
            },
          }}
        >
          重置
        </Button>
      </Box>

      {/* 三栏布局 */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          minHeight: { md: 'calc(100vh - 200px)' },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <ResumeInput
            value={resumeText}
            onChange={setResumeText}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <JDInput
            value={jdText}
            onChange={setJdText}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            jdImage={jdImage}
            onImageChange={setJdImage}
          />
        </Box>
        <Box sx={{ flex: 1.2, minWidth: 0 }}>
          <AnalysisResult
            result={analysisResult}
            isAnalyzing={isAnalyzing}
            resumeText={resumeText}
          />
        </Box>
      </Box>

      {/* Snackbar 提示 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          variant="outlined"
          sx={{
            width: '100%',
            borderRadius: '4px',
            borderColor: snackbar.severity === 'success' ? '#15be53' : '#ea2261',
            color: snackbar.severity === 'success' ? '#108c3d' : '#ea2261',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default JdAdapterPage;
