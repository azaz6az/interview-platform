import { extractJDKeywords, extractResumeKeywords } from './keywordExtractor';
import { calculateMatchScore, getMatchDetails } from './matcher';
import { generateAllSuggestions } from './suggestionGenerator';

/**
 * analyzer.js - 核心分析引擎
 * 整合关键词提取、匹配度计算、建议生成三大模块
 */

/**
 * 分析简历与 JD 的匹配度并生成修改建议
 * @param {string} resumeText - 简历原文
 * @param {string} jdText - JD 原文
 * @returns {Object} 分析结果 { score, breakdown, jdKeywords, resumeKeywords, matchDetails, suggestions, modifiedResume }
 */
export function analyzeResume(resumeText, jdText) {
  const jdKeywords = extractJDKeywords(jdText);
  const resumeKeywords = extractResumeKeywords(resumeText);
  const scoreResult = calculateMatchScore(jdKeywords, resumeKeywords);
  const matchDetails = getMatchDetails(jdKeywords, resumeKeywords);
  const { suggestions, modifiedResume } = generateAllSuggestions(
    resumeText, jdText, jdKeywords, resumeKeywords, matchDetails, scoreResult
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
