/**
 * aiService.js - 通义千问 API 服务层
 * 支持：VL 图片文字识别、Chat 面试问答生成
 * 使用 OpenAI 兼容接口：https://dashscope.aliyuncs.com/compatible-mode/v1
 */

const BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1';

/**
 * 调用通义千问 API
 */
async function callApi(apiKey, body) {
  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `API 请求失败 (${response.status})`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

/**
 * 用 VL 模型识别图片中的文字
 * @param {string} apiKey - API Key
 * @param {string} base64Image - base64 编码的图片（含 data:image/... 前缀）
 * @returns {Promise<string>} 提取的文字
 */
export async function extractTextFromImage(apiKey, base64Image) {
  return callApi(apiKey, {
    model: 'qwen-vl-plus',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: base64Image } },
          { type: 'text', text: '请提取这张图片中的所有文字内容，保持原始格式和排版，直接输出文字，不要添加任何解释。' },
        ],
      },
    ],
    max_tokens: 2000,
  });
}

/**
 * 根据 JD 内容生成面试问题
 * @param {string} apiKey - API Key
 * @param {string} jdText - JD 文本
 * @param {number} count - 问题数量
 * @returns {Promise<Array<{question: string, category: string, difficulty: string}>>}
 */
export async function generateInterviewQuestions(apiKey, jdText, count = 10) {
  const prompt = `你是一位资深面试官。根据以下岗位描述（JD），生成 ${count} 道高质量面试题。

要求：
1. 覆盖技术能力、项目经验、行为面试、场景分析四个维度
2. 难度分布：入门 30%、进阶 50%、挑战 20%
3. 每道题都要有参考答案（150-300字）
4. 直接输出 JSON 数组，不要添加其他文字

输出格式：
[{"question": "题目", "category": "技术基础/项目经验/行为面试/场景分析", "difficulty": "easy/medium/hard", "answer": "参考答案"}]

JD 内容：
${jdText}`;

  const result = await callApi(apiKey, {
    model: 'qwen3.5-flash',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 4000,
    temperature: 0.7,
  });

  try {
    // 提取 JSON 部分（可能被 markdown 代码块包裹）
    const jsonMatch = result.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(result);
  } catch {
    throw new Error('AI 返回的格式无法解析，请重试');
  }
}

/**
 * 基于 JD 生成模拟面试追问
 * @param {string} apiKey - API Key
 * @param {string} jdText - JD 文本
 * @param {string} question - 当前面试题
 * @param {string} userAnswer - 用户回答
 * @returns {Promise<{score: number, feedback: string, followUp: string}>}
 */
export async function evaluateAndFollowUp(apiKey, jdText, question, userAnswer) {
  const prompt = `你是一位资深面试官，正在面试以下岗位的候选人。

JD：${jdText}

你问了这个问题：${question}

候选人的回答：${userAnswer}

请评估候选人的回答并给出追问。输出 JSON 格式：
{"score": 1-5, "feedback": "简短评价（50字内）", "followUp": "下一个面试问题"}

评分标准：
- 5分：回答优秀，逻辑清晰，有数据支撑
- 4分：回答良好，基本完整
- 3分：回答一般，需要补充
- 2分：回答较差，缺少关键信息
- 1分：回答很差或答非所问`;

  const result = await callApi(apiKey, {
    model: 'qwen3.5-flash',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 500,
    temperature: 0.6,
  });

  try {
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(result);
  } catch {
    return { score: 3, feedback: '回答中规中矩', followUp: '请继续回答下一个问题' };
  }
}

/**
 * AI 智能简历分析
 * @param {string} apiKey - API Key
 * @param {string} resumeText - 简历文本
 * @param {string} jdText - JD 文本
 * @returns {Promise<{score: number, breakdown: Object, suggestions: Array, modifiedResume: string, jdAnalysis: string, matchAnalysis: string}>}
 */
export async function analyzeResumeWithAI(apiKey, resumeText, jdText) {
  const prompt = `你是一位资深HR和职业顾问。请分析以下简历与岗位描述（JD）的匹配度。

## 岗位描述（JD）
${jdText}

## 简历
${resumeText}

请按以下要求输出 JSON：

1. **score** (0-100): 整体匹配度分数
2. **breakdown**: { tech: 0-100, softSkill: 0-100, data: 0-100, experience: 0-100 } 各维度分数
3. **jdAnalysis**: 对 JD 核心要求的简要分析（100字内），包括必备技能、加分项、软素质
4. **matchAnalysis**: 简历与 JD 的逐条匹配分析（200字内），指出哪些经历匹配、哪些缺失
5. **suggestions**: 具体修改建议数组，每项 { type: "keyword"|"phrasing"|"priority"|"skill", title: "标题", description: "具体建议（100字内）", original?: "原文片段", suggested?: "建议改为" }
6. **modifiedResume**: 基于分析结果优化后的简历全文（保持原有经历，优化措辞和结构以更好匹配 JD，不要编造内容）

要求：
- suggestions 至少 3 条，最多 6 条，每条都要具体可操作
- modifiedResume 要保留简历中的真实经历，只优化表述方式
- 如果简历中已有某些技能但表述不够突出，直接在 modifiedResume 中优化`;

  const result = await callApi(apiKey, {
    model: 'qwen3.5-flash',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 4000,
    temperature: 0.5,
  });

  try {
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        score: parsed.score || 60,
        breakdown: parsed.breakdown || { tech: 60, softSkill: 60, data: 60, experience: 60 },
        suggestions: parsed.suggestions || [],
        modifiedResume: parsed.modifiedResume || resumeText,
        jdAnalysis: parsed.jdAnalysis || '',
        matchAnalysis: parsed.matchAnalysis || '',
      };
    }
    return JSON.parse(result);
  } catch {
    throw new Error('AI 分析结果解析失败，请重试');
  }
}
