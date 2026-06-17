import { findMissingKeywords, findMatchedKeywords } from './keywordExtractor';

/**
 * suggestionGenerator.js - 修改建议生成模块
 * 根据匹配分析结果生成具体的简历修改建议
 */

/**
 * 生成关键词补充建议
 */
function generateKeywordSuggestions(missingKeywords) {
  if (missingKeywords.length === 0) return [];
  const suggestions = [];
  const groups = [];
  for (let i = 0; i < missingKeywords.length; i += 4) {
    groups.push(missingKeywords.slice(i, i + 4));
  }
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    const isFirst = i === 0;
    suggestions.push({
      type: 'keyword',
      title: isFirst ? '补充关键技能关键词' : `补充更多关键技能 (${i + 1})`,
      description: `JD 中要求但你的简历中未提及：${group.join('、')}。建议在技能或经历部分补充这些关键词。`,
      suggested: `建议在简历中添加：${group.join('、')}`,
    });
  }
  return suggestions;
}

/**
 * 生成措辞调整建议
 */
function generatePhrasingSuggestions(resumeText, jdText, matchedKeywords) {
  const suggestions = [];
  const phrasingMap = [
    { from: /做过|搞过|弄过/g, to: '负责', reason: '使用更专业的动词表述' },
    { from: /帮了|协助了/g, to: '协助', reason: '更简洁准确的措辞' },
    { from: /学会了|了解了/g, to: '掌握', reason: '体现更高掌握程度' },
    { from: /参与了/g, to: '参与', reason: '去掉"了"使表述更简洁' },
    { from: /做数据分析/g, to: '开展数据分析', reason: '更专业的数据工作表述' },
    { from: /写代码|写程序/g, to: '开发', reason: '使用更正式的表述' },
    { from: /用了.+技术/g, to: null, reason: '建议将"用了XX技术"改为"基于XX技术实现"' },
  ];

  let phrasingFound = false;
  for (const mapping of phrasingMap) {
    if (mapping.from.test(resumeText)) {
      phrasingFound = true;
      if (mapping.to) {
        const originalSnippet = findFirstMatch(resumeText, mapping.from);
        suggestions.push({
          type: 'phrasing',
          title: '优化表述措辞',
          description: mapping.reason,
          original: originalSnippet,
          suggested: originalSnippet ? originalSnippet.replace(mapping.from, mapping.to) : mapping.to,
        });
      } else {
        suggestions.push({
          type: 'phrasing',
          title: '优化表述措辞',
          description: mapping.reason,
        });
      }
      mapping.from.lastIndex = 0;
    }
  }

  if (!phrasingFound && matchedKeywords.length > 0) {
    suggestions.push({
      type: 'phrasing',
      title: '对齐 JD 用语',
      description: `你已具备 ${matchedKeywords.slice(0, 3).join('、')} 等技能，建议在描述经历时尽量使用 JD 中的原文用词，提高关键词命中。`,
    });
  }
  return suggestions;
}

/**
 * 生成经历优先级调整建议
 */
function generatePrioritySuggestions(resumeText, matchedKeywords, missingKeywords) {
  const suggestions = [];
  const lines = resumeText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

  const keywordLineIndices = [];
  for (let i = 0; i < lines.length; i++) {
    const hasKeyword = matchedKeywords.some((kw) =>
      lines[i].toLowerCase().includes(kw.toLowerCase())
    );
    if (hasKeyword) keywordLineIndices.push(i);
  }

  if (keywordLineIndices.length > 0) {
    const midpoint = Math.floor(lines.length / 2);
    const lateLines = keywordLineIndices.filter((idx) => idx > midpoint);
    if (lateLines.length > 0) {
      suggestions.push({
        type: 'priority',
        title: '前置相关经历',
        description: '部分与 JD 高度匹配的经历描述位于简历后半部分，建议将其调整到更显眼的位置，让HR第一时间看到你的匹配点。',
      });
    }
  }

  if (missingKeywords.length > 3) {
    suggestions.push({
      type: 'priority',
      title: '增加技能清单段落',
      description: `简历缺少 ${missingKeywords.length} 个 JD 关键词，建议在简历顶部增加"核心技能"段落，集中展示匹配的技能关键词。`,
      suggested: `核心技能：${missingKeywords.slice(0, 8).join('、')}`,
    });
  }
  return suggestions;
}

