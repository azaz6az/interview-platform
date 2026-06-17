import React, { createContext, useContext, useReducer, useCallback } from 'react';
import {
  POSITIONS,
  MAX_INTERVIEW_ROUNDS,
  EVALUATION_DIMENSIONS,
} from '../shared/constants';
import { generateQuestion } from '../modules/mock-interview/engine/questionGenerator';
import { evaluateAnswer } from '../modules/mock-interview/engine/answerEvaluator';
import { getFollowUp } from '../modules/mock-interview/engine/followUpStrategy';
import { saveInterviewRecords, loadInterviewRecords } from '../shared/storage';

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
    default:
      return state;
  }
}

const MockInterviewContext = createContext(null);

/**
 * MockInterviewProvider - 模拟面试全局状态管理
 */
export function MockInterviewProvider({ children }) {
  const [state, dispatch] = useReducer(mockInterviewReducer, {
    ...initialState,
    records: loadInterviewRecords() || [],
  });

  /** 选择岗位方向 */
  const selectPosition = useCallback((position) => {
    dispatch({ type: ACTION_TYPES.SELECT_POSITION, payload: position });
  }, []);

  /** 开始面试 */
  const startInterview = useCallback(() => {
    dispatch({ type: ACTION_TYPES.START_INTERVIEW });
  }, []);

  /** 发送用户回答并获取下一轮 */
  const submitAnswer = useCallback(
    async (answer) => {
      // 添加用户消息
      dispatch({
        type: ACTION_TYPES.ADD_MESSAGE,
        payload: { role: 'user', content: answer, timestamp: Date.now() },
      });

      dispatch({ type: ACTION_TYPES.SET_EVALUATING, payload: true });

      // 模拟异步评估延迟
      await new Promise((r) => setTimeout(r, 600));

      const currentRound = state.currentRound;
      const position = state.position;

      if (currentRound >= MAX_INTERVIEW_ROUNDS) {
        // 达到最大轮次，结束面试
        dispatch({ type: ACTION_TYPES.FINISH_INTERVIEW });
        dispatch({ type: ACTION_TYPES.SET_EVALUATING, payload: false });
        return;
      }

      // 生成追问或新问题
      const followUp = getFollowUp(answer, currentRound, position);
      dispatch({
        type: ACTION_TYPES.ADD_MESSAGE,
        payload: { role: 'ai', content: followUp, timestamp: Date.now() },
      });

      dispatch({ type: ACTION_TYPES.NEXT_ROUND });
      dispatch({ type: ACTION_TYPES.SET_EVALUATING, payload: false });
    },
    [state.currentRound, state.position]
  );

  /** 主动结束面试 */
  const finishInterview = useCallback(() => {
    dispatch({ type: ACTION_TYPES.FINISH_INTERVIEW });
  }, []);

  /** 计算评估结果 */
  const calculateEvaluation = useCallback(() => {
    const messages = state.messages;
    const userAnswers = messages.filter((m) => m.role === 'user');
    if (userAnswers.length === 0) return null;

    const totalScore = { quality: 0, logic: 0, clarity: 0 };
    const answerEvals = [];

    for (const answer of userAnswers) {
      const eval_ = evaluateAnswer(answer.content, state.position);
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

    // 加权总分
    const weightedTotal =
      avgScore.quality * 0.4 + avgScore.logic * 0.3 + avgScore.clarity * 0.3;
    const overallScore = Math.round(weightedTotal * 20) / 10;

    // 生成改进建议
    const suggestions = [];
    if (avgScore.quality < 3) suggestions.push('回答内容偏浅，建议结合具体案例和数据支撑观点');
    if (avgScore.logic < 3) suggestions.push('回答逻辑性不足，建议使用 STAR 法则组织回答');
    if (avgScore.clarity < 3) suggestions.push('表达清晰度有待提高，建议练习精炼表述，控制回答时长');

    const evaluation = {
      overallScore: Math.min(5, overallScore),
      dimensions: avgScore,
      answerEvals,
      suggestions,
    };

    dispatch({ type: ACTION_TYPES.SET_EVALUATION, payload: evaluation });

    // 保存面试记录
    const record = {
      id: Date.now().toString(),
      position: state.position,
      date: new Date().toISOString(),
      messages: state.messages,
      evaluation,
    };
    dispatch({ type: ACTION_TYPES.ADD_RECORD, payload: record });
    const updatedRecords = [...state.records, record];
    saveInterviewRecords(updatedRecords);

    return evaluation;
  }, [state.messages, state.position, state.records]);

  /** 添加 AI 消息（供页面在开始时调用） */
  const addAiMessage = useCallback((content) => {
    dispatch({
      type: ACTION_TYPES.ADD_MESSAGE,
      payload: { role: 'ai', content, timestamp: Date.now() },
    });
  }, []);

  /** 重置面试 */
  const resetInterview = useCallback(() => {
    dispatch({ type: ACTION_TYPES.RESET });
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
