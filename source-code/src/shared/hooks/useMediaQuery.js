import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '../constants';

/**
 * useMediaQuery - 媒体查询 Hook
 * @param {string} query - CSS 媒体查询字符串
 * @returns {boolean} 是否匹配
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/**
 * useIsMobile - 判断是否移动端（md 断点以下）
 * @returns {boolean}
 */
export function useIsMobile() {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.MD}px)`);
}
