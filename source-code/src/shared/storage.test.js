/**
 * storage.js 单元测试
 * 测试 localStorage 统一操作模块
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => { store[key] = value; }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get _store() { return store; },
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

import {
  loadFromStorage,
  saveToStorage,
  removeFromStorage,
  saveResume,
  loadResume,
  saveJD,
  loadJD,
  saveJDImage,
  loadJDImage,
} from './storage';

import { STORAGE_KEYS } from './constants';

describe('storage.js', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  // ===== loadFromStorage =====
  describe('loadFromStorage', () => {
    it('should return default value when key does not exist', () => {
      expect(loadFromStorage('nonexistent', 'default')).toBe('default');
    });

    it('should return null by default when no default specified', () => {
      expect(loadFromStorage('nonexistent')).toBeNull();
    });

    it('should parse and return stored JSON', () => {
      // Use real localStorage mock store for this test
      localStorageMock._store['ip_resume'] = JSON.stringify({ data: 'test' });
      localStorageMock.getItem.mockImplementation((key) => localStorageMock._store[key] ?? null);
      const result = loadFromStorage('ip_resume');
      expect(result).toEqual({ data: 'test' });
    });

    it('should return raw string when JSON parse fails', () => {
      // Set a non-JSON string in the store directly
      localStorageMock._store['test_key'] = 'not-json';
      // Override getItem to return the raw value both times (since loadFromStorage calls getItem twice in the catch block)
      localStorageMock.getItem.mockImplementation((key) => localStorageMock._store[key] ?? null);
      const result = loadFromStorage('test_key');
      expect(result).toBe('not-json');
    });
  });

  // ===== saveToStorage =====
  describe('saveToStorage', () => {
    it('should save string value directly', () => {
      saveToStorage('key', 'value');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('key', 'value');
    });

    it('should serialize non-string values as JSON', () => {
      saveToStorage('key', { data: 'test' });
      expect(localStorageMock.setItem).toHaveBeenCalledWith('key', JSON.stringify({ data: 'test' }));
    });

    it('should handle QuotaExceededError silently when silentOnQuotaError is true', () => {
      const error = new Error('Quota exceeded');
      error.name = 'QuotaExceededError';
      localStorageMock.setItem.mockImplementationOnce(() => { throw error; });

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      saveToStorage('key', 'value', true);
      expect(warnSpy).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('should warn on QuotaExceededError when silentOnQuotaError is false', () => {
      const error = new Error('Quota exceeded');
      error.name = 'QuotaExceededError';
      localStorageMock.setItem.mockImplementationOnce(() => { throw error; });

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      saveToStorage('key', 'value', false);
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('should warn on other storage errors', () => {
      const error = new Error('Some error');
      localStorageMock.setItem.mockImplementationOnce(() => { throw error; });

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      saveToStorage('key', 'value');
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });

  // ===== removeFromStorage =====
  describe('removeFromStorage', () => {
    it('should remove key from localStorage', () => {
      removeFromStorage('key');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('key');
    });
  });

  // ===== saveResume / loadResume =====
  describe('saveResume / loadResume', () => {
    it('should save and load resume text', () => {
      localStorageMock.setItem.mockImplementation((key, value) => { localStorageMock._store[key] = value; });
      localStorageMock.getItem.mockImplementation((key) => localStorageMock._store[key] ?? null);

      saveResume('My resume content');
      expect(loadResume()).toBe('My resume content');
    });

    it('should return empty string when no resume saved', () => {
      localStorageMock.getItem.mockImplementation((key) => localStorageMock._store[key] ?? null);
      expect(loadResume()).toBe('');
    });
  });

  // ===== saveJD / loadJD =====
  describe('saveJD / loadJD', () => {
    it('should save and load JD text', () => {
      localStorageMock.setItem.mockImplementation((key, value) => { localStorageMock._store[key] = value; });
      localStorageMock.getItem.mockImplementation((key) => localStorageMock._store[key] ?? null);

      saveJD('JD content');
      expect(loadJD()).toBe('JD content');
    });

    it('should return empty string when no JD saved', () => {
      localStorageMock.getItem.mockImplementation((key) => localStorageMock._store[key] ?? null);
      expect(loadJD()).toBe('');
    });
  });

  // ===== saveJDImage / loadJDImage =====
  describe('saveJDImage / loadJDImage', () => {
    it('should save and load JD image base64 data', () => {
      localStorageMock.setItem.mockImplementation((key, value) => { localStorageMock._store[key] = value; });
      localStorageMock.getItem.mockImplementation((key) => localStorageMock._store[key] ?? null);

      const base64Data = 'data:image/png;base64,iVBORw0KGgo...';
      saveJDImage(base64Data);
      expect(loadJDImage()).toBe(base64Data);
    });

    it('should remove JD image from storage when null is passed', () => {
      saveJDImage(null);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.JD_IMAGE);
    });

    it('should silently fail on QuotaExceededError for JD image', () => {
      const error = new Error('Quota exceeded');
      error.name = 'QuotaExceededError';
      localStorageMock.setItem.mockImplementationOnce(() => { throw error; });

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      saveJDImage('data:image/png;base64,largeimage...');
      expect(warnSpy).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('should return null when no JD image saved', () => {
      localStorageMock.getItem.mockImplementation((key) => localStorageMock._store[key] ?? null);
      expect(loadJDImage()).toBeNull();
    });
  });

  // ===== STORAGE_KEYS =====
  describe('STORAGE_KEYS', () => {
    it('should contain JD_IMAGE key', () => {
      expect(STORAGE_KEYS.JD_IMAGE).toBe('ip_jd_image');
    });

    it('should have all required keys', () => {
      expect(STORAGE_KEYS.RESUME).toBeDefined();
      expect(STORAGE_KEYS.JD).toBeDefined();
      expect(STORAGE_KEYS.JD_IMAGE).toBeDefined();
    });

    it('should use ip_ prefix for all keys', () => {
      Object.values(STORAGE_KEYS).forEach((key) => {
        expect(key).toMatch(/^ip_/);
      });
    });
  });
});