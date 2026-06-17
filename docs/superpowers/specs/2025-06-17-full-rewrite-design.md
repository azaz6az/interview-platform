# 面面俱到 — 全面改造规格说明

## 概述

对现有大学生面试备战平台进行 23 项改造，覆盖核心逻辑增强、死代码清理、Bug 修复、新功能添加、质量保障。

## 阶段一：清理 + Bug 修复（11 项）

### 1.1 删除死代码

| 文件/符号 | 操作 |
|-----------|------|
| `src/modules/mock-interview/engine/interviewEngine.js` | 删除整个文件 |
| `questionGenerator.js` 中 `FOLLOW_UP_TEMPLATES` | 删除未使用的常量 |
| `analyzer.js` 中 `analyzeWithAI` | 删除未使用的函数 |
| `trendCalculator.js` 中 `calculateStats` | 删除未使用的函数 |
| `questionSearch.js` 中 `countByPosition` / `countByDifficulty` | 删除未使用的函数 |
| `src/shared/hooks/useLocalStorage.js` | 删除整个文件 |
| `src/shared/hooks/useMediaQuery.js` | 删除整个文件 |

### 1.2 移除未使用的 Tailwind CSS

- `index.css`：删除 `@tailwind base; @tailwind components; @tailwind utilities;`
- 删除 `tailwind.config.js` 和 `postcss.config.js`
- 从 `package.json` 移除 `tailwindcss`、`autoprefixer`、`postcss` 依赖

### 1.3 修复 calculateEvaluation 竞态条件

**当前问题**：`state.records` 在 dispatch 后不会立即更新，导致 localStorage 数据可能重复。

**修复方案**：用 `useRef` 追踪最新 records，或直接从 localStorage 加载最新数据。

```js
// MockInterviewContext.jsx:186-188
// 修复前：const updatedRecords = [...state.records, record];
// 修复后：
const latestRecords = loadInterviewRecords() || [];
const updatedRecords = [...latestRecords, record];
```

### 1.4 修复 submitAnswer 闭包陷阱

**当前问题**：`submitAnswer` 的 `useCallback` 依赖 `[state.currentRound, state.position]`，await 600ms 后这些值可能已过时。

**修复方案**：用 `useRef` 追踪最新 state。

```js
const stateRef = useRef(state);
useEffect(() => { stateRef.current = state; }, [state]);

// submitAnswer 中用 stateRef.current 替代 state
```

### 1.5 修复 JD 截图 localStorage 静默失败

**当前问题**：5MB 图片 → ~6.7MB base64 → 超过 localStorage 5MB 限制 → 静默失败。

**修复方案**：`saveToStorage` 返回成功/失败布尔值，`saveJDImage` 捕获失败后通过 Snackbar 提示用户。

### 1.6 添加 Error Boundary

- 创建 `src/shared/ErrorBoundary.jsx`：React 错误边界组件，显示友好的 fallback UI + "返回首页"按钮
- 在 `router/index.jsx` 的 `<AppShell />` 外层包裹 `<ErrorBoundary>`

---

## 阶段二：模拟面试核心逻辑增强（4 项）

### 2.1 重写 answerEvaluator.js

**当前**：纯靠长度打分，400字=满分5分。

**新评估算法**：

| 维度 | 权重 | 评估方法 |
|------|------|----------|
| 回答质量 | 0.4 | 长度基准(保留) + 关键词密度(行业术语匹配) + 数据量化检测 + STAR结构检测 |
| 逻辑性 | 0.3 | 结构化标记(保留) + 因果关系检测 + 分点论述检测 + 逻辑连接词密度 |
| 表达清晰度 | 0.3 | 句子完整度(保留) + 段落结构 + 重复率检测 + 专业术语使用 |

**STAR 结构检测**：检测回答中是否包含「情境(Situation)→任务(Task)→行动(Action)→结果(Result)」的要素。

**行业术语匹配**：根据 `positionId` 匹配对应岗位的专业术语库（从题库中提取）。

**改进上限**：不再让 400 字自动得满分，长度只贡献最多 3.5 分，剩余分数靠内容质量获取。

### 2.2 重写 followUpStrategy.js

**当前**：50% 随机追问/换题，追问从模板随机选。

**新策略**：

```
if (回答长度 < 50字) → 追问"能否更详细展开"（鼓励补充）
if (回答缺少数据) → 追问"能否用数据量化这个成果"
if (回答缺少STAR结构) → 追问"你具体负责了哪些工作"（引导Task/Action）
if (回答质量 >= 4 && 逻辑 >= 4) → 换新题（已经回答得很好）
if (轮次 >= 5) → 换新题（后期避免纠缠）
else → 50% 追问(针对性模板) / 50% 换新题
```

### 2.3 扩充题库

每个岗位从 8 题扩充到 20 题，分类如下：

