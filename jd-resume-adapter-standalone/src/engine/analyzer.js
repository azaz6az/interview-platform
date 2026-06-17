import { extractJDKeywords, extractResumeKeywords } from './keywordExtractor';
import { calculateMatchScore, getMatchDetails } from './matcher';
import { generateAllSuggestions } from './suggestionGenerator';

/**
 * analyzer.js - 核心分析引擎
 * 整合关键词提取、匹配度计算、建议生成三大模块
 */

/**
 * 分析简历与 JD 的匹配度并生成修改建议（同步版本）
 * @param {string} resumeText - 简历原文
 * @param {string} jdText - JD 原文
 * @returns {Object} 分析结果 { score, breakdown, jdKeywords, resumeKeywords, matchDetails, suggestions, modifiedResume }
 */
export function analyzeResume(resumeText, jdText) {
  // Step 1: 提取关键词
  const jdKeywords = extractJDKeywords(jdText);
  const resumeKeywords = extractResumeKeywords(resumeText);

  // Step 2: 计算匹配度
  const scoreResult = calculateMatchScore(jdKeywords, resumeKeywords);

  // Step 3: 获取匹配详情
  const matchDetails = getMatchDetails(jdKeywords, resumeKeywords);

  // Step 4: 生成修改建议
  const { suggestions, modifiedResume } = generateAllSuggestions(
    resumeText,
    jdText,
    jdKeywords,
    resumeKeywords,
    matchDetails,
    scoreResult
  );

  return {
    score: scoreResult.score,
    breakdown: scoreResult.breakdown,
    jdKeywords,
    resumeKeywords,
    matchDetails,
    suggestions,
    modifiedResume,
  };
}

/**
 * 异步 AI 分析接口（预留，方便未来接入真实 AI API）
 * 当前使用内置分析引擎模拟
 * @param {string} resumeText - 简历原文
 * @param {string} jdText - JD 原文
 * @returns {Promise<Object>} 分析结果
 */
export async function analyzeWithAI(resumeText, jdText) {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 当前使用本地分析引擎
  // 未来可替换为真实 API 调用，例如：
  // const response = await fetch('/api/analyze', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ resume: resumeText, jd: jdText }),
  // });
  // return response.json();

  return analyzeResume(resumeText, jdText);
}
