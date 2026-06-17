/**
 * followUpStrategy.js - 追问策略模块
 * 根据用户回答质量和当前轮次智能生成追问或换题
 */
import { generateQuestionSync } from './questionGenerator';
import { evaluateAnswer } from './answerEvaluator';

/**
 * 追问模板库（按类型分组）
 */
const PROBING_QUESTIONS = {
  /** 深入展开类 — 回答过于简短时使用 */
  deep: [
    '能否更详细展开说说？你提到了关键点，但我想听更多细节。',
    '你能再具体描述一下这个过程吗？中间有哪些关键节点？',
    '这部分很有意思，能否从你的角度再深入分析一下？',
  ],
  /** 数据量化类 — 回答缺乏具体数据时使用 */
  data: [
    '你能否用具体数据来量化这个成果？比如提升了多少百分比、覆盖了多少用户？',
    '有没有可以衡量的具体指标？比如效率、成本、时间等方面的变化？',
    '能分享一些具体的数字吗？比如规模、产出、增长等？',
  ],
  /** 反思总结类 — 缺少 STAR 结构或结果描述时使用 */
  reflection: [
    '在这个过程中，你具体负责了哪些工作？遇到了什么挑战？',
    '如果重新来过，你会做哪些不同的选择？为什么？',
    '从这段经历中，你学到了什么？对你后续的工作有什么启发？',
  ],
  /** 挑战应对类 — 需要了解更多解决问题能力时使用 */
  challenge: [
    '这个过程中最大的挑战是什么？你是怎么解决的？',
    '遇到困难时，你是如何说服团队或协调资源来推进的？',
    '当时有哪些备选方案？你为什么最终选择了这个方案？',
  ],
};

/**
 * 获取某类别的随机追问
 * @param {string} type - 模板类型 key
 * @returns {string}
 */
function getRandomProbe(type) {
  const pool = PROBING_QUESTIONS[type];
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * 获取任意类别的随机追问
 * @returns {string}
 */
function getRandomProbeAny() {
  const types = Object.keys(PROBING_QUESTIONS);
  const type = types[Math.floor(Math.random() * types.length)];
  return getRandomProbe(type);
}

/**
 * 获取追问或下一题
 * @param {string} answer - 用户回答
 * @param {number} round - 当前轮次
 * @param {string} positionId - 岗位方向 ID
 * @param {number[]} [shuffledIndices] - 洗牌索引（避免重复）
 * @returns {string} 追问或新问题
 */
export function getFollowUp(answer, round, positionId, shuffledIndices) {
  if (!answer || answer.trim().length === 0) {
    return generateQuestionSync(positionId, round + 1, shuffledIndices);
  }

  const trimmed = answer.trim();

  // 检测"不知道/不会/不清楚"类回答 → 直接换题
  const iDontKnow = /不知道|不清楚|不会|不太懂|没了解|没经验|没做过|不了解|说不出来|不知道怎么|想不出来|不太清楚|不太了解|没想过|不好说|说不好|什么都没说|不好意思/.test(trimmed);
  if (iDontKnow || trimmed.length < 15) {
    return generateQuestionSync(positionId, round + 1, shuffledIndices);
  }

  // 评估回答质量
  const { quality, logic } = evaluateAnswer(answer, positionId);

  const lacksData = !/\d+%|\d+人|\d+次|\d+个|\d+万|\d+亿|\d+元|\d+\.\d+|\d+倍|增长\d|提升\d|降低\d|节省\d|超过\d|达到\d/.test(answer);

  const hasSituation = /当时|那时候|背景|项目中|公司|团队面临|面临.*情况|在.*阶段/.test(answer);
  const hasTask = /负责|目标是|需要|任务|职责|要求|期望|解决.*问题/.test(answer);
  const hasAction = /我.*(采取|实施|推动|设计|开发|优化|引入|搭建|制定|执行|带领|主导)/.test(answer);
  const hasResult = /结果|效果|成果|最终|成功|提升|改善|完成|实现|达到|获得|节省|增长|下降/.test(answer);
  const starHitCount = [hasSituation, hasTask, hasAction, hasResult].filter(Boolean).length;
  const lacksSTAR = starHitCount < 2;

  if (round >= 5) {
    return generateQuestionSync(positionId, round + 1, shuffledIndices);
  }

  if (quality >= 4 && logic >= 4) {
    return generateQuestionSync(positionId, round + 1, shuffledIndices);
  }

  if (quality < 2.5) {
    return generateQuestionSync(positionId, round + 1, shuffledIndices);
  }

  if (lacksData) return getRandomProbe('data');
  if (lacksSTAR) return getRandomProbe('reflection');

  if (Math.random() < 0.6) {
    if (quality < 3.5) return getRandomProbe('deep');
    if (logic < 3.5) return getRandomProbe('challenge');
    return getRandomProbeAny();
  }

  return generateQuestionSync(positionId, round + 1, shuffledIndices);
}
