/**
 * fileParser.js 单元测试
 * 测试 PDF/DOCX 文件解析功能
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock pdfjs-dist - use factory function to avoid hoisting issues
vi.mock('pdfjs-dist', () => {
  const mockGetPage = vi.fn();
  const mockGetDocument = vi.fn(() => ({
    promise: Promise.resolve({
      numPages: 1,
      getPage: mockGetPage,
    }),
  }));

  return {
    GlobalWorkerOptions: { workerSrc: '' },
    version: '4.0.379',
    getDocument: mockGetDocument,
    // Export mockGetPage for direct access in tests
    __mockGetPage: mockGetPage,
    __mockGetDocument: mockGetDocument,
  };
});

// Mock mammoth
vi.mock('mammoth', () => ({
  default: {
    extractRawText: vi.fn(() => Promise.resolve({ value: 'DOCX content' })),
  },
}));

// Import after mocks
import {
  parseResumeFile,
  isFileTypeSupported,
  getAcceptedFileTypesString,
  formatFileSize,
} from './fileParser';

// Get mock references from the mocked module
const pdfjsMock = await import('pdfjs-dist');
const mockGetPage = pdfjsMock.__mockGetPage;
const mockGetDocument = pdfjsMock.__mockGetDocument;
const mammothMock = await import('mammoth');
const mockExtractRawText = mammothMock.default.extractRawText;

describe('fileParser.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===== getAcceptedFileTypesString =====
  describe('getAcceptedFileTypesString', () => {
    it('should return accept string for PDF and DOCX', () => {
      const result = getAcceptedFileTypesString();
      expect(result).toContain('.pdf');
      expect(result).toContain('.docx');
    });

    it('should return comma-separated extensions', () => {
      const result = getAcceptedFileTypesString();
      expect(result).toMatch(/^\.\w+,\.\w+$/);
    });
  });

  // ===== isFileTypeSupported =====
  describe('isFileTypeSupported', () => {
    it('should accept PDF file by MIME type', () => {
      const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });
      expect(isFileTypeSupported(file)).toBe(true);
    });

    it('should accept DOCX file by MIME type', () => {
      const file = new File(['content'], 'resume.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      expect(isFileTypeSupported(file)).toBe(true);
    });

    it('should accept PDF file by extension when MIME type is empty', () => {
      const file = new File(['content'], 'resume.pdf', { type: '' });
      expect(isFileTypeSupported(file)).toBe(true);
    });

    it('should accept DOCX file by extension when MIME type is empty', () => {
      const file = new File(['content'], 'resume.docx', { type: '' });
      expect(isFileTypeSupported(file)).toBe(true);
    });

    it('should reject unsupported file types (e.g., .txt)', () => {
      const file = new File(['content'], 'resume.txt', { type: 'text/plain' });
      expect(isFileTypeSupported(file)).toBe(false);
    });

    it('should reject unsupported file types (e.g., .doc)', () => {
      const file = new File(['content'], 'resume.doc', { type: 'application/msword' });
      expect(isFileTypeSupported(file)).toBe(false);
    });

    it('should reject files with no extension', () => {
      const file = new File(['content'], 'resume', { type: '' });
      expect(isFileTypeSupported(file)).toBe(false);
    });

    it('should handle case-insensitive extensions', () => {
      const file = new File(['content'], 'resume.PDF', { type: '' });
      expect(isFileTypeSupported(file)).toBe(true);
    });
  });

  // ===== formatFileSize =====
  describe('formatFileSize', () => {
    it('should format 0 bytes', () => {
      expect(formatFileSize(0)).toBe('0 B');
    });

    it('should format bytes (less than 1 KB)', () => {
      expect(formatFileSize(512)).toBe('512 B');
    });

    it('should format kilobytes', () => {
      expect(formatFileSize(1024)).toBe('1.0 KB');
    });

    it('should format megabytes', () => {
      expect(formatFileSize(1048576)).toBe('1.0 MB');
    });

    it('should format fractional sizes with one decimal', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB');
    });

    it('should format large file sizes', () => {
      expect(formatFileSize(5242880)).toBe('5.0 MB');
    });
  });

  // ===== parseResumeFile =====
  describe('parseResumeFile', () => {
    it('should reject unsupported file types', async () => {
      const file = new File(['content'], 'resume.txt', { type: 'text/plain' });
      await expect(parseResumeFile(file)).rejects.toThrow('不支持的文件格式');
    });

    it('should parse PDF file successfully', async () => {
      const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });

      // Override mockGetDocument for 2-page PDF
      mockGetDocument.mockImplementationOnce(() => ({
        promise: Promise.resolve({
          numPages: 2,
          getPage: mockGetPage,
        }),
      }));

      mockGetPage.mockResolvedValueOnce({
        getTextContent: () => Promise.resolve({ items: [{ str: 'Page 1 content' }] }),
      });
      mockGetPage.mockResolvedValueOnce({
        getTextContent: () => Promise.resolve({ items: [{ str: 'Page 2 content' }] }),
      });

      const result = await parseResumeFile(file);
      expect(result).toContain('Page 1 content');
      expect(result).toContain('Page 2 content');
      expect(mockGetDocument).toHaveBeenCalled();
    });

    it('should parse DOCX file successfully', async () => {
      const file = new File(['content'], 'resume.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      mockExtractRawText.mockResolvedValueOnce({ value: 'DOCX content here' });

      const result = await parseResumeFile(file);
      expect(result).toBe('DOCX content here');
      expect(mockExtractRawText).toHaveBeenCalled();
    });

    it('should parse PDF by extension when MIME type is missing', async () => {
      const file = new File(['content'], 'resume.pdf', { type: '' });

      mockGetPage.mockResolvedValueOnce({
        getTextContent: () => Promise.resolve({ items: [{ str: 'PDF text' }] }),
      });

      const result = await parseResumeFile(file);
      expect(result).toContain('PDF text');
    });

    it('should parse DOCX by extension when MIME type is missing', async () => {
      const file = new File(['content'], 'resume.docx', { type: '' });

      mockExtractRawText.mockResolvedValueOnce({ value: 'DOCX fallback text' });

      const result = await parseResumeFile(file);
      expect(result).toBe('DOCX fallback text');
    });

    it('should join multi-page PDF text with double newline', async () => {
      const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });

      // Override mockGetDocument for 2-page PDF
      mockGetDocument.mockImplementationOnce(() => ({
        promise: Promise.resolve({
          numPages: 2,
          getPage: mockGetPage,
        }),
      }));

      mockGetPage.mockResolvedValueOnce({
        getTextContent: () => Promise.resolve({ items: [{ str: 'First page' }] }),
      });
      mockGetPage.mockResolvedValueOnce({
        getTextContent: () => Promise.resolve({ items: [{ str: 'Second page' }] }),
      });

      const result = await parseResumeFile(file);
      expect(result).toBe('First page\n\nSecond page');
    });

    it('should skip empty pages in PDF', async () => {
      const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });

      // Override mockGetDocument for 2-page PDF
      mockGetDocument.mockImplementationOnce(() => ({
        promise: Promise.resolve({
          numPages: 2,
          getPage: mockGetPage,
        }),
      }));

      mockGetPage.mockResolvedValueOnce({
        getTextContent: () => Promise.resolve({ items: [{ str: 'Content' }] }),
      });
      mockGetPage.mockResolvedValueOnce({
        getTextContent: () => Promise.resolve({ items: [{ str: '   ' }] }),
      });

      const result = await parseResumeFile(file);
      expect(result).toBe('Content');
    });

    it('should trim DOCX extracted text', async () => {
      const file = new File(['content'], 'resume.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      mockExtractRawText.mockResolvedValueOnce({ value: '  trimmed content  ' });

      const result = await parseResumeFile(file);
      expect(result).toBe('trimmed content');
    });

    it('should wrap parsing errors with friendly message', async () => {
      const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });

      mockGetDocument.mockImplementationOnce(() => ({
        promise: Promise.reject(new Error('Invalid PDF structure')),
      }));

      await expect(parseResumeFile(file)).rejects.toThrow('文件解析失败');
    });

    it('should handle PDF with multiple text items per page', async () => {
      const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' });

      mockGetPage.mockResolvedValueOnce({
        getTextContent: () => Promise.resolve({
          items: [{ str: 'Hello' }, { str: 'World' }],
        }),
      });

      const result = await parseResumeFile(file);
      expect(result).toBe('Hello World');
    });
  });
});