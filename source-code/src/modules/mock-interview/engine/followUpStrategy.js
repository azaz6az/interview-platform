/**
 * followUpStrategy.js - 追问策略模块
 * 根据用户回答和当前轮次生成追问
 */
import { generateQuestionSync } from './questionGenerator';

/** 追问模板 */
const PROBING_QUESTIONS = [
  '你能更详细地展开说一下这部分吗？',
  '你在这个项目中具体负责了哪些工作？',
  '能否举一个具体的例子来说明？',
  '这个过程中最大的挑战是什么？你是怎么解决的？',
  '结果如何？有没有可以量化的数据？',
  '如果重新来过，你会做哪些不同的选择？',
];

/**
 * 获取追问或下一题
 * @param {string} answer - 用户回答
 * @param {number} round - 当前轮次
 * @param {string} positionId - 岗位方向 ID
 * @returns {string} 追问或新问题
 */
export function getFollowUp(answer, round, positionId) {
  // 前2轮倾向于追问深入，后续轮次换新题
  if (round <= 2 && answer && answer.trim().length > 30) {
    // 50% 概率追问，50% 换新题
    const shouldProbe = Math.random() > 0.5;
    if (shouldProbe) {
      const idx = Math.floor(Math.random() * PROBING_QUESTIONS.length);
      return PROBING_QUESTIONS[idx];
    }
  }

  // 换一道新题
  return generateQuestionSync(positionId, round + 1);
}
