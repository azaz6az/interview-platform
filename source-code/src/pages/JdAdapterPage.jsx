import React, { useState, useCallback } from 'react';
import { Box, Button, Snackbar, Alert, Typography, CircularProgress } from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { useNavigate } from 'react-router-dom';
import ResumeInput from '../modules/jd-adapter/components/ResumeInput';
import JDInput from '../modules/jd-adapter/components/JDInput';
import AnalysisResult from '../modules/jd-adapter/components/AnalysisResult';
import { useJdAdapter } from '../contexts/JdAdapterContext';
import { useApiKey } from '../contexts/ApiKeyContext';
import { GRADIENTS, SHADOWS } from '../theme/theme';

function JdAdapterPage() {
  const navigate = useNavigate();
  const {
    resumeText, jdText, jdImage, analysisResult, isAnalyzing, snackbar,
    setResumeText, setJdText, setJdImage, handleAnalyze, handleReset, closeSnackbar,
  } = useJdAdapter();
  const { isConfigured } = useApiKey();
  const [isGenerating, setIsGenerating] = useState(false);

  /** 基于 JD 开始模拟面试 */
  const handleJdInterview = useCallback(async () => {
    if (!jdText.trim()) return;
    setIsGenerating(true);
    try {
      // 生成的问题会在面试页面通过 AI API 实时生成
      // 这里只传递 JD 文本到面试页面
      navigate('/mock-interview', { state: { jdMode: true, jdText } });
    } finally {
      setIsGenerating(false);
    }
  }, [jdText, navigate]);

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 300, letterSpacing: '-0.288px', color: 'text.primary', mb: 2, animation: 'fadeInUp 0.4s ease-out' }}>
        JD 简历适配
      </Typography>

      {/* 操作栏 */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap', animation: 'fadeInUp 0.4s ease-out 0.05s both' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<AutoFixHighIcon />}
          onClick={handleAnalyze}
          disabled={isAnalyzing || !resumeText.trim() || !jdText.trim()}
          sx={{
            borderRadius: 2, px: 4, background: GRADIENTS.primary,
            '&:hover': { background: 'linear-gradient(135deg, #4434d4 0%, #6d28d9 100%)', boxShadow: SHADOWS.purple },
            '&.Mui-disabled': { background: 'rgba(0,0,0,0.06)', color: 'text.secondary' },
            fontWeight: 500,
          }}
        >
          {isAnalyzing ? '分析中...' : '分析适配'}
        </Button>

        {/* 基于 JD 模拟面试按钮 */}
        <Button
          variant="contained"
          size="large"
          startIcon={isGenerating ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <QuestionAnswerIcon />}
          onClick={handleJdInterview}
          disabled={!jdText.trim() || isGenerating}
          sx={{
            borderRadius: 2, px: 3,
            background: GRADIENTS.warm,
            '&:hover': { background: 'linear-gradient(135deg, #c41850 0%, #533afd 100%)', boxShadow: SHADOWS.warm },
            '&.Mui-disabled': { background: 'rgba(0,0,0,0.06)', color: 'text.secondary' },
            fontWeight: 500,
          }}
        >
          {isGenerating ? '准备中...' : '基于 JD 模拟面试'}
        </Button>

        <Button
          variant="outlined"
          startIcon={<RestartAltIcon />}
          onClick={handleReset}
          sx={{ borderRadius: 2, borderColor: '#b9b9f9', color: '#533afd', '&:hover': { borderColor: '#533afd', bgcolor: 'rgba(83,58,253,0.04)' } }}
        >
          重置
        </Button>

        {!isConfigured && (
          <Typography variant="caption" sx={{ alignSelf: 'center', color: 'text.secondary', ml: 1 }}>
            💡 在设置中填入 API Key 可启用 AI 面试功能
          </Typography>
        )}
      </Box>

      {/* 三栏布局 */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, minHeight: { md: 'calc(100vh - 220px)' }, animation: 'fadeInUp 0.4s ease-out 0.1s both' }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <ResumeInput value={resumeText} onChange={setResumeText} onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <JDInput value={jdText} onChange={setJdText} onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} jdImage={jdImage} onImageChange={setJdImage} />
        </Box>
        <Box sx={{ flex: 1.2, minWidth: 0 }}>
          <AnalysisResult result={analysisResult} isAnalyzing={isAnalyzing} resumeText={resumeText} />
        </Box>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={closeSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={closeSnackbar} severity={snackbar.severity} variant="outlined" sx={{ width: '100%', borderRadius: 2, borderColor: snackbar.severity === 'success' ? '#15be53' : '#ea2261', color: snackbar.severity === 'success' ? '#108c3d' : '#ea2261', boxShadow: SHADOWS.light }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default JdAdapterPage;
