import { useState, useCallback } from 'react';

/**
 * useLocalStorage - 封装 localStorage 的 React Hook
 * @param {string} key - localStorage key
 * @param {*} initialValue - 初始值
 * @returns {[*, Function]} [storedValue, setValue]
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return initialValue;
      return JSON.parse(item);
    } catch {
      const raw = localStorage.getItem(key);
      return raw !== null ? raw : initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      try {
        const serialized = typeof valueToStore === 'string'
          ? valueToStore
          : JSON.stringify(valueToStore);
        localStorage.setItem(key, serialized);
      } catch (e) {
        console.warn(`useLocalStorage: 保存失败 [${key}]:`, e.message);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}
