/**
 * ocrEngine.js - 图片文字识别引擎
 * 使用 Tesseract.js 进行客户端 OCR，支持中英文
 */
import { createWorker } from 'tesseract.js';

/**
 * 从图片中提取文字
 * @param {string|Blob|File} imageSource - 图片源（base64 URL、Blob 或 File）
 * @param {Function} onProgress - 进度回调 (progress: 0-1)
 * @returns {Promise<string>} 提取的文字
 */
export async function extractTextFromImage(imageSource, onProgress) {
  const worker = await createWorker('chi_sim+eng', 1, {
    logger: (m) => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(m.progress || 0);
      }
    },
  });

  try {
    const { data: { text } } = await worker.recognize(imageSource);
    return text.trim();
  } finally {
    await worker.terminate();
  }
}
