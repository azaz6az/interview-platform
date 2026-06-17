/**
 * fileParser.js - PDF/DOCX 文件解析封装模块
 * 负责将上传的简历文件提取为纯文本内容
 */
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

/** 配置 PDF.js Worker（使用 CDN 加载对应版本的 worker） */
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdfjs/${pdfjsLib.version}/pdf.worker.min.js`;

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
 * 获取支持的文件类型 Accept 字符串（用于 input accept 属性）
 * @returns {string} Accept 字符串，如 ".pdf,.docx"
 */
export function getAcceptedFileTypesString() {
  return Object.keys(EXTENSION_MAP).map((ext) => `.${ext}`).join(',');
}

/**
 * 检测文件类型是否受支持
 * @param {File} file - 上传的文件对象
 * @returns {boolean} 是否支持该文件类型
 */
export function isFileTypeSupported(file) {
  if (ACCEPTED_FILE_TYPES[file.type]) {
    return true;
  }
  // 某些浏览器可能不识别 DOCX 的 MIME type，通过扩展名兜底
  const ext = file.name.split('.').pop().toLowerCase();
  return EXTENSION_MAP[ext] !== undefined;
}

/**
 * 解析 PDF 文件，提取全部页面的文本内容
 * @param {ArrayBuffer} arrayBuffer - PDF 文件的 ArrayBuffer 数据
 * @returns {Promise<string>} 提取的纯文本内容
 */
async function parsePdf(arrayBuffer) {
  const pdfDocument = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdfDocument.numPages;
  const textParts = [];

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await pdfDocument.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => item.str)
      .join(' ');
    if (pageText.trim()) {
      textParts.push(pageText.trim());
    }
  }

  return textParts.join('\n\n');
}

/**
 * 解析 DOCX 文件，提取全部文本内容
 * @param {ArrayBuffer} arrayBuffer - DOCX 文件的 ArrayBuffer 数据
 * @returns {Promise<string>} 提取的纯文本内容
 */
async function parseDocx(arrayBuffer) {
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
}

/**
 * 解析上传的简历文件，自动识别格式并提取文本
 * @param {File} file - 上传的文件对象（PDF 或 DOCX）
 * @returns {Promise<string>} 提取的纯文本内容
 * @throws {Error} 如果文件格式不受支持或解析失败
 */
export async function parseResumeFile(file) {
  // 校验文件类型
  if (!isFileTypeSupported(file)) {
    throw new Error(`不支持的文件格式：${file.name}。仅支持 PDF 和 DOCX 格式。`);
  }

  // 将文件读取为 ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();

  // 根据文件类型选择对应的解析器
  let fileType = ACCEPTED_FILE_TYPES[file.type];
  if (!fileType) {
    // 通过扩展名兜底识别
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
 * 格式化文件大小为人类可读字符串
 * @param {number} bytes - 文件大小（字节）
 * @returns {string} 格式化后的字符串，如 "1.5 MB"
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = bytes / Math.pow(k, i);
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}