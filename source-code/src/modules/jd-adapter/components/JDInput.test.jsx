/**
 * JDInput.jsx 组件测试
 * 测试 JD 截图上传和文本粘贴功能
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import JDInput from './JDInput';

describe('JDInput', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
    onAnalyze: vi.fn(),
    isAnalyzing: false,
    jdImage: null,
    onImageChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===== 基础渲染 =====
  it('should render the component with title', () => {
    render(<JDInput {...defaultProps} />);
    expect(screen.getByText('Step 2：粘贴岗位描述')).toBeInTheDocument();
  });

  it('should render upload area when no image is uploaded', () => {
    render(<JDInput {...defaultProps} />);
    expect(screen.getByText('上传 JD 截图')).toBeInTheDocument();
    expect(screen.getByText(/支持 PNG、JPG 格式/)).toBeInTheDocument();
  });

  it('should render the text field for manual paste', () => {
    render(<JDInput {...defaultProps} />);
    expect(screen.getByPlaceholderText(/请粘贴岗位描述/)).toBeInTheDocument();
  });

  it('should display character count', () => {
    render(<JDInput {...defaultProps} value="Hello" />);
    expect(screen.getByText('5 字')).toBeInTheDocument();
  });

  // ===== 图片类型校验 =====
  it('should show error for unsupported image type (.gif)', async () => {
    render(<JDInput {...defaultProps} />);

    // GIF file: MIME type is image/gif, extension is .gif
    const badFile = new File(['content'], 'image.gif', { type: 'image/gif' });
    const fileInput = document.querySelector('input[type="file"]');

    // Use fireEvent.change instead of userEvent.upload because
    // userEvent.upload may filter by the accept attribute on the input
    fireEvent.change(fileInput, { target: { files: [badFile] } });

    await waitFor(() => {
      expect(screen.getByText(/不支持的图片格式/)).toBeInTheDocument();
    });
  });

  it('should show error for file exceeding 5MB size limit', async () => {
    render(<JDInput {...defaultProps} />);
    const largeFile = new File(['x'.repeat(100)], 'large.png', { type: 'image/png' });
    Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 });
    const fileInput = document.querySelector('input[type="file"]');

    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    await waitFor(() => {
      expect(screen.getByText(/图片文件过大/)).toBeInTheDocument();
    });
  });

  // ===== 图片上传 =====
  it('should call onImageChange with base64 data on valid PNG upload', async () => {
    const onImageChange = vi.fn();
    render(<JDInput {...defaultProps} onImageChange={onImageChange} />);

    const file = new File(['content'], 'jd.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]');

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(onImageChange).toHaveBeenCalled();
      expect(onImageChange.mock.calls[0][0]).toMatch(/^data:image\/png;base64,/);
    });
  });

  it('should call onImageChange with base64 data on valid JPG upload', async () => {
    const onImageChange = vi.fn();
    render(<JDInput {...defaultProps} onImageChange={onImageChange} />);

    const file = new File(['content'], 'jd.jpg', { type: 'image/jpeg' });
    const fileInput = document.querySelector('input[type="file"]');

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(onImageChange).toHaveBeenCalled();
    });
  });

  it('should show image error on FileReader failure', async () => {
    render(<JDInput {...defaultProps} />);

    const file = new File(['content'], 'jd.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]');

    // Mock FileReader to simulate error
    const originalFileReader = globalThis.FileReader;
    globalThis.FileReader = class {
      readAsDataURL() {
        setTimeout(() => {
          if (this.onerror) this.onerror(new Event('error'));
        }, 0);
      }
    };

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/图片读取失败/)).toBeInTheDocument();
    });

    globalThis.FileReader = originalFileReader;
  });

  // ===== 图片预览 =====
  it('should show image preview when jdImage is provided', () => {
    render(<JDInput {...defaultProps} jdImage="data:image/png;base64,abc" />);

    expect(screen.getByAltText('JD 截图预览')).toBeInTheDocument();
    expect(screen.getByText('请根据截图内容，将关键信息粘贴到下方文本框')).toBeInTheDocument();
  });

  it('should not show upload area when image is uploaded', () => {
    render(<JDInput {...defaultProps} jdImage="data:image/png;base64,abc" />);

    expect(screen.queryByText('上传 JD 截图')).not.toBeInTheDocument();
  });

  // ===== 放大查看 Dialog =====
  it('should open preview dialog on zoom click', async () => {
    render(<JDInput {...defaultProps} jdImage="data:image/png;base64,abc" />);

    const zoomBtn = screen.getByLabelText('放大查看');
    await userEvent.click(zoomBtn);

    expect(screen.getByText('JD 截图预览')).toBeInTheDocument();
    expect(screen.getByAltText('JD 截图大图')).toBeInTheDocument();
  });

  it('should close preview dialog on close button click', async () => {
    render(<JDInput {...defaultProps} jdImage="data:image/png;base64,abc" />);

    const zoomBtn = screen.getByLabelText('放大查看');
    await userEvent.click(zoomBtn);
    expect(screen.getByText('JD 截图预览')).toBeInTheDocument();

    // Find the close button inside the dialog
    const closeBtn = screen.getByRole('button', { name: /关闭/i });
    await userEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByText('JD 截图预览')).not.toBeInTheDocument();
    });
  });

  // ===== 删除图片 =====
  it('should call onImageChange(null) on delete click', async () => {
    const onImageChange = vi.fn();
    render(<JDInput {...defaultProps} jdImage="data:image/png;base64,abc" onImageChange={onImageChange} />);

    const deleteBtn = screen.getByLabelText('删除图片');
    await userEvent.click(deleteBtn);

    expect(onImageChange).toHaveBeenCalledWith(null);
  });

  // ===== 拖拽事件 =====
  it('should handle drag over event', () => {
    render(<JDInput {...defaultProps} />);
    const uploadArea = screen.getByText('上传 JD 截图').closest('div');

    fireEvent.dragOver(uploadArea, { dataTransfer: { files: [] } });

    expect(screen.getByText('松开即可上传')).toBeInTheDocument();
  });

  it('should handle drag leave event', () => {
    render(<JDInput {...defaultProps} />);
    const uploadArea = screen.getByText('上传 JD 截图').closest('div');

    fireEvent.dragOver(uploadArea, { dataTransfer: { files: [] } });
    fireEvent.dragLeave(uploadArea);

    expect(screen.getByText('上传 JD 截图')).toBeInTheDocument();
  });

  it('should handle image file drop', async () => {
    const onImageChange = vi.fn();
    render(<JDInput {...defaultProps} onImageChange={onImageChange} />);

    const file = new File(['content'], 'jd.png', { type: 'image/png' });
    const uploadArea = screen.getByText('上传 JD 截图').closest('div');

    const dropEvent = new Event('drop', { bubbles: true });
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: { files: [file] },
    });

    fireEvent(uploadArea, dropEvent);

    await waitFor(() => {
      expect(onImageChange).toHaveBeenCalled();
    });
  });

  // ===== 提示文案 =====
  it('should display hint text when image is uploaded', () => {
    render(<JDInput {...defaultProps} jdImage="data:image/png;base64,abc" />);

    expect(screen.getByText('请根据截图内容，将关键信息粘贴到下方文本框')).toBeInTheDocument();
  });

  // ===== 文本粘贴功能 =====
  it('should allow manual text input', async () => {
    const onChange = vi.fn();
    render(<JDInput {...defaultProps} onChange={onChange} />);

    const textarea = screen.getByPlaceholderText(/请粘贴岗位描述/);
    await userEvent.type(textarea, 'JD text');

    expect(onChange).toHaveBeenCalled();
  });

  // ===== 错误提示可关闭 =====
  it('should allow closing error alert', async () => {
    render(<JDInput {...defaultProps} />);

    const badFile = new File(['content'], 'image.gif', { type: 'image/gif' });
    const fileInput = document.querySelector('input[type="file"]');

    fireEvent.change(fileInput, { target: { files: [badFile] } });

    await waitFor(() => {
      expect(screen.getByText(/不支持的图片格式/)).toBeInTheDocument();
    });

    // Close the error alert
    const closeBtn = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeBtn);

    expect(screen.queryByText(/不支持的图片格式/)).not.toBeInTheDocument();
  });

  // ===== input accept 属性 =====
  it('should set correct accept attribute on file input', () => {
    render(<JDInput {...defaultProps} />);
    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toHaveAttribute('accept', '.png,.jpg,.jpeg');
  });
});
