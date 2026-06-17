/**
 * answerEvaluator.js - 回答评估模块
 * 评估维度：回答质量(0.4)、逻辑性(0.3)、表达清晰度(0.3)
 * 每个维度 1-5 分
 */

/**
 * 检测回答是否包含数据量化内容
 * @param {string} answer - 用户回答
 * @returns {boolean}
 */
function hasQuantifiedData(answer) {
  return /\d+%|\d+人|\d+次|\d+个|\d+万|\d+亿|\d+元|\d+\.\d+|\d+倍|增长\d|提升\d|降低\d|节省\d|超过\d|达到\d/.test(answer);
}

/**
 * 检测 STAR 结构要素命中数
 * S: 情境（背景），T: 任务（目标），A: 行动（做法），R: 结果（成效）
 * @param {string} answer - 用户回答
 * @returns {number} 命中要素数 0-4
 */
function detectSTAR(answer) {
  let hitCount = 0;

  // 情境 (Situation): 背景描述关键词
  if (/当时|那时候|背景|项目中|公司|团队面临|面临.*情况|在.*阶段/.test(answer)) {
    hitCount++;
  }

  // 任务 (Task): 目标/职责关键词
  if (/负责|目标是|需要|任务|职责|要求|期望|解决.*问题/.test(answer)) {
    hitCount++;
  }

  // 行动 (Action): 具体做法关键词
  if (/我.*(采取|实施|推动|设计|开发|优化|引入|搭建|制定|执行|带领|主导)/.test(answer)) {
    hitCount++;
  }

  // 结果 (Result): 成效关键词
  if (/结果|效果|成果|最终|成功|提升|改善|完成|实现|达到|获得|节省|增长|下降/.test(answer)) {
    hitCount++;
  }

  return hitCount;
}

/**
 * 检测结构化标记（首先/其次/最后、第一/第二/第三 等）
 * @param {string} answer - 用户回答
 * @returns {boolean}
 */
function hasStructureMarkers(answer) {
  return /首先|其次|最后|第一|第二|第三|第四|第五|接下来|然后/.test(answer);
}

/**
 * 检测因果关系表述
 * @param {string} answer - 用户回答
 * @returns {boolean}
 */
function hasCausalRelation(answer) {
  return /因为.*所以|由于.*因此|之所以.*是因为|导致|造成|原因.*是|归功于/.test(answer);
}

/**
 * 检测递进关系表述
 * @param {string} answer - 用户回答
 * @returns {boolean}
 */
function hasProgressiveRelation(answer) {
  return /不仅.*而且|一方面.*另一方面|不但.*还|除了.*还|更重要的是|进一步/.test(answer);
}

/**
 * 检测分点论述（编号列表）
 * @param {string} answer - 用户回答
 * @returns {boolean}
 */
function hasNumberedPoints(answer) {
  return /[1-9]\.\s|①|②|③|④|⑤|⑥|⑦|⑧|⑨|（[一二三四五六七八九]）|[\(（]\d+[）\)]/.test(answer);
}

/**
 * 计算高频重复词比率（排除常见虚词）
 * @param {string} answer - 用户回答
 * @returns {number} 重复率 0-1
 */
function calcRepeatRate(answer) {
  const stopWords = new Set([
    '的', '了', '是', '在', '我', '有', '和', '就', '不', '人',
    '都', '一', '个', '上', '也', '到', '说', '要', '会', '对',
    '这', '那', '着', '被', '从', '而', '还', '与', '把', '让',
    '用', '为', '能', '很', '过', '去', '来', '做', '又', '等',
    '这个', '那个', '我们', '他们', '自己', '可以', '没有', '什么', '比较', '就是',
  ]);

  // 提取 2-4 字词组进行统计
  const words = answer.match(/[\u4e00-\u9fa5]{2,4}/g) || [];
  const filtered = words.filter((w) => !stopWords.has(w));

  if (filtered.length < 3) return 0;

  const freq = {};
  filtered.forEach((w) => {
    freq[w] = (freq[w] || 0) + 1;
  });

  const repeated = Object.values(freq).filter((count) => count >= 3);
  if (repeated.length === 0) return 0;

  const repeatedWords = Object.entries(freq).filter(([, count]) => count >= 3);
  const repeatedCount = repeatedWords.reduce((sum, [, count]) => sum + count, 0);
  return repeatedCount / filtered.length;
}

/**
 * 四舍五入到 0.5
 * @param {number} v
 * @returns {number}
 */
