/**
 * JdAdapterContext.jsx 单元测试
 * 测试 Context 状态管理逻辑
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { JdAdapterProvider, useJdAdapter } from './JdAdapterContext';

// Mock analyzer
vi.mock('../modules/jd-adapter/engine/analyzer', () => ({
  analyzeResume: vi.fn(() => ({ score: 85, suggestions: [] })),
}));

// Mock storage functions
const mockSaveResume = vi.fn();
const mockSaveJD = vi.fn();
const mockSaveJDImage = vi.fn();
const mockLoadResume = vi.fn(() => '');
const mockLoadJD = vi.fn(() => '');
const mockLoadJDImage = vi.fn(() => null);

vi.mock('../shared/storage', () => ({
  saveResume: (...args) => mockSaveResume(...args),
  saveJD: (...args) => mockSaveJD(...args),
  loadResume: () => mockLoadResume(),
  loadJD: () => mockLoadJD(),
  saveJDImage: (...args) => mockSaveJDImage(...args),
  loadJDImage: () => mockLoadJDImage(),
}));

const wrapper = ({ children }) => <JdAdapterProvider>{children}</JdAdapterProvider>;

describe('JdAdapterContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw error when useJdAdapter is used outside provider', () => {
    expect(() => {
      renderHook(() => useJdAdapter());
    }).toThrow('useJdAdapter must be used within JdAdapterProvider');
  });

  it('should provide initial state with jdImage as null', () => {
    const { result } = renderHook(() => useJdAdapter(), { wrapper });
    expect(result.current.jdImage).toBeNull();
  });

  it('should provide setJdImage function', () => {
    const { result } = renderHook(() => useJdAdapter(), { wrapper });
    expect(typeof result.current.setJdImage).toBe('function');
  });

  it('should update jdImage via setJdImage', () => {
    const { result } = renderHook(() => useJdAdapter(), { wrapper });

    act(() => {
      result.current.setJdImage('data:image/png;base64,abc');
    });

    expect(result.current.jdImage).toBe('data:image/png;base64,abc');
  });

  it('should clear jdImage when setJdImage(null) is called', () => {
    const { result } = renderHook(() => useJdAdapter(), { wrapper });

    act(() => {
      result.current.setJdImage('data:image/png;base64,abc');
    });

    act(() => {
      result.current.setJdImage(null);
    });

    expect(result.current.jdImage).toBeNull();
  });

  it('should call saveJDImage when setJdImage is invoked', () => {
    const { result } = renderHook(() => useJdAdapter(), { wrapper });

    act(() => {
      result.current.setJdImage('data:image/png;base64,abc');
    });

    expect(mockSaveJDImage).toHaveBeenCalledWith('data:image/png;base64,abc');
  });

  it('should clear jdImage on handleReset', () => {
    const { result } = renderHook(() => useJdAdapter(), { wrapper });

    act(() => {
      result.current.setResumeText('Resume text');
      result.current.setJdText('JD text');
      result.current.setJdImage('data:image/png;base64,abc');
    });

    act(() => {
      result.current.handleReset();
    });

    expect(result.current.resumeText).toBe('');
    expect(result.current.jdText).toBe('');
    expect(result.current.jdImage).toBeNull();
  });

  it('should save null JD image on reset', () => {
    const { result } = renderHook(() => useJdAdapter(), { wrapper });

    act(() => {
      result.current.handleReset();
    });

    expect(mockSaveJDImage).toHaveBeenCalledWith(null);
  });

  it('should update resumeText via setResumeText', () => {
    const { result } = renderHook(() => useJdAdapter(), { wrapper });

    act(() => {
      result.current.setResumeText('My resume');
    });

    expect(result.current.resumeText).toBe('My resume');
  });

  it('should update jdText via setJdText', () => {
    const { result } = renderHook(() => useJdAdapter(), { wrapper });

    act(() => {
      result.current.setJdText('Job description');
    });

    expect(result.current.jdText).toBe('Job description');
  });

  it('should load initial state from storage', () => {
    mockLoadResume.mockReturnValueOnce('saved resume');
    mockLoadJD.mockReturnValueOnce('saved JD');
    mockLoadJDImage.mockReturnValueOnce('data:image/png;base64,saved');

    const { result } = renderHook(() => useJdAdapter(), { wrapper });

    expect(result.current.resumeText).toBe('saved resume');
    expect(result.current.jdText).toBe('saved JD');
    expect(result.current.jdImage).toBe('data:image/png;base64,saved');
  });

  it('should show warning snackbar when analyzing without resume', () => {
    const { result } = renderHook(() => useJdAdapter(), { wrapper });

    act(() => {
      result.current.setJdText('JD text');
    });

    act(() => {
      result.current.handleAnalyze();
    });

    expect(result.current.snackbar.open).toBe(true);
    expect(result.current.snackbar.severity).toBe('warning');
    expect(result.current.snackbar.message).toContain('简历');
  });

  it('should show warning snackbar when analyzing without JD', () => {
    const { result } = renderHook(() => useJdAdapter(), { wrapper });

    act(() => {
      result.current.setResumeText('Resume text');
    });

    act(() => {
      result.current.handleAnalyze();
    });

    expect(result.current.snackbar.open).toBe(true);
    expect(result.current.snackbar.severity).toBe('warning');
    expect(result.current.snackbar.message).toContain('岗位描述');
  });

  it('should close snackbar via closeSnackbar', () => {
    const { result } = renderHook(() => useJdAdapter(), { wrapper });

    act(() => {
      result.current.handleAnalyze();
    });

    act(() => {
      result.current.closeSnackbar();
    });

    expect(result.current.snackbar.open).toBe(false);
  });
});
