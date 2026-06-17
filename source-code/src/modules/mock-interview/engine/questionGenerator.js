/**
 * questionGenerator.js - 面试问题生成器
 * 预留 AI 接口，当前使用规则匹配生成问题
 */

/** 各岗位方向的基础问题库 */
const POSITION_QUESTIONS = {
  'data-analysis': [
    '请介绍一下你做过的数据分析项目，使用了哪些工具和方法？',
    '如何处理数据中的缺失值和异常值？',
    '你如何从业务角度理解一个数据指标的含义？',
    '请解释一下 A/B 测试的原理和注意事项。',
    '如果让你搭建一个数据看板监控业务，你会怎么做？',
    '描述一下 SQL 中 JOIN 的几种类型及其区别。',
    '你如何评估一个数据分析模型的准确性？',
    '请举例说明你如何通过数据发现业务问题并提出改进建议。',
  ],
  'product-ops': [
    '请介绍一款你最常用的产品，分析它的优缺点。',
    '如何衡量一个产品功能是否成功？',
    '你会如何策划一次用户增长活动？',
    '描述一下用户画像的构建方法和应用场景。',
    '如何通过运营手段提升用户留存率？',
    '请解释漏斗分析的原理，以及如何优化各环节转化率。',
    '你在做产品运营时，最关注哪些核心指标？',
    '如何平衡用户需求和商业目标？',
  ],
  'business-analysis': [
    '请描述商业分析的基本流程和方法论。',
    '如何通过数据发现商业机会？请举例说明。',
    '你如何理解指标体系的建设？',
    '请解释 RFM 模型的原理及应用。',
    '如何做竞品分析？你关注哪些维度？',
    '如果你发现某个业务指标突然下降，你会怎么排查？',
    '请描述你对商业智能（BI）的理解。',
    '如何将业务需求转化为数据需求？',
  ],
  'data-engineering': [
    '请解释 ETL 的流程和你在项目中是如何实现的。',
    '你了解哪些数据仓库建模方法？请举例说明。',
    '如何保证数据管道的数据质量？',
    '描述一下你对数据湖和数据仓库的理解和区别。',
    '你使用过哪些大数据处理框架？请分享你的经验。',
    '如何设计一个高可用的数据流处理系统？',
    '请解释 Spark 和 Flink 的区别及各自适用场景。',
    '你如何优化一个慢查询的 SQL？',
  ],
  'management-trainee': [
    '请做一个简短的自我介绍，突出你的领导力经历。',
    '描述一次你带领团队解决困难的经历。',
    '你如何处理团队中的意见分歧？',
    '你对快速变化的商业环境有什么理解和应对策略？',
    '请分享你从失败中学到的重要一课。',
    '你如何制定一个团队目标并推动执行？',
    '描述一次跨部门协作的经历和你的角色。',
    '你认为自己最大的优势和需要改进的地方是什么？',
  ],
};

/** 通用追问模板 */
const FOLLOW_UP_TEMPLATES = [
  '能否再详细说说其中的具体细节？',
  '你在这个过程中遇到了什么挑战？是如何解决的？',
  '如果让你重新做一次，你会有什么不同的做法？',
  '你能用数据来量化这个成果吗？',
  '这个项目中最关键的决策点是什么？',
  '你在这个经历中学到了什么？',
];

/**
 * 生成面试问题（async 预留 AI 接口）
 * @param {string} positionId - 岗位方向 ID
 * @param {number} round - 当前轮次
 * @param {string|null} previousAnswer - 上一轮用户回答
 * @returns {Promise<string>} 面试问题
 */
export async function generateQuestion(positionId, round, previousAnswer) {
  // 当前使用规则匹配，未来可替换为 AI API
  await new Promise((r) => setTimeout(r, 300));

  const questions = POSITION_QUESTIONS[positionId] || POSITION_QUESTIONS['data-analysis'];
  const idx = (round - 1) % questions.length;
  return questions[idx];
}

/**
 * 同步版本
 */
export function generateQuestionSync(positionId, round) {
  const questions = POSITION_QUESTIONS[positionId] || POSITION_QUESTIONS['data-analysis'];
  const idx = (round - 1) % questions.length;
  return questions[idx];
}
