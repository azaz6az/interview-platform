import {
  TECH_KEYWORDS,
  SOFT_SKILL_KEYWORDS,
  DATA_KEYWORDS,
  EXPERIENCE_KEYWORDS,
  getAllKeywords,
} from './keywords';

/**
 * keywordExtractor.js - 关键词提取模块
 * 从 JD 和简历文本中提取关键词
 */

/**
 * 在文本中查找匹配的关键词
 * @param {string} text - 待分析的文本
 * @param {string[]} keywordList - 关键词列表
 * @returns {string[]} 匹配到的关键词（去重）
 */
function findMatches(text, keywordList) {
  const lowerText = text.toLowerCase();
  const matched = new Set();

  for (const keyword of keywordList) {
    // 对英文关键词做大小写不敏感匹配
    const lowerKeyword = keyword.toLowerCase();
    if (lowerText.includes(lowerKeyword)) {
      matched.add(keyword);
    }
  }

  return [...matched];
}

/**
 * 从 JD 文本中提取关键词
 * @param {string} jdText - JD 文本
 * @returns {Object} { techKeywords, softSkillKeywords, dataKeywords, experienceKeywords, allKeywords }
 */
export function extractJDKeywords(jdText) {
  const techKeywords = findMatches(jdText, TECH_KEYWORDS);
  const softSkillKeywords = findMatches(jdText, SOFT_SKILL_KEYWORDS);
  const dataKeywords = findMatches(jdText, DATA_KEYWORDS);
  const experienceKeywords = findMatches(jdText, EXPERIENCE_KEYWORDS);

  const allKeywords = [
    ...new Set([
      ...techKeywords,
      ...softSkillKeywords,
      ...dataKeywords,
      ...experienceKeywords,
    ]),
  ];

  return {
    techKeywords,
    softSkillKeywords,
    dataKeywords,
    experienceKeywords,
    allKeywords,
  };
}

/**
 * 从简历文本中提取关键词
 * @param {string} resumeText - 简历文本
 * @returns {Object} { techKeywords, softSkillKeywords, dataKeywords, experienceKeywords, allKeywords }
 */
export function extractResumeKeywords(resumeText) {
  const techKeywords = findMatches(resumeText, TECH_KEYWORDS);
  const softSkillKeywords = findMatches(resumeText, SOFT_SKILL_KEYWORDS);
  const dataKeywords = findMatches(resumeText, DATA_KEYWORDS);
  const experienceKeywords = findMatches(resumeText, EXPERIENCE_KEYWORDS);

  const allKeywords = [
    ...new Set([
      ...techKeywords,
      ...softSkillKeywords,
      ...dataKeywords,
      ...experienceKeywords,
    ]),
  ];

  return {
    techKeywords,
    softSkillKeywords,
    dataKeywords,
    experienceKeywords,
    allKeywords,
  };
}

/**
 * 找出 JD 中有但简历中缺失的关键词
 * @param {string[]} jdKeywords - JD 关键词列表
 * @param {string[]} resumeKeywords - 简历关键词列表
 * @returns {string[]} 缺失的关键词
 */
export function findMissingKeywords(jdKeywords, resumeKeywords) {
  const resumeSet = new Set(resumeKeywords.map((k) => k.toLowerCase()));
  return jdKeywords.filter((k) => !resumeSet.has(k.toLowerCase()));
}

/**
 * 找出简历中已有的关键词（与 JD 匹配的）
 * @param {string[]} jdKeywords - JD 关键词列表
 * @param {string[]} resumeKeywords - 简历关键词列表
 * @returns {string[]} 已匹配的关键词
 */
export function findMatchedKeywords(jdKeywords, resumeKeywords) {
  const resumeSet = new Set(resumeKeywords.map((k) => k.toLowerCase()));
  return jdKeywords.filter((k) => resumeSet.has(k.toLowerCase()));
}

/**
 * 从文本中提取行级内容（用于措辞分析）
 * @param {string} text - 文本
 * @returns {string[]} 非空行数组
 */
export function extractLines(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/**
 * 提取 JD 中的职责描述部分
 * @param {string} jdText - JD 完整文本
 * @returns {string[]} 职责描述行
 */
export function extractResponsibilities(jdText) {
  const lines = extractLines(jdText);
  const responsibilityIndicators = [
    '职责', '负责', '工作内容', '岗位要求', '任职要求',
    '要求', '资格', '条件', '你需要', '你将',
  ];
  const result = [];
  let inResponsibility = false;

  for (const line of lines) {
    const isHeader = responsibilityIndicators.some(
      (ind) => line.includes(ind) && (line.endsWith('：') || line.endsWith(':') || line.length < 15)
    );

    if (isHeader) {
      inResponsibility = true;
      continue;
    }

    if (inResponsibility && (line.startsWith('-') || line.startsWith('•') || /^\d+[.)]/.test(line))) {
      result.push(line.replace(/^[-•\d.)\s]+/, '').trim());
    } else if (inResponsibility && line.length > 5) {
      result.push(line);
    }

    // 如果遇到另一个标题段（如"福利待遇"），停止
    if (inResponsibility && (line.includes('福利') || line.includes('薪资') || line.includes('待遇'))) {
      inResponsibility = false;
    }
  }

  return result.length > 0 ? result : lines.slice(0, 10);
}
