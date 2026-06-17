/**
 * interviewEngine.js - 模拟面试主引擎
 * 协调问题生成、回答评估、追问策略
 */
import { generateQuestion } from './questionGenerator';
import { evaluateAnswer } from './answerEvaluator';
import { getFollowUp } from './followUpStrategy';

/**
 * 开始一轮新的模拟面试，生成第一个问题
 * @param {string} positionId - 岗位方向 ID
 * @returns {string} 第一个面试问题
 */
export function startInterviewRound(positionId) {
  return generateQuestion(positionId, 1, null);
}

/**
 * 处理用户回答，返回评估+追问
 * @param {string} answer - 用户回答
 * @param {string} positionId - 岗位方向 ID
 * @param {number} round - 当前轮次
 * @returns {Object} { evaluation, followUp }
 */
export function processAnswer(answer, positionId, round) {
  const evaluation = evaluateAnswer(answer, positionId);
  const followUp = getFollowUp(answer, round, positionId);
  return { evaluation, followUp };
}
