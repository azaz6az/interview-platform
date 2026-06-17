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