| 岗位 | 技术基础 | SQL/编程 | 统计分析 | 业务分析 | 场景题 | 总计 |
|------|---------|---------|---------|---------|--------|------|
| 数据分析 | 4 | 4 | 4 | 4 | 4 | 20 |
| 产品运营 | 4 | - | - | 4 | 4 | 12 |
| 商业分析 | 4 | - | 4 | 4 | 4 | 16 |
| 数据开发 | 4 | 4 | - | 4 | 4 | 16 |
| 管培生 | - | - | - | 4 | 4 | 8 |

每道题都有详细的参考答案（200-400字），答案来自真实面试场景的常见考察点。

### 2.4 题目随机化

**当前**：`(round - 1) % questions.length` 固定轮转。

**修复**：在面试开始时用 Fisher-Yates 洗牌打乱题目顺序。

```js
export function generateQuestionSync(positionId, round, shuffledIndices) {
  const questions = POSITION_QUESTIONS[positionId] || POSITION_QUESTIONS['data-analysis'];
  const idx = shuffledIndices ? shuffledIndices[(round - 1) % shuffledIndices.length] : (round - 1) % questions.length;
  return questions[idx];
}
```

在 `MockInterviewContext.jsx` 的 `startInterview` 中生成洗牌索引数组存入 state。

---

## 阶段三：复盘模块修复 + 数据功能（4 项）

### 3.1 修复 reviewAnalyzer.js 推荐题库匹配

**当前问题**：用 `entry.category`（如 'data-analysis'）匹配 `q.category`（如 'SQL'），字段不对应。

**修复**：改为用 `q.position === cat.interviewType` 匹配，去掉错误的 `q.category === cat.category` 条件。

### 3.2 新增面试记录回顾

在 `MockInterviewPage` 增加"历史记录"区域（在选择岗位之前显示）：
- 展示所有面试记录列表（日期、岗位、总分）
- 点击可展开查看完整的对话记录 + 评分详情
- 支持删除记录
- 数据来源：`state.records`（已持久化到 localStorage）

新增组件：`src/modules/mock-interview/components/InterviewHistory.jsx`

### 3.3 新增答题计时器

在 `ChatWindow` 中每道 AI 问题显示后开始计时：
- 输入框上方显示"已用时间: 0:45"
- 发送回答后停止计时，将耗时记录到消息对象中
- 面试结束后在评分面板中显示每题耗时

### 3.4 新增参考答案对比

面试结束后，在 FeedbackPanel 中增加"查看参考答案"按钮：
- 从题库中查找对应题目的参考答案
- 以 Dialog 形式展示：左侧用户回答，右侧参考答案
- 需要在 `messages` 中记录每道题的 `questionId`（用于查找参考答案）

---

## 阶段四：体验优化（2 项）

### 4.1 新增导出面试报告

在面试结束页增加"导出报告"按钮：
- 生成文本格式的面试总结（岗位、日期、各维度评分、每轮问答、改进建议）
- 复制到剪贴板 或 下载为 .txt 文件

### 4.2 localStorage 满额统一提示

- `saveToStorage` 返回 `{ success: boolean, error?: string }`
- 所有调用方（`saveJDImage`、`saveInterviewRecords`、`saveReviewEntries` 等）检查返回值
- 失败时通过全局 Snackbar 提示用户"存储空间已满，请清理数据"

---

## 数据结构变更

### messages 数组增加 questionId

```js
// AI 消息增加 questionId 字段
{ role: 'ai', content: '...', timestamp: Date.now(), questionId: 'q015' }
```

### 面试记录增加 shuffledIndices

```js
// state 增加
{ ..., shuffledIndices: [3, 1, 7, 0, 5, 2, 6, 4] }
```

### 消息增加答题耗时

```js
// 用户消息增加 duration 字段
{ role: 'user', content: '...', timestamp: Date.now(), duration: 45 }
```

---

## 测试策略

- 阶段一：运行现有测试，确保删除死代码后全部通过
- 阶段二：为 `answerEvaluator`、`followUpStrategy`、`questionGenerator` 编写单元测试
- 阶段三：为 `reviewAnalyzer` 修复编写测试，为新组件编写集成测试
- 阶段四：手动验证导出功能和 Snackbar 提示

## 文件变更清单

| 操作 | 文件 |
|------|------|
| 删除 | `interviewEngine.js`, `useLocalStorage.js`, `useMediaQuery.js` |
| 删除文件 | `tailwind.config.js`, `postcss.config.js` |
| 重写 | `answerEvaluator.js`, `followUpStrategy.js` |
| 修改 | `questionGenerator.js`, `questions.json`(扩充), `MockInterviewContext.jsx` |
| 修改 | `reviewAnalyzer.js`, `analyzer.js`, `trendCalculator.js`, `questionSearch.js` |
| 修改 | `ChatWindow.jsx`, `MockInterviewPage.jsx`, `FeedbackPanel.jsx` |
| 修改 | `index.css`, `storage.js`, `package.json` |
| 新增 | `ErrorBoundary.jsx`, `InterviewHistory.jsx` |
