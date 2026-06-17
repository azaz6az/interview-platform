/**
 * trendCalculator.js - 趋势计算模块
 * 计算复盘感受评分的时间趋势
 */

/**
 * 计算感受评分趋势数据
 * @param {Array} entries - 复盘条目数组，按时间倒序
 * @returns {Array} [{ date, avgScore, count }] 按日期正序
 */
export function calculateTrend(entries) {
  if (!entries || entries.length === 0) return [];

  // 按日期分组
  const dateMap = {};

  for (const entry of entries) {
    const date = entry.date
      ? new Date(entry.date).toISOString().split('T')[0]
      : '未知日期';

    if (!dateMap[date]) {
      dateMap[date] = { scores: [], count: 0 };
    }
    dateMap[date].scores.push(entry.feeling || 3);
    dateMap[date].count += 1;
  }

  // 转为数组并排序
  const trend = Object.entries(dateMap)
    .map(([date, data]) => ({
      date,
      avgScore: Math.round(
        (data.scores.reduce((a, b) => a + b, 0) / data.scores.length) * 10
      ) / 10,
      count: data.count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return trend;
}

/**
 * 计算总体统计
 * @param {Array} entries - 复盘条目数组
 * @returns {Object} { totalEntries, avgScore, bestCategory, worstCategory }
 */
export function calculateStats(entries) {
  if (!entries || entries.length === 0) {
    return { totalEntries: 0, avgScore: 0, bestCategory: null, worstCategory: null };
  }

  const totalEntries = entries.length;
  const avgScore =
    Math.round(
      (entries.reduce((sum, e) => sum + (e.feeling || 3), 0) / totalEntries) * 10
    ) / 10;

  // 按分类统计
  const categoryMap = {};
  for (const entry of entries) {
    const cat = entry.category || '通用';
    if (!categoryMap[cat]) categoryMap[cat] = { scores: [], count: 0 };
    categoryMap[cat].scores.push(entry.feeling || 3);
    categoryMap[cat].count += 1;
  }

  let bestCategory = null;
  let worstCategory = null;
  let bestAvg = 0;
  let worstAvg = 6;

  for (const [cat, data] of Object.entries(categoryMap)) {
    const avg = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
    if (avg > bestAvg) {
      bestAvg = avg;
      bestCategory = cat;
    }
    if (avg < worstAvg) {
      worstAvg = avg;
      worstCategory = cat;
    }
  }

  return { totalEntries, avgScore, bestCategory, worstCategory };
}
