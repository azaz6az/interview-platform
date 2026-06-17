import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { saveReviewEntries, loadReviewEntries } from '../shared/storage';
import { analyzeWeaknesses } from '../modules/review/engine/reviewAnalyzer';
import { calculateTrend } from '../modules/review/engine/trendCalculator';

/** 初始状态 */
const initialState = {
  entries: loadReviewEntries() || [],
  weaknesses: [],
  trend: [],
  dialogOpen: false,
  editingEntry: null,
};

const ACTION_TYPES = {
  ADD_ENTRY: 'ADD_ENTRY',
  UPDATE_ENTRY: 'UPDATE_ENTRY',
  DELETE_ENTRY: 'DELETE_ENTRY',
  SET_ENTRIES: 'SET_ENTRIES',
  SET_WEAKNESSES: 'SET_WEAKNESSES',
  SET_TREND: 'SET_TREND',
  OPEN_DIALOG: 'OPEN_DIALOG',
  CLOSE_DIALOG: 'CLOSE_DIALOG',
};

function reviewReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.ADD_ENTRY: {
      const newEntries = [action.payload, ...state.entries];
      saveReviewEntries(newEntries);
      return { ...state, entries: newEntries };
    }
    case ACTION_TYPES.UPDATE_ENTRY: {
      const updated = state.entries.map((e) =>
        e.id === action.payload.id ? action.payload : e
      );
      saveReviewEntries(updated);
      return { ...state, entries: updated };
    }
    case ACTION_TYPES.DELETE_ENTRY: {
      const filtered = state.entries.filter((e) => e.id !== action.payload);
      saveReviewEntries(filtered);
      return { ...state, entries: filtered };
    }
    case ACTION_TYPES.SET_ENTRIES:
      return { ...state, entries: action.payload };
    case ACTION_TYPES.SET_WEAKNESSES:
      return { ...state, weaknesses: action.payload };
    case ACTION_TYPES.SET_TREND:
      return { ...state, trend: action.payload };
    case ACTION_TYPES.OPEN_DIALOG:
      return { ...state, dialogOpen: true, editingEntry: action.payload || null };
    case ACTION_TYPES.CLOSE_DIALOG:
      return { ...state, dialogOpen: false, editingEntry: null };
    default:
      return state;
  }
}

const ReviewContext = createContext(null);

/**
 * ReviewProvider - 复盘日记全局状态管理
 */
export function ReviewProvider({ children }) {
  const [state, dispatch] = useReducer(reviewReducer, initialState);

  /** 添加复盘条目 */
  const addEntry = useCallback((entry) => {
    const newEntry = { ...entry, id: Date.now().toString(), createdAt: new Date().toISOString() };
    dispatch({ type: ACTION_TYPES.ADD_ENTRY, payload: newEntry });
  }, []);

  /** 更新复盘条目 */
  const updateEntry = useCallback((entry) => {
    dispatch({ type: ACTION_TYPES.UPDATE_ENTRY, payload: entry });
  }, []);

  /** 删除复盘条目 */
  const deleteEntry = useCallback((id) => {
    dispatch({ type: ACTION_TYPES.DELETE_ENTRY, payload: id });
  }, []);

  /** 计算薄弱环节 */
  const computeWeaknesses = useCallback(() => {
    const weaknesses = analyzeWeaknesses(state.entries);
    dispatch({ type: ACTION_TYPES.SET_WEAKNESSES, payload: weaknesses });
    return weaknesses;
  }, [state.entries]);

  /** 计算趋势 */
  const computeTrend = useCallback(() => {
    const trend = calculateTrend(state.entries);
    dispatch({ type: ACTION_TYPES.SET_TREND, payload: trend });
    return trend;
  }, [state.entries]);

  /** 打开/关闭弹窗 */
  const openDialog = useCallback((entry = null) => {
    dispatch({ type: ACTION_TYPES.OPEN_DIALOG, payload: entry });
  }, []);

  const closeDialog = useCallback(() => {
    dispatch({ type: ACTION_TYPES.CLOSE_DIALOG });
  }, []);

  const value = {
    ...state,
    addEntry,
    updateEntry,
    deleteEntry,
    computeWeaknesses,
    computeTrend,
    openDialog,
    closeDialog,
  };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
}

/**
 * useReview - 获取复盘日记上下文
 */
export function useReview() {
  const ctx = useContext(ReviewContext);
  if (!ctx) throw new Error('useReview must be used within ReviewProvider');
  return ctx;
}