const roundHalf = (v) => Math.round(v * 2) / 2;

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

  const trimmed = answer.trim();
  const len = trimmed.length;

  // ==================== 回答质量 (quality) ====================
  // 长度基准评分，上限 4.5（不再自动满分）
  let quality;
  if (len < 50) quality = 2.5;
  else if (len < 100) quality = 3;
  else if (len < 200) quality = 3.5;
  else if (len < 350) quality = 4;
  else if (len < 500) quality = 4.5;
  else quality = 4.5;

  // 数据量化加分：包含具体数字/百分比/金额 +0.3
  const dataQuantified = hasQuantifiedData(trimmed);
  if (dataQuantified) {
    quality += 0.3;
  }

  // STAR 结构检测：命中 2 个以上要素 +0.3
  const starCount = detectSTAR(trimmed);
  if (starCount >= 2) {
    quality += 0.3;
  }

  quality = Math.min(5, quality);

  // ==================== 逻辑性 (logic) ====================
  let logic = 2.5;

  // 结构化标记：首先/其次/最后、第一/第二/第三 +0.5
  const hasStructure = hasStructureMarkers(trimmed);
  if (hasStructure) logic += 0.5;

  // 因果关系：因为...所以、由于...因此 +0.3
  const hasCausal = hasCausalRelation(trimmed);
  if (hasCausal) logic += 0.3;

  // 递进关系：不仅...而且、一方面...另一方面 +0.2
  const hasProgressive = hasProgressiveRelation(trimmed);
  if (hasProgressive) logic += 0.2;

  // 分点论述：包含编号（1. 2. 3. 或 ①②③）+0.3
  const hasPoints = hasNumberedPoints(trimmed);
  if (hasPoints) logic += 0.3;

  logic = Math.min(5, logic);

  // ==================== 表达清晰度 (clarity) ====================
  let clarity = 2.5;

  // 句子完整度：按句号/问号/感叹号分句
  const sentences = trimmed.split(/[。！？]/).filter((s) => s.trim().length > 0);
  if (sentences.length >= 3) clarity = 3;
  if (sentences.length >= 5) clarity = 3.5;
  if (sentences.length >= 8) clarity = 4;

  // 段落结构：包含换行分段 +0.3
  if (/\n\s*\n|\n(?=[^\n])/.test(trimmed) && trimmed.split(/\n/).length >= 2) {
    clarity += 0.3;
  }

  // 重复率：高频重复词 > 30% 扣 0.5
  const repeatRate = calcRepeatRate(trimmed);
  if (repeatRate > 0.3) {
    clarity -= 0.5;
  }

  clarity = Math.min(5, Math.max(1, clarity));

  // ==================== 四舍五入到 0.5 ====================
  quality = roundHalf(quality);
  logic = roundHalf(logic);
  clarity = roundHalf(clarity);

  // ==================== 反馈生成 ====================
  // 检测是否有换行分段
  const hasLineBreaks = /\n/.test(trimmed);
  // 找出最低维度，生成针对性建议
  const feedback = generateFeedback(quality, logic, clarity, {
    dataQuantified,
    starCount,
    hasStructure,
    hasCausal,
    hasProgressive,
    hasPoints,
    hasLineBreaks,
    sentenceCount: sentences.length,
    repeatRate,
    len,
  });

  return { quality, logic, clarity, feedback };
}

/**
 * 根据各维度得分和检测详情生成针对性反馈
 * @param {number} quality - 质量分
 * @param {number} logic - 逻辑分
 * @param {number} clarity - 清晰度分
 * @param {Object} details - 各项检测详情
 * @returns {string} 反馈文字
 */
function generateFeedback(quality, logic, clarity, details) {
  const { dataQuantified, starCount, hasStructure, hasCausal, hasProgressive, hasPoints, hasLineBreaks, sentenceCount, repeatRate, len } = details;

  const minScore = Math.min(quality, logic, clarity);

  // 各维度都 >= 4 → 整体好评
  if (quality >= 4 && logic >= 4 && clarity >= 4) {
    return '回答整体优秀！内容充实、逻辑清晰、表达流畅，继续保持。';
  }

  // 优先针对最薄弱维度
  if (minScore === quality) {
    // 质量维度最弱
    if (len < 100) {
      return '回答内容偏少，建议展开论述，补充更多具体细节和案例来支撑你的观点。';
    }
    if (!dataQuantified) {
      return '回答缺乏数据支撑，建议加入具体的数字、百分比或量化指标，例如"提升了30%""管理5人团队"等。';
    }
    if (starCount < 2) {
      return '建议用 STAR 法则组织回答：先描述情境和背景，再说明你的任务和目标，接着讲具体行动，最后呈现可衡量的结果。';
    }
    return '回答质量尚可，可以进一步丰富案例细节，让回答更有说服力。';
  }

  if (minScore === logic) {
    // 逻辑维度最弱
    const suggestions = [];
    if (!hasStructure) {
      suggestions.push('使用"首先、其次、最后"等结构化标记来组织论述');
    }
    if (!hasCausal) {
      suggestions.push('用"因为…所以…"等因果连接词说明推理过程');
    }
    if (!hasPoints && !hasStructure) {
      suggestions.push('尝试用编号分点（1. 2. 3.）让论述更有条理');
    }
    if (suggestions.length > 0) {
      return '回答逻辑性有待加强，建议：' + suggestions.join('；') + '。';
    }
    return '回答有一定逻辑性，可以加强段落之间的衔接和递进关系。';
  }

  // clarity 最弱
  const suggestions = [];
  if (sentenceCount < 3) {
    suggestions.push('尽量将回答扩展为至少3个完整的句子，避免过于简短');
  }
  if (repeatRate > 0.3) {
    suggestions.push('减少词语重复，尝试用同义词替换，提升表达多样性');
  }
  // 检测是否有换行分段（段落结构加分未命中时提示）
  if (!hasLineBreaks && len > 200) {
    suggestions.push('较长的回答建议分段书写，每段聚焦一个要点');
  }
  if (suggestions.length > 0) {
    return '表达清晰度可以提升：' + suggestions.join('；') + '。';
  }
  return '表达基本清晰，注意句子的完整性和用词准确性。';
}
