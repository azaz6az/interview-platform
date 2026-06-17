import React, { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';
import {
  POSITIONS,
  MAX_INTERVIEW_ROUNDS,
  EVALUATION_DIMENSIONS,
} from '../shared/constants';
import { generateQuestionSync } from '../modules/mock-interview/engine/questionGenerator';
import { evaluateAnswer } from '../modules/mock-interview/engine/answerEvaluator';
import { getFollowUp } from '../modules/mock-interview/engine/followUpStrategy';
import { saveInterviewRecords, loadInterviewRecords } from '../shared/storage';
import { evaluateAndFollowUp } from '../services/aiService';

/** Fisher-Yates 洗牌 */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 生成洗牌索引 */
function makeShuffledIndices(positionId) {
  const questions = generateQuestionSync.__getQuestions
    ? generateQuestionSync.__getQuestions(positionId)
    : null;
  const len = questions ? questions.length : 20;
  return shuffleArray(Array.from({ length: len }, (_, i) => i));
}

/** 初始状态 */
const initialState = {
  position: null,
  messages: [],
  currentRound: 0,
  isStarted: false,
  isFinished: false,
  isEvaluating: false,
  evaluation: null,
  records: [],
  shuffledIndices: [],
  currentQuestionId: null,
  questionStartTime: null,
};

const ACTION_TYPES = {
  SELECT_POSITION: 'SELECT_POSITION',
  START_INTERVIEW: 'START_INTERVIEW',
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_EVALUATING: 'SET_EVALUATING',
  NEXT_ROUND: 'NEXT_ROUND',
  FINISH_INTERVIEW: 'FINISH_INTERVIEW',
  SET_EVALUATION: 'SET_EVALUATION',
  RESET: 'RESET',
  LOAD_RECORDS: 'LOAD_RECORDS',
  ADD_RECORD: 'ADD_RECORD',
  DELETE_RECORD: 'DELETE_RECORD',
  SET_QUESTION_META: 'SET_QUESTION_META',
};

function mockInterviewReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.SELECT_POSITION:
      return { ...state, position: action.payload };
    case ACTION_TYPES.START_INTERVIEW:
      return {
        ...state,
        isStarted: true,
        isFinished: false,
        currentRound: 1,
        messages: [],
        evaluation: null,
        shuffledIndices: action.payload.shuffledIndices,
        currentQuestionId: null,
        questionStartTime: Date.now(),
      };
    case ACTION_TYPES.ADD_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload] };
    case ACTION_TYPES.SET_EVALUATING:
      return { ...state, isEvaluating: action.payload };
    case ACTION_TYPES.NEXT_ROUND:
      return { ...state, currentRound: state.currentRound + 1 };
    case ACTION_TYPES.FINISH_INTERVIEW:
      return { ...state, isFinished: true };
    case ACTION_TYPES.SET_EVALUATION:
      return { ...state, evaluation: action.payload };
    case ACTION_TYPES.RESET:
      return { ...initialState, records: state.records };
    case ACTION_TYPES.LOAD_RECORDS:
      return { ...state, records: action.payload };
    case ACTION_TYPES.ADD_RECORD:
      return { ...state, records: [...state.records, action.payload] };
    case ACTION_TYPES.DELETE_RECORD:
      return { ...state, records: state.records.filter((r) => r.id !== action.payload) };
    case ACTION_TYPES.SET_QUESTION_META:
      return { ...state, currentQuestionId: action.payload.questionId, questionStartTime: action.payload.startTime };
    default:
      return state;
  }
}

const MockInterviewContext = createContext(null);

/**
 * MockInterviewProvider - 模拟面试全局状态管理
 */
