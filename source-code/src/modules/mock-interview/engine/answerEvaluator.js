/**
 * answerEvaluator.js - 回答评估模块
 * 评估维度：回答质量(0.4)、逻辑性(0.3)、表达清晰度(0.3)
 * 每个维度 1-5 分
 */

/**
 * 评估用户回答（async 预留 AI 接口）
 * @param {string} answer - 用户回答
 * @param {string} positionId - 岗位方向 ID
 * @returns {Promise<Object>} { quality, logic, clarity, feedback }
 */
export async function evaluateAnswerAsync(answer, positionId) {
  await new Promise((r) => setTimeout(r, 200));
  return evaluateAnswer(answer, positionId);
}

/**
 * 同步评估用户回答
 * @param {string} answer - 用户回答
 * @param {string} positionId - 岗位方向 ID（预留，当前通用评估）
 * @returns {Object} { quality, logic, clarity, feedback }
 */
export function evaluateAnswer(answer, positionId) {
  if (!answer || answer.trim().length === 0) {
    return { quality: 1, logic: 1, clarity: 1, feedback: '回答为空，请提供内容' };
  }

  const len = answer.trim().length;

  // 回答质量评分 — 基于长度和内容丰富度
  let quality = 2;
  if (len >= 30) quality = 3;
  if (len >= 80) quality = 3.5;
  if (len >= 150) quality = 4;
  if (len >= 250) quality = 4.5;
  if (len >= 400) quality = 5;

  // 包含数字/数据加分
  if (/\d+%|\d+人|\d+次|\d+个|\d+万/.test(answer)) {
    quality = Math.min(5, quality + 0.3);
  }

  // 逻辑性评分 — 基于结构化标记
  let logic = 2.5;
  if (/首先|第一|其次|第二|再次|最后/.test(answer)) logic = 3.5;
  if (/因为.*所以|由于.*因此/.test(answer)) logic = Math.min(5, logic + 0.5);
  if (/一方面.*另一方面|不仅.*而且/.test(answer)) logic = Math.min(5, logic + 0.3);
  if (/目标|方法|结果|复盘|总结/.test(answer)) logic = Math.min(5, logic + 0.3);
  if (logic >= 4 && len >= 100) logic = Math.min(5, logic + 0.2);

  // 表达清晰度 — 基于句子完整度和段落
  let clarity = 2.5;
  const sentences = answer.split(/[。！？；]/).filter((s) => s.trim().length > 0);
  if (sentences.length >= 3) clarity = 3;
  if (sentences.length >= 5) clarity = 3.5;
  if (sentences.length >= 8) clarity = 4;
  if (len > 50 && sentences.length >= 4) clarity = Math.min(5, clarity + 0.3);

  // 四舍五入到 0.5
  const roundHalf = (v) => Math.round(v * 2) / 2;
  quality = roundHalf(quality);
  logic = roundHalf(logic);
  clarity = roundHalf(clarity);

  // 生成简要反馈
  let feedback = '';
  if (quality < 3) feedback = '建议增加更多具体内容，使用数据和案例支撑观点';
  else if (logic < 3) feedback = '建议使用 STAR 法则或"首先/其次/最后"等结构化方式组织回答';
  else if (clarity < 3) feedback = '建议将回答分段，使用完整的句子表达观点';
  else feedback = '回答不错，继续保持！可以尝试加入更多数据支撑';

  return { quality, logic, clarity, feedback };
}
