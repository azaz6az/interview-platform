/**
 * JdAdapterPage.jsx 集成测试
 * 测试页面级别的组件集成和数据传递
 * JdAdapterPage 本身使用 useJdAdapter，需要被 JdAdapterProvider 包裹
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { JdAdapterProvider } from '../contexts/JdAdapterContext';
import JdAdapterPage from './JdAdapterPage';

// Mock analyzer
vi.mock('../modules/jd-adapter/engine/analyzer', () => ({
  analyzeResume: vi.fn(() => ({
    score: 85,
    suggestions: ['Improve X', 'Add Y'],
  })),
}));

// Mock fileParser
vi.mock('../modules/jd-adapter/engine/fileParser', () => ({
  parseResumeFile: vi.fn(),
  getAcceptedFileTypesString: vi.fn(() => '.pdf,.docx'),
  formatFileSize: vi.fn((bytes) => `${(bytes / 1024).toFixed(1)} KB`),
}));

// Mock storage
vi.mock('../shared/storage', () => ({
  saveResume: vi.fn(),
  saveJD: vi.fn(),
  loadResume: vi.fn(() => ''),
  loadJD: vi.fn(() => ''),
  saveJDImage: vi.fn(),
  loadJDImage: vi.fn(() => null),
}));

// Mock AnalysisResult to simplify integration test
vi.mock('../modules/jd-adapter/components/AnalysisResult', () => ({
  default: () => <div data-testid="analysis-result">Analysis Result Component</div>,
}));

const renderPage = () => {
  return render(
    <MemoryRouter>
      <JdAdapterProvider>
        <JdAdapterPage />
      </JdAdapterProvider>
    </MemoryRouter>
  );
};

describe('JdAdapterPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render both ResumeInput and JDInput components', () => {
    renderPage();
    expect(screen.getByText('Step 1：粘贴简历')).toBeInTheDocument();
    expect(screen.getByText('Step 2：粘贴岗位描述')).toBeInTheDocument();
  });

  it('should render analyze and reset buttons', () => {
    renderPage();
    expect(screen.getByText('分析适配')).toBeInTheDocument();
    expect(screen.getByText('重置')).toBeInTheDocument();
  });

  it('should disable analyze button when inputs are empty', () => {
    renderPage();
    const analyzeBtn = screen.getByText('分析适配');
    expect(analyzeBtn).toBeDisabled();
  });

  it('should enable analyze button when both inputs have text', async () => {
    renderPage();

    const resumeTextarea = screen.getByPlaceholderText(/请粘贴你的简历内容/);
    const jdTextarea = screen.getByPlaceholderText(/请粘贴岗位描述/);

    await userEvent.type(resumeTextarea, 'My resume');
    await userEvent.type(jdTextarea, 'Job description');

    const analyzeBtn = screen.getByText('分析适配');
    expect(analyzeBtn).not.toBeDisabled();
  });

  it('should reset all fields on reset click', async () => {
    renderPage();

    const resumeTextarea = screen.getByPlaceholderText(/请粘贴你的简历内容/);
    const jdTextarea = screen.getByPlaceholderText(/请粘贴岗位描述/);

    await userEvent.type(resumeTextarea, 'My resume');
    await userEvent.type(jdTextarea, 'Job description');

    const resetBtn = screen.getByText('重置');
    await userEvent.click(resetBtn);

    expect(resumeTextarea).toHaveValue('');
    expect(jdTextarea).toHaveValue('');
  });

  it('should render JDInput with jdImage and onImageChange props', () => {
    renderPage();
    expect(screen.getByText('上传 JD 截图')).toBeInTheDocument();
  });

  it('should render AnalysisResult component', () => {
    renderPage();
    expect(screen.getByTestId('analysis-result')).toBeInTheDocument();
  });
});