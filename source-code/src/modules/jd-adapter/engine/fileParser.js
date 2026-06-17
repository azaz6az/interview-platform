/**
 * fileParser.js - PDF/DOCX 文件解析封装模块
 * 负责将上传的简历文件提取为纯文本内容
 */
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

/** 配置 PDF.js Worker（本地打包，不依赖 CDN） */
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

/** 支持的文件类型映射 */
const ACCEPTED_FILE_TYPES = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
};

/** 文件类型扩展名映射 */
const EXTENSION_MAP = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

/**
 * 获取支持的文件类型 Accept 字符串
 */
export function getAcceptedFileTypesString() {
  return Object.keys(EXTENSION_MAP).map((ext) => `.${ext}`).join(',');
}

/**
 * 检测文件类型是否受支持
 */
export function isFileTypeSupported(file) {
  if (ACCEPTED_FILE_TYPES[file.type]) return true;
  const ext = file.name.split('.').pop().toLowerCase();
  return EXTENSION_MAP[ext] !== undefined;
}

/**
 * 解析 PDF 文件
 */
async function parsePdf(arrayBuffer) {
  const pdfDocument = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdfDocument.numPages;
  const textParts = [];

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await pdfDocument.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item) => item.str).join(' ');
    if (pageText.trim()) textParts.push(pageText.trim());
  }

  return textParts.join('\n\n');
}

/**
 * 解析 DOCX 文件
 */
async function parseDocx(arrayBuffer) {
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
}

/**
 * 解析上传的简历文件
 */
export async function parseResumeFile(file) {
  if (!isFileTypeSupported(file)) {
    throw new Error(`不支持的文件格式：${file.name}。仅支持 PDF 和 DOCX 格式。`);
  }

  const arrayBuffer = await file.arrayBuffer();

  let fileType = ACCEPTED_FILE_TYPES[file.type];
  if (!fileType) {
    const ext = file.name.split('.').pop().toLowerCase();
    fileType = ext;
  }

  try {
    if (fileType === 'pdf') {
      return await parsePdf(arrayBuffer);
    } else if (fileType === 'docx') {
      return await parseDocx(arrayBuffer);
    } else {
      throw new Error(`无法识别的文件类型：${fileType}`);
    }
  } catch (error) {
    throw new Error(`文件解析失败：${error.message}。请检查文件是否损坏，或直接粘贴简历文本。`);
  }
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = bytes / Math.pow(k, i);
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}