export function MockInterviewProvider({ children, apiKey }) {
  const [state, dispatch] = useReducer(mockInterviewReducer, {
    ...initialState,
    records: loadInterviewRecords() || [],
  });

  /** 用 ref 追踪最新 state，避免闭包陷阱 */
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  /** 选择岗位方向 */
  const selectPosition = useCallback((position) => {
    dispatch({ type: ACTION_TYPES.SELECT_POSITION, payload: position });
  }, []);

  /** 开始面试 */
  const startInterview = useCallback(() => {
    const pos = stateRef.current.position;
    const indices = makeShuffledIndices(pos || 'data-analysis');
    dispatch({ type: ACTION_TYPES.START_INTERVIEW, payload: { shuffledIndices: indices } });
  }, []);

  /** 发送用户回答并获取下一轮 */
  const submitAnswer = useCallback(
    async (answer) => {
      const currentState = stateRef.current;
      const duration = currentState.questionStartTime
        ? Math.round((Date.now() - currentState.questionStartTime) / 1000)
        : 0;

      // 添加用户消息（含答题耗时）
      dispatch({
        type: ACTION_TYPES.ADD_MESSAGE,
        payload: { role: 'user', content: answer, timestamp: Date.now(), duration },
      });

      dispatch({ type: ACTION_TYPES.SET_EVALUATING, payload: true });

      const currentRound = currentState.currentRound;
      const position = currentState.position;
      const lastAiMsg = [...currentState.messages].reverse().find((m) => m.role === 'ai');
      const lastQuestion = lastAiMsg?.content || '';

      if (currentRound >= MAX_INTERVIEW_ROUNDS) {
        dispatch({ type: ACTION_TYPES.FINISH_INTERVIEW });
        dispatch({ type: ACTION_TYPES.SET_EVALUATING, payload: false });
        return;
      }

      let followUp = '';
      let aiScore = null;

      // 有 API Key → 用 AI 评估 + 生成追问
      if (apiKey) {
        try {
          const positionLabel = POSITIONS.find((p) => p.id === position)?.label || position;
          const jdContext = `岗位方向：${positionLabel}`;
          const result = await evaluateAndFollowUp(apiKey, jdContext, lastQuestion, answer);
          followUp = result.followUp || '请继续回答下一个问题';
          aiScore = result.score;
        } catch (err) {
          console.warn('AI 评估失败，降级到本地:', err);
          // 降级到本地
          followUp = getFollowUp(answer, currentRound, position, currentState.shuffledIndices);
        }
      } else {
        // 无 API Key → 本地规则
        followUp = getFollowUp(answer, currentRound, position, currentState.shuffledIndices);
      }

      const nextRound = currentRound + 1;
      const questions = generateQuestionSync.__getQuestions
        ? generateQuestionSync.__getQuestions(position || 'data-analysis')
        : null;
      const questionId = questions
        ? questions[(nextRound - 1) % questions.length]?.id || null
        : null;

      // AI 评估时显示评分反馈
      const prefix = aiScore ? `[${aiScore}/5 分] ` : '';
      dispatch({
        type: ACTION_TYPES.ADD_MESSAGE,
        payload: { role: 'ai', content: prefix + followUp, timestamp: Date.now(), questionId },
      });

      dispatch({ type: ACTION_TYPES.NEXT_ROUND });
      dispatch({ type: ACTION_TYPES.SET_EVALUATING, payload: false });
      dispatch({ type: ACTION_TYPES.SET_QUESTION_META, payload: { questionId, startTime: Date.now() } });
    },
    [apiKey]
  );

  /** 主动结束面试 */
  const finishInterview = useCallback(() => {
    dispatch({ type: ACTION_TYPES.FINISH_INTERVIEW });
  }, []);

  /** 计算评估结果 */
  const calculateEvaluation = useCallback(() => {
    const currentState = stateRef.current;
    const messages = currentState.messages;
    const userAnswers = messages.filter((m) => m.role === 'user');
    if (userAnswers.length === 0) return null;

    const totalScore = { quality: 0, logic: 0, clarity: 0 };
    const answerEvals = [];

    for (const answer of userAnswers) {
      const eval_ = evaluateAnswer(answer.content, currentState.position);
      answerEvals.push(eval_);
      totalScore.quality += eval_.quality;
      totalScore.logic += eval_.logic;
      totalScore.clarity += eval_.clarity;
    }

    const n = userAnswers.length;
    const avgScore = {
      quality: Math.round((totalScore.quality / n) * 10) / 10,
      logic: Math.round((totalScore.logic / n) * 10) / 10,
      clarity: Math.round((totalScore.clarity / n) * 10) / 10,
    };

    const weightedTotal =
      avgScore.quality * 0.4 + avgScore.logic * 0.3 + avgScore.clarity * 0.3;
    const overallScore = Math.round(weightedTotal * 10) / 10;

    const suggestions = [];
    if (avgScore.quality < 3) suggestions.push('回答内容偏浅，建议结合具体案例和数据支撑观点');
    if (avgScore.logic < 3) suggestions.push('回答逻辑性不足，建议使用 STAR 法则组织回答');
    if (avgScore.clarity < 3) suggestions.push('表达清晰度有待提高，建议练习精炼表述，控制回答时长');
    if (suggestions.length === 0) suggestions.push('整体表现不错，继续保持！可以尝试加入更多数据支撑');

    const evaluation = {
      overallScore: Math.min(5, overallScore),
      dimensions: avgScore,
      answerEvals,
      suggestions,
    };

    dispatch({ type: ACTION_TYPES.SET_EVALUATION, payload: evaluation });

    // 保存面试记录（从 localStorage 加载最新数据避免竞态）
    const record = {
      id: Date.now().toString(),
      position: currentState.position,
      date: new Date().toISOString(),
      messages: currentState.messages,
      evaluation,
    };

    const latestRecords = loadInterviewRecords() || [];
    const updatedRecords = [...latestRecords, record];
    dispatch({ type: ACTION_TYPES.ADD_RECORD, payload: record });
    saveInterviewRecords(updatedRecords);

    return evaluation;
  }, []);

  /** 删除面试记录 */
  const deleteRecord = useCallback((id) => {
    dispatch({ type: ACTION_TYPES.DELETE_RECORD, payload: id });
    const latestRecords = loadInterviewRecords() || [];
    const updatedRecords = latestRecords.filter((r) => r.id !== id);
    saveInterviewRecords(updatedRecords);
  }, []);

  /** 添加 AI 消息（供页面在开始时调用） */
  const addAiMessage = useCallback((content, questionId = null) => {
    dispatch({
      type: ACTION_TYPES.ADD_MESSAGE,
      payload: { role: 'ai', content, timestamp: Date.now(), questionId },
    });
    dispatch({ type: ACTION_TYPES.SET_QUESTION_META, payload: { questionId, startTime: Date.now() } });
  }, []);

  /** 重置面试 */
  const resetInterview = useCallback(() => {
    dispatch({ type: ACTION_TYPES.RESET });
  }, []);

  /** 导出面试报告 */
  const exportReport = useCallback(() => {
    const currentState = stateRef.current;
    const { messages, evaluation, position } = currentState;
    const positionLabel = POSITIONS.find((p) => p.id === position)?.label || position;

    let report = `面面俱到 - 面试报告\n`;
    report += `${'='.repeat(40)}\n`;
    report += `岗位方向：${positionLabel}\n`;
    report += `日期：${new Date().toLocaleString('zh-CN')}\n`;
    report += `综合评分：${evaluation?.overallScore ?? '-'}/5\n\n`;

    if (evaluation?.dimensions) {
      report += `维度评分：\n`;
      const labels = { quality: '回答质量', logic: '逻辑性', clarity: '表达清晰度' };
      for (const [key, val] of Object.entries(evaluation.dimensions)) {
        report += `  ${labels[key] || key}: ${val}/5\n`;
      }
      report += `\n`;
    }

    report += `对话记录：\n`;
    report += `${'-'.repeat(40)}\n`;
    for (const msg of messages) {
      const role = msg.role === 'ai' ? '【面试官】' : '【你】';
      const time = msg.duration ? ` (${msg.duration}秒)` : '';
      report += `${role}${time}: ${msg.content}\n\n`;
    }

    if (evaluation?.suggestions?.length > 0) {
      report += `\n改进建议：\n`;
      evaluation.suggestions.forEach((s, i) => { report += `${i + 1}. ${s}\n`; });
    }

    // 复制到剪贴板
    navigator.clipboard.writeText(report).then(() => {
      // 会在调用方处理反馈
    }).catch(() => {
      // fallback
      const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `面试报告_${positionLabel}_${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    });

    return report;
  }, []);

  const value = {
    ...state,
    selectPosition,
    startInterview,
    addAiMessage,
    submitAnswer,
    finishInterview,
    calculateEvaluation,
    resetInterview,
    deleteRecord,
    exportReport,
  };

  return (
    <MockInterviewContext.Provider value={value}>
      {children}
    </MockInterviewContext.Provider>
  );
}

/**
 * useMockInterview - 获取模拟面试上下文
 */
export function useMockInterview() {
  const ctx = useContext(MockInterviewContext);
  if (!ctx) throw new Error('useMockInterview must be used within MockInterviewProvider');
  return ctx;
}
