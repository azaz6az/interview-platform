/**
 * storage.js - localStorage 统一操作模块
 * 所有 key 使用 ip_ 前缀
 */
import { STORAGE_KEYS } from './constants';

/**
 * 通用读取方法
 * @param {string} key - localStorage key
 * @param {*} defaultValue - 默认值
 * @returns {*} 解析后的值或默认值
 */
export function loadFromStorage(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch {
    // 非 JSON 格式直接返回原始字符串
    const raw = localStorage.getItem(key);
    return raw !== null ? raw : defaultValue;
  }
}

/**
 * 通用写入方法（带 localStorage 5MB 限制容错）
 * @param {string} key - localStorage key
 * @param {*} value - 要存储的值
 * @param {boolean} silentOnQuotaError - 超限时是否静默失败（不打印警告）
 */
export function saveToStorage(key, value, silentOnQuotaError = false) {
  try {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (e) {
    // QuotaExceededError - localStorage 超限
    if (e.name === 'QuotaExceededError' || e.code === 22) {
      if (!silentOnQuotaError) {
        console.warn(`localStorage 超限，无法存储 [${key}]。数据可能过大，跳过存储。`);
      }
    } else {
      console.warn(`保存到 localStorage 失败 [${key}]:`, e.message);
    }
  }
}

/**
 * 删除指定 key
 * @param {string} key - localStorage key
 */
export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn(`删除 localStorage 失败 [${key}]:`, e.message);
  }
}

// ---- 便捷方法 ----

/** 简历 */
export const saveResume = (text) => saveToStorage(STORAGE_KEYS.RESUME, text);
export const loadResume = () => loadFromStorage(STORAGE_KEYS.RESUME, '');

/** JD */
export const saveJD = (text) => saveToStorage(STORAGE_KEYS.JD, text);
export const loadJD = () => loadFromStorage(STORAGE_KEYS.JD, '');

/**
 * JD 截图（base64 图片数据）
 * 注意：base64 图片可能很大，localStorage 有 5MB 限制
 * 如果存储超限则静默失败，不影响文本存储
 */
export const saveJDImage = (imageData) => {
  if (!imageData) {
    removeFromStorage(STORAGE_KEYS.JD_IMAGE);
    return;
  }
  // 图片 base64 数据可能很大，超限时静默失败（只存文本不存图片）
  saveToStorage(STORAGE_KEYS.JD_IMAGE, imageData, true);
};
export const loadJDImage = () => loadFromStorage(STORAGE_KEYS.JD_IMAGE, null);

/** 面试记录 */
export const saveInterviewRecords = (records) => saveToStorage(STORAGE_KEYS.INTERVIEW_RECORDS, records);
export const loadInterviewRecords = () => loadFromStorage(STORAGE_KEYS.INTERVIEW_RECORDS, []);

/** 收藏题目 */
export const saveFavorites = (ids) => saveToStorage(STORAGE_KEYS.FAVORITES, ids);
export const loadFavorites = () => loadFromStorage(STORAGE_KEYS.FAVORITES, []);

/** 复盘条目 */
export const saveReviewEntries = (entries) => saveToStorage(STORAGE_KEYS.REVIEW_ENTRIES, entries);
export const loadReviewEntries = () => loadFromStorage(STORAGE_KEYS.REVIEW_ENTRIES, []);