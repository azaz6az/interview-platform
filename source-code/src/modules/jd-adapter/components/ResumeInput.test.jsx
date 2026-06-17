/**
 * ResumeInput.jsx 组件测试
 * 测试简历上传和文本粘贴功能
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResumeInput from './ResumeInput';

// Mock fileParser
vi.mock('../engine/fileParser', () => ({
  parseResumeFile: vi.fn(),
  getAcceptedFileTypesString: vi.fn(() => '.pdf,.docx'),
  formatFileSize: vi.fn((bytes) => `${(bytes / 1024).toFixed(1)} KB`),
}));

import { parseResumeFile, getAcceptedFileTypesString, formatFileSize } from '../engine/fileParser';

describe('ResumeInput', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
    onAnalyze: vi.fn(),
    isAnalyzing: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===== 基础渲染 =====
  it('should render the component with title', () => {
    render(<ResumeInput {...defaultProps} />);
    expect(screen.getByText('Step 1：粘贴简历')).toBeInTheDocument();
  });

  it('should render the upload area when no file is uploaded', () => {
    render(<ResumeInput {...defaultProps} />);
    expect(screen.getByText('拖拽或点击上传简历文件')).toBeInTheDocument();
    expect(screen.getByText('支持 PDF、DOCX 格式')).toBeInTheDocument();
  });

  it('should render the text field for manual paste', () => {
    render(<ResumeInput {...defaultProps} />);
    expect(screen.getByPlaceholderText(/请粘贴你的简历内容/)).toBeInTheDocument();
  });

  it('should display character count', () => {
    render(<ResumeInput {...defaultProps} value="Hello" />);
    expect(screen.getByText('5 字')).toBeInTheDocument();
  });

  // ===== 文件类型校验 =====
  it('should show error for unsupported file type (.txt)', async () => {
    render(<ResumeInput {...defaultProps} />);

    const badFile = new File(['content'], 'resume.txt', { type: 'text/plain' });
    const fileInput = document.querySelector('input[type="file"]');

    // Use fireEvent.change since userEvent.upload may filter by accept attr
    fireEvent.change(fileInput, { target: { files: [badFile] } });

    await waitFor(() => {
      expect(screen.getByText(/不支持的文件格式/)).toBeInTheDocument();
    });
  });

  it('should show error for unsupported file type (.doc)', async () => {
    render(<ResumeInput {...defaultProps} />);

    const badFile = new File(['content'], 'resume.doc', { type: 'application/msword' });
    const fileInput = document.querySelector('input[type="file"]');

    fireEvent.change(fileInput, { target: { files: [badFile] } });

    await waitFor(() => {
      expect(screen.getByText(/不支持的文件格式/)).toBeInTheDocument();
    });
  });

  // ===== 文件上传解析 =====
  it('should call parseResumeFile for valid PDF file', async () => {
    parseResumeFile.mockResolvedValueOnce('Extracted PDF content');
    render(<ResumeInput {...defaultProps} />);

    const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
    const fileInput = document.querySelector('input[type="file"]');

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(parseResumeFile).toHaveBeenCalledWith(file);
    });
  });

  it('should call onChange with extracted text on successful parse', async () => {
    parseResumeFile.mockResolvedValueOnce('Extracted PDF content');
    const onChange = vi.fn();
    render(<ResumeInput {...defaultProps} onChange={onChange} />);

    const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
    const fileInput = document.querySelector('input[type="file"]');

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith('Extracted PDF content');
    });
  });

  it('should show error when extracted text is empty', async () => {
    parseResumeFile.mockResolvedValueOnce('   ');
    render(<ResumeInput {...defaultProps} />);

    const file = new File(['content'], 'empty.pdf', { type: 'application/pdf' });
    const fileInput = document.querySelector('input[type="file"]');

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/文件内容为空/)).toBeInTheDocument();
    });
  });

  it('should show error when parsing fails', async () => {
    parseResumeFile.mockRejectedValueOnce(new Error('解析失败：文件损坏'));
    render(<ResumeInput {...defaultProps} />);

    const file = new File(['content'], 'broken.pdf', { type: 'application/pdf' });
    const fileInput = document.querySelector('input[type="file"]');

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/解析失败/)).toBeInTheDocument();
    });
  });

  // ===== 删除按钮 =====
  it('should display file info and delete button after successful upload', async () => {
    parseResumeFile.mockResolvedValueOnce('Content');
    render(<ResumeInput {...defaultProps} />);

    const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
    const fileInput = document.querySelector('input[type="file"]');

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('resume.pdf')).toBeInTheDocument();
      expect(screen.getByLabelText('删除已上传文件')).toBeInTheDocument();
    });
  });

  it('should clear uploaded file info on delete click', async () => {
    parseResumeFile.mockResolvedValueOnce('Content');
    render(<ResumeInput {...defaultProps} />);

    const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
    const fileInput = document.querySelector('input[type="file"]');

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('resume.pdf')).toBeInTheDocument();
    });

    const deleteBtn = screen.getByLabelText('删除已上传文件');
    await userEvent.click(deleteBtn);

    expect(screen.getByText('拖拽或点击上传简历文件')).toBeInTheDocument();
  });

  // ===== 拖拽事件 =====
  it('should handle drag over event', () => {
    render(<ResumeInput {...defaultProps} />);
    const uploadArea = screen.getByText('拖拽或点击上传简历文件').closest('div');

    fireEvent.dragOver(uploadArea, { dataTransfer: { files: [] } });

    expect(screen.getByText('松开即可上传')).toBeInTheDocument();
  });

  it('should handle drag leave event', () => {
    render(<ResumeInput {...defaultProps} />);
    const uploadArea = screen.getByText('拖拽或点击上传简历文件').closest('div');

    fireEvent.dragOver(uploadArea, { dataTransfer: { files: [] } });
    expect(screen.getByText('松开即可上传')).toBeInTheDocument();

    fireEvent.dragLeave(uploadArea);
    expect(screen.getByText('拖拽或点击上传简历文件')).toBeInTheDocument();
  });

  it('should handle file drop', async () => {
    parseResumeFile.mockResolvedValueOnce('Dropped content');
    render(<ResumeInput {...defaultProps} />);

    const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
    const uploadArea = screen.getByText('拖拽或点击上传简历文件').closest('div');

    const dropEvent = new Event('drop', { bubbles: true });
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: { files: [file] },
    });

    fireEvent(uploadArea, dropEvent);

    await waitFor(() => {
      expect(parseResumeFile).toHaveBeenCalled();
    });
  });

  // ===== 文本粘贴功能 =====
  it('should allow manual text input', async () => {
    const onChange = vi.fn();
    render(<ResumeInput {...defaultProps} onChange={onChange} />);

    const textarea = screen.getByPlaceholderText(/请粘贴你的简历内容/);
    await userEvent.type(textarea, 'Manual resume text');

    expect(onChange).toHaveBeenCalled();
  });

  it('should preserve text after file upload error', async () => {
    parseResumeFile.mockRejectedValueOnce(new Error('Parse failed'));
    render(<ResumeInput {...defaultProps} value="Existing text" />);

    const file = new File(['content'], 'bad.pdf', { type: 'application/pdf' });
    const fileInput = document.querySelector('input[type="file"]');

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      // The original value should still be visible
      expect(screen.getByDisplayValue('Existing text')).toBeInTheDocument();
    });
  });

  // ===== 错误提示可关闭 =====
  it('should allow closing error alert', async () => {
    parseResumeFile.mockRejectedValueOnce(new Error('Parse failed'));
    render(<ResumeInput {...defaultProps} />);

    const file = new File(['content'], 'broken.pdf', { type: 'application/pdf' });
    const fileInput = document.querySelector('input[type="file"]');

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/Parse failed/)).toBeInTheDocument();
    });

    // Click close button on the Alert
    const closeBtn = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeBtn);

    expect(screen.queryByText(/Parse failed/)).not.toBeInTheDocument();
  });
});
