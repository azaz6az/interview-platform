/**
 * questionSearch.js - 题库搜索与筛选引擎
 * 支持关键词搜索、岗位筛选、难度筛选
 */

/**
 * 搜索题目
 * @param {Array} questions - 全部题目数组
 * @param {Object} filters - 筛选条件 { position, difficulty, keyword, favoritesOnly }
 * @param {Array} [favorites=[]] - 收藏的题目 ID 数组
 * @returns {Array} 匹配的题目数组
 */
export function searchQuestions(questions, filters, favorites = []) {
  const { position, difficulty, keyword, favoritesOnly } = filters;

  return questions.filter((q) => {
    // 收藏筛选
    if (favoritesOnly && !favorites.includes(q.id)) return false;
    // 岗位筛选
    if (position && q.position !== position) return false;

    // 难度筛选
    if (difficulty && q.difficulty !== difficulty) return false;

    // 关键词搜索
    if (keyword && keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      const inQuestion = q.question.toLowerCase().includes(kw);
      const inAnswer = q.answer.toLowerCase().includes(kw);
      const inCategory = (q.category || '').toLowerCase().includes(kw);
      if (!inQuestion && !inAnswer && !inCategory) return false;
    }

    return true;
  });
}

/**
 * 按岗位分组统计题目数量
 * @param {Array} questions - 题目数组
 * @returns {Object} { positionId: count }
 */
export function countByPosition(questions) {
  const counts = {};
  for (const q of questions) {
    counts[q.position] = (counts[q.position] || 0) + 1;
  }
  return counts;
}

/**
 * 按难度分组统计题目数量
 * @param {Array} questions - 题目数组
 * @returns {Object} { difficulty: count }
 */
export function countByDifficulty(questions) {
  const counts = {};
  for (const q of questions) {
    counts[q.difficulty] = (counts[q.difficulty] || 0) + 1;
  }
  return counts;
}
