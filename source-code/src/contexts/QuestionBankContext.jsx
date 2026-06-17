import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { saveFavorites, loadFavorites } from '../shared/storage';
import questionsData from '../modules/question-bank/data/questions.json';
import { searchQuestions } from '../modules/question-bank/engine/questionSearch';

/** 初始状态 */
const initialState = {
  questions: questionsData,
  filteredQuestions: questionsData,
  filters: { position: '', difficulty: '', keyword: '', favoritesOnly: false },
  favorites: loadFavorites() || [],
  selectedQuestion: null,
};

const ACTION_TYPES = {
  SET_FILTERS: 'SET_FILTERS',
  SET_FILTERED: 'SET_FILTERED',
  TOGGLE_FAVORITE: 'TOGGLE_FAVORITE',
  SELECT_QUESTION: 'SELECT_QUESTION',
  CLOSE_QUESTION: 'CLOSE_QUESTION',
};

function questionBankReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case ACTION_TYPES.SET_FILTERED:
      return { ...state, filteredQuestions: action.payload };
    case ACTION_TYPES.TOGGLE_FAVORITE: {
      const id = action.payload;
      const isFav = state.favorites.includes(id);
      const newFavs = isFav
        ? state.favorites.filter((fid) => fid !== id)
        : [...state.favorites, id];
      saveFavorites(newFavs);
      return { ...state, favorites: newFavs };
    }
    case ACTION_TYPES.SELECT_QUESTION:
      return { ...state, selectedQuestion: action.payload };
    case ACTION_TYPES.CLOSE_QUESTION:
      return { ...state, selectedQuestion: null };
    default:
      return state;
  }
}

const QuestionBankContext = createContext(null);

/**
 * QuestionBankProvider - 题库全局状态管理
 */
export function QuestionBankProvider({ children }) {
  const [state, dispatch] = useReducer(questionBankReducer, initialState);

  /** 更新筛选条件并重新搜索 */
  const updateFilters = useCallback(
    (newFilters) => {
      const merged = { ...state.filters, ...newFilters };
      dispatch({ type: ACTION_TYPES.SET_FILTERS, payload: newFilters });
      const results = searchQuestions(state.questions, merged, state.favorites);
      dispatch({ type: ACTION_TYPES.SET_FILTERED, payload: results });
    },
    [state.questions, state.filters, state.favorites]
  );

  /** 切换收藏 */
  const toggleFavorite = useCallback((id) => {
    dispatch({ type: ACTION_TYPES.TOGGLE_FAVORITE, payload: id });
  }, []);

  /** 查看题目详情 */
  const selectQuestion = useCallback((question) => {
    dispatch({ type: ACTION_TYPES.SELECT_QUESTION, payload: question });
  }, []);

  /** 关闭题目详情 */
  const closeQuestion = useCallback(() => {
    dispatch({ type: ACTION_TYPES.CLOSE_QUESTION });
  }, []);

  const value = {
    ...state,
    updateFilters,
    toggleFavorite,
    selectQuestion,
    closeQuestion,
  };

  return (
    <QuestionBankContext.Provider value={value}>
      {children}
    </QuestionBankContext.Provider>
  );
}

/**
 * useQuestionBank - 获取题库上下文
 */
export function useQuestionBank() {
  const ctx = useContext(QuestionBankContext);
  if (!ctx) throw new Error('useQuestionBank must be used within QuestionBankProvider');
  return ctx;
}
