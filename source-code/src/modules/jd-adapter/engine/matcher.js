/**
 * matcher.js - 匹配度计算模块
 * 根据关键词匹配情况计算简历与 JD 的匹配度分数
 */

/**
 * 计算总体匹配度分数
 * @param {Object} jdKeywords - JD 提取的关键词
 * @param {Object} resumeKeywords - 简历提取的关键词
 * @returns {Object} { score, breakdown: { tech, softSkill, data, experience } }
 */
export function calculateMatchScore(jdKeywords, resumeKeywords) {
  const weights = {
    tech: 0.4,
    softSkill: 0.2,
    data: 0.3,
    experience: 0.1,
  };

  const techScore = computeCategoryScore(jdKeywords.techKeywords, resumeKeywords.techKeywords);
  const softSkillScore = computeCategoryScore(jdKeywords.softSkillKeywords, resumeKeywords.softSkillKeywords);
  const dataScore = computeCategoryScore(jdKeywords.dataKeywords, resumeKeywords.dataKeywords);
  const experienceScore = computeCategoryScore(jdKeywords.experienceKeywords, resumeKeywords.experienceKeywords);

  let totalWeight = 0;
  let weightedSum = 0;

  const categories = [
    { score: techScore, weight: weights.tech, hasJD: jdKeywords.techKeywords.length > 0 },
    { score: softSkillScore, weight: weights.softSkill, hasJD: jdKeywords.softSkillKeywords.length > 0 },
    { score: dataScore, weight: weights.data, hasJD: jdKeywords.dataKeywords.length > 0 },
    { score: experienceScore, weight: weights.experience, hasJD: jdKeywords.experienceKeywords.length > 0 },
  ];

  for (const cat of categories) {
    if (cat.hasJD) {
      totalWeight += cat.weight;
      weightedSum += cat.score * cat.weight;
    }
  }

  const overallScore = totalWeight > 0
    ? Math.round((weightedSum / totalWeight) * 100)
    : computeCategoryScore(jdKeywords.allKeywords, resumeKeywords.allKeywords) * 100;

  return {
    score: Math.max(0, Math.min(100, overallScore)),
    breakdown: {
      tech: Math.round(techScore * 100),
      softSkill: Math.round(softSkillScore * 100),
      data: Math.round(dataScore * 100),
      experience: Math.round(experienceScore * 100),
    },
  };
}

/**
 * 计算单个类别的匹配率
 * @param {string[]} jdCategory - JD 中该类别的关键词
 * @param {string[]} resumeCategory - 简历中该类别的关键词
 * @returns {number} 0-1 之间的匹配率
 */
function computeCategoryScore(jdCategory, resumeCategory) {
  if (jdCategory.length === 0) return 0;
  const resumeSet = new Set(resumeCategory.map((k) => k.toLowerCase()));
  const matchedCount = jdCategory.filter((k) => resumeSet.has(k.toLowerCase())).length;
  return matchedCount / jdCategory.length;
}

/**
 * 获取各类别匹配详情
 * @param {Object} jdKeywords - JD 提取的关键词
 * @param {Object} resumeKeywords - 简历提取的关键词
 * @returns {Object} 各类别的 { matched, missing } 关键词
 */
export function getMatchDetails(jdKeywords, resumeKeywords) {
  return {
    tech: {
      matched: findIntersection(jdKeywords.techKeywords, resumeKeywords.techKeywords),
      missing: findDifference(jdKeywords.techKeywords, resumeKeywords.techKeywords),
    },
    softSkill: {
      matched: findIntersection(jdKeywords.softSkillKeywords, resumeKeywords.softSkillKeywords),
      missing: findDifference(jdKeywords.softSkillKeywords, resumeKeywords.softSkillKeywords),
    },
    data: {
      matched: findIntersection(jdKeywords.dataKeywords, resumeKeywords.dataKeywords),
      missing: findDifference(jdKeywords.dataKeywords, resumeKeywords.dataKeywords),
    },
    experience: {
      matched: findIntersection(jdKeywords.experienceKeywords, resumeKeywords.experienceKeywords),
      missing: findDifference(jdKeywords.experienceKeywords, resumeKeywords.experienceKeywords),
    },
  };
}

/** 交集（不区分大小写） */
function findIntersection(listA, listB) {
  const setB = new Set(listB.map((k) => k.toLowerCase()));
  return listA.filter((k) => setB.has(k.toLowerCase()));
}

/** 差集（不区分大小写） */
function findDifference(listA, listB) {
  const setB = new Set(listB.map((k) => k.toLowerCase()));
  return listA.filter((k) => !setB.has(k.toLowerCase()));
}
