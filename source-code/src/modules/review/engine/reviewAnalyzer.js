/**
 * reviewAnalyzer.js - 复盘薄弱环节分析引擎
 * 从复盘条目中提取 Top 3 薄弱环节并推荐练习题
 */
import questionsData from '../../question-bank/data/questions.json';

/**
 * 分析薄弱环节
 * @param {Array} entries - 复盘条目数组
 * @returns {Array} Top 3 薄弱环节 [{ category, avgScore, count, recommendedQuestions }]
 */
export function analyzeWeaknesses(entries) {
  if (!entries || entries.length === 0) return [];

  // 按面试类型+题目分类聚合
  const categoryMap = {};

  for (const entry of entries) {
    const key = `${entry.interviewType || '未分类'}-${entry.category || '通用'}`;
    if (!categoryMap[key]) {
      categoryMap[key] = {
        category: entry.category || '通用',
        interviewType: entry.interviewType || '未分类',
        scores: [],
        questionIds: [],
      };
    }
    categoryMap[key].scores.push(entry.feeling || 3);
    if (entry.questionId) categoryMap[key].questionIds.push(entry.questionId);
  }

  // 计算各类平均分并排序
  const categories = Object.values(categoryMap).map((cat) => ({
    category: cat.category,
    interviewType: cat.interviewType,
    avgScore: cat.scores.reduce((a, b) => a + b, 0) / cat.scores.length,
    count: cat.scores.length,
  }));

  // 按平均分升序排列（越低越薄弱）
  categories.sort((a, b) => a.avgScore - b.avgScore);

  // 取 Top 3 薄弱环节，推荐练习题
  const top3 = categories.slice(0, 3).map((cat) => {
    const recommended = questionsData
      .filter((q) => q.category === cat.category || q.position === cat.interviewType)
      .slice(0, 3);

    return {
      ...cat,
      recommendedQuestions: recommended,
    };
  });

  return top3;
}

/**
 * 获取薄弱环节对应的推荐题目
 * @param {Object} weakness - 薄弱环节对象
 * @returns {Array} 推荐题目数组
 */
export function getRecommendedQuestions(weakness) {
  return questionsData
    .filter(
      (q) =>
        q.category === weakness.category ||
        q.position === weakness.interviewType
    )
    .slice(0, 3);
}
