import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { analyzeResume } from '../modules/jd-adapter/engine/analyzer';
import { saveResume, saveJD, loadResume, loadJD, saveJDImage, loadJDImage } from '../shared/storage';

/** 初始状态 */
const initialState = {
  resumeText: '',
  jdText: '',
  jdImage: null,
  analysisResult: null,
  isAnalyzing: false,
  snackbar: { open: false, message: '', severity: 'success' },
};

/** Action 类型 */
const ACTION_TYPES = {
  SET_RESUME: 'SET_RESUME',
  SET_JD: 'SET_JD',
  SET_JD_IMAGE: 'SET_JD_IMAGE',
  SET_ANALYZING: 'SET_ANALYZING',
  SET_RESULT: 'SET_RESULT',
  SET_SNACKBAR: 'SET_SNACKBAR',
  RESET: 'RESET',
};

/** Reducer */
function jdAdapterReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_RESUME:
      return { ...state, resumeText: action.payload };
    case ACTION_TYPES.SET_JD:
      return { ...state, jdText: action.payload };
    case ACTION_TYPES.SET_JD_IMAGE:
      return { ...state, jdImage: action.payload };
    case ACTION_TYPES.SET_ANALYZING:
      return { ...state, isAnalyzing: action.payload };
    case ACTION_TYPES.SET_RESULT:
      return { ...state, analysisResult: action.payload };
    case ACTION_TYPES.SET_SNACKBAR:
      return { ...state, snackbar: { ...state.snackbar, ...action.payload } };
    case ACTION_TYPES.RESET:
      return { ...initialState };
    default:
      return state;
  }
}

/** Context */
const JdAdapterContext = createContext(null);

/**
 * JdAdapterProvider - JD 适配器全局状态管理
 */
export function JdAdapterProvider({ children }) {
  const [state, dispatch] = useReducer(jdAdapterReducer, {
    ...initialState,
    resumeText: loadResume() || '',
    jdText: loadJD() || '',
    jdImage: loadJDImage() || null,
  });

  /** 更新简历文本 */
  const setResumeText = useCallback((text) => {
    dispatch({ type: ACTION_TYPES.SET_RESUME, payload: text });
    saveResume(text);
  }, []);

  /** 更新 JD 文本 */
  const setJdText = useCallback((text) => {
    dispatch({ type: ACTION_TYPES.SET_JD, payload: text });
    saveJD(text);
  }, []);

  /** 更新 JD 截图 */
  const setJdImage = useCallback((imageData) => {
    dispatch({ type: ACTION_TYPES.SET_JD_IMAGE, payload: imageData });
    saveJDImage(imageData);
  }, []);

  /** 执行分析 */
  const handleAnalyze = useCallback(async () => {
    if (!state.resumeText.trim()) {
      dispatch({
        type: ACTION_TYPES.SET_SNACKBAR,
        payload: { open: true, message: '请先输入简历内容', severity: 'warning' },
      });
      return;
    }
    if (!state.jdText.trim()) {
      dispatch({
        type: ACTION_TYPES.SET_SNACKBAR,
        payload: { open: true, message: '请先输入岗位描述', severity: 'warning' },
      });
      return;
    }

    dispatch({ type: ACTION_TYPES.SET_ANALYZING, payload: true });

    try {
      const result = analyzeResume(state.resumeText, state.jdText);
      await new Promise((resolve) => setTimeout(resolve, 800));
      dispatch({ type: ACTION_TYPES.SET_RESULT, payload: result });
      dispatch({
        type: ACTION_TYPES.SET_SNACKBAR,
        payload: { open: true, message: '分析完成！', severity: 'success' },
      });
    } catch (error) {
      dispatch({
        type: ACTION_TYPES.SET_SNACKBAR,
        payload: { open: true, message: `分析出错：${error.message}`, severity: 'error' },
      });
    } finally {
      dispatch({ type: ACTION_TYPES.SET_ANALYZING, payload: false });
    }
  }, [state.resumeText, state.jdText]);

  /** 重置所有内容 */
  const handleReset = useCallback(() => {
    dispatch({ type: ACTION_TYPES.RESET });
    saveResume('');
    saveJD('');
    saveJDImage(null);
  }, []);

  /** 关闭 Snackbar */
  const closeSnackbar = useCallback(() => {
    dispatch({
      type: ACTION_TYPES.SET_SNACKBAR,
      payload: { open: false },
    });
  }, []);

  const value = {
    ...state,
    setResumeText,
    setJdText,
    setJdImage,
    handleAnalyze,
    handleReset,
    closeSnackbar,
  };

  return (
    <JdAdapterContext.Provider value={value}>
      {children}
    </JdAdapterContext.Provider>
  );
}

/**
 * useJdAdapter - 获取 JD 适配器上下文
 */
export function useJdAdapter() {
  const ctx = useContext(JdAdapterContext);
  if (!ctx) throw new Error('useJdAdapter must be used within JdAdapterProvider');
  return ctx;
}