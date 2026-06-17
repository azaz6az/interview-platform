/**
 * constants.js - 全局常量定义
 * 岗位方向、难度等级、面试类型等
 */

/** 岗位方向列表 */
export const POSITIONS = [
  { id: 'data-analysis', label: '数据分析', icon: 'BarChart' },
  { id: 'product-ops', label: '产品运营', icon: 'TrendingUp' },
  { id: 'business-analysis', label: '商业分析', icon: 'BusinessCenter' },
  { id: 'data-engineering', label: '数据开发', icon: 'Storage' },
  { id: 'management-trainee', label: '管培生', icon: 'School' },
];

/** 难度等级 */
export const DIFFICULTY_LEVELS = [
  { id: 'easy', label: '入门', color: '#4caf50' },
  { id: 'medium', label: '进阶', color: '#ff9800' },
  { id: 'hard', label: '挑战', color: '#f44336' },
];

/** 面试类型 */
export const INTERVIEW_TYPES = [
  { id: 'technical', label: '技术面试' },
  { id: 'behavioral', label: '行为面试' },
  { id: 'case', label: '案例分析' },
  { id: 'hr', label: 'HR面试' },
];

/** 模拟面试最大轮次 */
export const MAX_INTERVIEW_ROUNDS = 8;
/** 模拟面试最小轮次 */
export const MIN_INTERVIEW_ROUNDS = 3;

/** 面试评估维度及权重 */
export const EVALUATION_DIMENSIONS = [
  { key: 'quality', label: '回答质量', weight: 0.4 },
  { key: 'logic', label: '逻辑性', weight: 0.3 },
  { key: 'clarity', label: '表达清晰度', weight: 0.3 },
];

/** localStorage key 前缀 */
export const STORAGE_PREFIX = 'ip_';

/** localStorage 完整 key 映射 */
export const STORAGE_KEYS = {
  RESUME: 'ip_resume',
  JD: 'ip_jd',
  JD_IMAGE: 'ip_jd_image',
  INTERVIEW_RECORDS: 'ip_interview_records',
  FAVORITES: 'ip_favorites',
  REVIEW_ENTRIES: 'ip_review_entries',
};

/** 响应式断点 */
export const BREAKPOINTS = {
  MD: 960,
};