import React, { useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
} from '@mui/material';
import { useMockInterview } from '../contexts/MockInterviewContext';
import PositionSelector from '../modules/mock-interview/components/PositionSelector';
import ChatWindow from '../modules/mock-interview/components/ChatWindow';
import InterviewControls from '../modules/mock-interview/components/InterviewControls';
import ScoreRadar from '../modules/mock-interview/components/ScoreRadar';
import FeedbackPanel from '../modules/mock-interview/components/FeedbackPanel';
import { generateQuestionSync } from '../modules/mock-interview/engine/questionGenerator';

/**
 * MockInterviewPage - Stripe 风格模拟面试页面
 * 标题 weight 300 + 负 letter-spacing
 * 评分卡片使用蓝色阴影
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
    selectPosition,
    startInterview,
    addAiMessage,
    submitAnswer,
    finishInterview,
    calculateEvaluation,
    resetInterview,
  } = useMockInterview();

  const initializedRef = useRef(false);

  /** 面试开始后推送第一个问题 */
  useEffect(() => {
    if (isStarted && messages.length === 0 && position && !initializedRef.current) {
      initializedRef.current = true;
      const firstQuestion = generateQuestionSync(position, 1);
      addAiMessage(firstQuestion);
    }
  }, [isStarted, messages.length, position, addAiMessage]);

  /** 开始面试 */
  const handleStart = useCallback(() => {
    initializedRef.current = false;
    startInterview();
  }, [startInterview]);

  /** 结束面试并计算评分 */
  const handleFinish = useCallback(() => {
    finishInterview();
    calculateEvaluation();
  }, [finishInterview, calculateEvaluation]);

  /** 发送回答 */
  const handleSubmitAnswer = useCallback(
    async (answer) => {
      await submitAnswer(answer);
    },
    [submitAnswer]
  );

  return (
    <Box>
      {/* 标题 — Stripe 风格：weight 300 + 负 letter-spacing */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 300,
          letterSpacing: '-0.288px',
          color: '#061b31',
          mb: 3,
        }}
      >
        AI 模拟面试
      </Typography>

      {/* 未开始 — 选择岗位 */}
      {!isStarted && !isFinished && (
        <PositionSelector selected={position} onSelect={selectPosition} />
      )}

      {/* 控制栏 */}
      {(isStarted || isFinished) && (
        <Box sx={{ mb: 2 }}>
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
        <ChatWindow
          messages={messages}
          onSend={handleSubmitAnswer}
          disabled={isEvaluating}
          isEvaluating={isEvaluating}
        />
      )}

      {/* 面试结束 — 评分反馈（蓝色阴影卡片） */}
      {isFinished && evaluation && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 2,
                border: '1px solid #e5edf5',
                borderRadius: '6px',
                boxShadow: 'rgba(50,50,93,0.25) 0px 30px 45px -30px, rgba(0,0,0,0.1) 0px 18px 36px -18px',
              }}
            >
              <ScoreRadar evaluation={evaluation} />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 2,
                border: '1px solid #e5edf5',
                borderRadius: '6px',
                boxShadow: 'rgba(50,50,93,0.25) 0px 30px 45px -30px, rgba(0,0,0,0.1) 0px 18px 36px -18px',
              }}
            >
              <FeedbackPanel evaluation={evaluation} positionId={position} />
            </Card>
          </Grid>
        </Grid>
      )}

      {/* 选择岗位后显示开始按钮区域 */}
      {!isStarted && position && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
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
    </Box>
  );
}

export default MockInterviewPage;