/**
 * 生成技能匹配建议
 */
function generateSkillSuggestions(matchDetails, scoreBreakdown) {
  const suggestions = [];

  if (matchDetails.tech.missing.length > 0) {
    suggestions.push({
      type: 'skill',
      title: '技术技能补全',
      description: `JD 要求的技术技能中，你还缺少 ${matchDetails.tech.missing.join('、')}。如果你确实掌握这些技能，请在简历中明确标注；如未掌握，建议优先学习并体现在简历中。`,
    });
  }

  if (matchDetails.data.missing.length > 0) {
    const missingData = matchDetails.data.missing.slice(0, 5).join('、');
    suggestions.push({
      type: 'skill',
      title: '数据能力强化',
      description: `JD 强调的数据方向能力中，你的简历未体现：${missingData}。作为大数据管理与应用专业学生，这是你的核心优势方向，建议突出展示。`,
    });
  }

  if (scoreBreakdown.softSkill < 50 && matchDetails.softSkill.missing.length > 0) {
    suggestions.push({
      type: 'skill',
      title: '软技能补充',
      description: `JD 重视 ${matchDetails.softSkill.missing.slice(0, 3).join('、')} 等软技能。在经历描述中加入相关体现，例如"协调跨部门团队完成XX项目"来体现团队协作能力。`,
    });
  }
  return suggestions;
}

/**
 * 生成修改后的简历
 */
function generateModifiedResume(resumeText, missingKeywords, suggestions) {
  let modified = resumeText;

  if (missingKeywords.length > 0) {
    const topMissing = missingKeywords.slice(0, 6);
    modified += '\n\n--- 以下为建议补充的技能关键词 ---\n';
    modified += `核心技能：${topMissing.join('、')}\n`;
    modified += '（请根据实际情况删减你不掌握的技能）\n';
  }

  const replacements = [
    [/做过/g, '负责'],
    [/搞过/g, '负责'],
    [/学会了/g, '掌握'],
    [/了解了/g, '熟悉'],
    [/做数据分析/g, '开展数据分析'],
  ];

  for (const [pattern, replacement] of replacements) {
    modified = modified.replace(pattern, replacement);
  }

  modified += '\n\n--- JD 匹配优化建议 ---\n';
  for (const s of suggestions.slice(0, 5)) {
    modified += `• [${s.type === 'keyword' ? '关键词' : s.type === 'phrasing' ? '措辞' : s.type === 'priority' ? '优先级' : '技能'}] ${s.title}：${s.description.substring(0, 60)}...\n`;
  }

  return modified;
}

/** 找到正则的第一个匹配 */
function findFirstMatch(text, pattern) {
  const clone = new RegExp(pattern.source, pattern.flags);
  const match = clone.exec(text);
  return match ? match[0] : null;
}

/**
 * 主入口：生成所有修改建议
 */
export function generateAllSuggestions(
  resumeText,
  jdText,
  jdKeywords,
  resumeKeywords,
  matchDetails,
  scoreResult
) {
  const missingKeywords = findMissingKeywords(jdKeywords.allKeywords, resumeKeywords.allKeywords);
  const matchedKeywords = findMatchedKeywords(jdKeywords.allKeywords, resumeKeywords.allKeywords);

  const suggestions = [
    ...generateKeywordSuggestions(missingKeywords),
    ...generatePhrasingSuggestions(resumeText, jdText, matchedKeywords),
    ...generatePrioritySuggestions(resumeText, matchedKeywords, missingKeywords),
    ...generateSkillSuggestions(matchDetails, scoreResult.breakdown),
  ];

  const modifiedResume = generateModifiedResume(resumeText, missingKeywords, suggestions);

  return { suggestions, modifiedResume };
}
