import React, { useEffect, useCallback, useRef, useState, useMemo } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Chip,
  Snackbar, Alert, CircularProgress,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useLocation } from 'react-router-dom';
import { useMockInterview } from '../contexts/MockInterviewContext';
import { useQuestionBank } from '../contexts/QuestionBankContext';
import { useApiKey } from '../contexts/ApiKeyContext';
import PositionSelector from '../modules/mock-interview/components/PositionSelector';
import ChatWindow from '../modules/mock-interview/components/ChatWindow';
import InterviewControls from '../modules/mock-interview/components/InterviewControls';
import ScoreRadar from '../modules/mock-interview/components/ScoreRadar';
import FeedbackPanel from '../modules/mock-interview/components/FeedbackPanel';
import InterviewHistory from '../modules/mock-interview/components/InterviewHistory';
import { generateQuestionSync } from '../modules/mock-interview/engine/questionGenerator';
import { generateInterviewQuestions, evaluateAndFollowUp } from '../services/aiService';
import { GRADIENTS, SHADOWS } from '../theme/theme';
import JobSiteLinks from '../shared/JobSiteLinks';
import questionsData from '../modules/question-bank/data/questions.json';

/**
 * MockInterviewPage - 模拟面试页面
 */
function MockInterviewPage() {
  const {
    position,
    messages,
    currentRound,
    isStarted,
    isFinished,
    isEvaluating,
    evaluation,
    records,
    shuffledIndices,
    selectPosition,
    startInterview,
    addAiMessage,
    submitAnswer,
    finishInterview,
    calculateEvaluation,
    resetInterview,
    deleteRecord,
    exportReport,
  } = useMockInterview();

  const initializedRef = useRef(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  // JD 面试模式
  const location = useLocation();
  const { apiKey, isConfigured } = useApiKey();
  const jdMode = location.state?.jdMode || false;
  const jdText = location.state?.jdText || '';
  const [jdQuestions, setJdQuestions] = useState([]);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  /** JD 模式：AI 生成面试问题 */
  useEffect(() => {
    if (jdMode && jdText && isConfigured && apiKey && jdQuestions.length === 0) {
      setIsGeneratingQuestions(true);
      generateInterviewQuestions(apiKey, jdText, 10)
        .then((questions) => {
          setJdQuestions(questions);
          // 自动选择一个位置并开始面试
          if (!position) selectPosition('data-analysis');
        })
        .catch((err) => {
          console.warn('生成面试题失败:', err);
          setSnackbar({ open: true, message: 'AI 生成面试题失败，请检查 API Key' });
        })
        .finally(() => setIsGeneratingQuestions(false));
    }
  }, [jdMode, jdText, isConfigured, apiKey, jdQuestions.length, position, selectPosition]);

  /** JD 模式：问题生成后自动开始面试 */
  useEffect(() => {
    if (jdMode && jdQuestions.length > 0 && !isStarted && !isFinished && position && !initializedRef.current) {
      startInterview();
    }
  }, [jdMode, jdQuestions, isStarted, isFinished, position, startInterview]);

  /** 面试开始后推送第一个问题 */
  useEffect(() => {
    if (isStarted && messages.length === 0 && !initializedRef.current) {
      initializedRef.current = true;

      if (jdMode && jdQuestions.length > 0) {
        // JD 模式：用 AI 生成的问题
        const q = jdQuestions[0];
        addAiMessage(`【JD 面试】${q.question}`, `jd-q0`);
      } else if (position) {
        // 普通模式：用题库
        const firstQuestion = generateQuestionSync(position, 1, shuffledIndices);
        const questions = generateQuestionSync.__getQuestions(position);
        const questionId = questions ? questions[shuffledIndices?.[0] || 0]?.id : null;
        addAiMessage(firstQuestion, questionId);
      }
    }
  }, [isStarted, messages.length, position, addAiMessage, shuffledIndices, jdMode, jdQuestions]);

  /** 开始面试 */
  const handleStart = useCallback(() => {
    initializedRef.current = false;
    startInterview();
  }, [startInterview]);

  /** 结束面试并计算评估（延迟确保 state 已更新） */
  const handleFinish = useCallback(async () => {
    finishInterview();
    // 等待 state 更新后再计算评估
    await new Promise((r) => setTimeout(r, 150));
    calculateEvaluation();
  }, [finishInterview, calculateEvaluation]);

  /** 发送回答 */
  const handleSubmitAnswer = useCallback(
    async (answer) => {
      await submitAnswer(answer);
    },
    [submitAnswer]
  );

  /** 导出报告 */
  const handleExport = useCallback(() => {
    exportReport();
    setSnackbar({ open: true, message: '面试报告已复制到剪贴板！' });
  }, [exportReport]);

  return (
    <Box>
      {/* 标题 */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 300,
          letterSpacing: '-0.288px',
          color: 'text.primary',
          mb: 3,
          animation: 'fadeInUp 0.4s ease-out',
        }}
      >
        {jdMode ? '基于 JD 的 AI 模拟面试' : 'AI 模拟面试'}
      </Typography>

      {/* JD 模式加载中 */}
      {jdMode && isGeneratingQuestions && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <CircularProgress size={24} sx={{ color: 'primary.main' }} />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>AI 正在根据 JD 生成面试题...</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>请稍候，通常需要 5-10 秒</Typography>
          </Box>
        </Box>
      )}

      {/* JD 模式就绪提示 */}
      {jdMode && !isGeneratingQuestions && jdQuestions.length > 0 && !isStarted && (
        <Box sx={{ mb: 3, p: 2, borderRadius: 3, background: 'linear-gradient(135deg, rgba(83,58,253,0.06) 0%, rgba(234,34,97,0.06) 100%)', border: '1px solid', borderColor: 'primary.light' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', mb: 0.5 }}>
            ✨ JD 面试模式已就绪
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            AI 已根据 JD 内容生成 {jdQuestions.length} 道面试题，点击「开始面试」开始
          </Typography>
        </Box>
      )}

      {/* 未开始 — 选择岗位 + 热门题目 + 历史记录 + 求职导航 */}
      {!isStarted && !isFinished && (
        <>
          <Box sx={{ animation: 'fadeInUp 0.4s ease-out 0.05s both' }}>
            <PositionSelector selected={position} onSelect={selectPosition} />
          </Box>

          {/* 热门题目速览 */}
          <Box sx={{ mt: 4, animation: 'fadeInUp 0.4s ease-out 0.1s both' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, color: 'text.primary' }}>
              热门题目速览
            </Typography>
            <Grid container spacing={1.5}>
              {questionsData.filter((q) => q.difficulty === 'medium').slice(0, 6).map((q) => (
                <Grid item xs={12} sm={6} key={q.id}>
                  <Card sx={{ borderRadius: 2, '&:hover': { boxShadow: SHADOWS.light }, cursor: 'pointer' }} onClick={() => selectQuestion(q)}>
                    <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 }, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label={q.category} size="small" sx={{ fontSize: '0.65rem', height: 18, borderRadius: 1, bgcolor: 'primary.main', color: '#fff', fontWeight: 500, flexShrink: 0, opacity: 0.8 }} />
                      <Typography variant="body2" sx={{ flex: 1, fontWeight: 400, color: 'text.primary', fontSize: '0.82rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {q.question}
                      </Typography>
                      <ArrowForwardIcon sx={{ fontSize: 14, color: 'text.secondary', flexShrink: 0 }} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* 面试历史记录 */}
          <Box sx={{ mt: 4, animation: 'fadeInUp 0.4s ease-out 0.15s both' }}>
            <InterviewHistory records={records} onDelete={deleteRecord} />
          </Box>

          {/* 求职导航 */}
          <Box sx={{ mt: 4, animation: 'fadeInUp 0.4s ease-out 0.2s both' }}>
            <JobSiteLinks />
          </Box>
        </>
      )}

      {/* 控制栏 */}
      {(isStarted || isFinished) && (
        <Box sx={{ mb: 2, animation: 'fadeInUp 0.4s ease-out 0.05s both' }}>
          <InterviewControls
            isStarted={isStarted}
            isFinished={isFinished}
            currentRound={currentRound}
            onStart={handleStart}
            onFinish={handleFinish}
            onReset={resetInterview}
          />
        </Box>
      )}

      {/* 面试进行中 — 聊天区域 */}
      {isStarted && !isFinished && (
        <Box sx={{ animation: 'fadeInUp 0.4s ease-out 0.1s both' }}>
          <ChatWindow
            messages={messages}
            onSend={handleSubmitAnswer}
            disabled={isEvaluating}
            isEvaluating={isEvaluating}
          />
        </Box>
      )}

      {/* 面试结束 — 评分反馈 + 导出 */}
      {isFinished && evaluation && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, animation: 'fadeInUp 0.4s ease-out 0.05s both' }}>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={handleExport}
              sx={{ borderRadius: 2 }}
            >
              导出报告
            </Button>
          </Box>
          <Grid container spacing={3} sx={{ animation: 'fadeInUp 0.4s ease-out 0.1s both' }}>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 3,
                  position: 'relative', overflow: 'hidden',
                  '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: GRADIENTS.primary },
                  '&:hover': { boxShadow: SHADOWS.purple },
                }}
              >
                <ScoreRadar evaluation={evaluation} />
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 3,
                  position: 'relative', overflow: 'hidden',
                  '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: GRADIENTS.warm },
                  '&:hover': { boxShadow: SHADOWS.warm },
                }}
              >
                <FeedbackPanel evaluation={evaluation} positionId={position} messages={messages} />
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      {/* 选择岗位后显示开始按钮区域 */}
      {!isStarted && position && (
        <Box sx={{ mt: 3, textAlign: 'center', animation: 'fadeInUp 0.4s ease-out 0.15s both' }}>
          <InterviewControls
            isStarted={false}
            isFinished={false}
            currentRound={0}
            onStart={handleStart}
            onFinish={() => {}}
            onReset={resetInterview}
          />
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default MockInterviewPage;
