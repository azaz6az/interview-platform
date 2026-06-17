# 面试平台 (Interview Platform)

一站式面试准备平台，集 JD 分析、AI 模拟面试、题库练习、复盘日记于一体。

## ✨ 功能亮点

| 模块 | 功能 |
|------|------|
| 📄 JD-简历适配 | 上传简历 + JD 截图 → AI 匹配度分析 + 优化建议 |
| 🤖 AI 模拟面试 | 选择岗位 → 多轮对话 → 评分反馈 |
| 🎤 语音输入 | 点击麦克风 → 语音转文字 (Web Speech API) |
| 📚 题库练习 | 100+ 题目，按岗位/难度分类 |
| 📝 复盘日记 | 记录面试感受 → 薄弱项分析 → 趋势图表 |
| 📊 数据看板 | 首页快捷入口 + 薄弱项提醒 |

## 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/azaz6az/interview-platform.git
cd interview-platform

# 进入源码目录
cd source-code

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:5173

**Windows 用户**：直接双击 `start-dev.bat` 一键启动

## 🛠️ 技术栈

- **前端框架**: React 18 + Vite 5
- **UI 组件**: MUI v5 + Tailwind CSS
- **路由管理**: React Router v6
- **状态管理**: React Context + useReducer
- **图表**: Recharts
- **文件解析**: pdfjs-dist + mammoth

## 📁 项目结构

```
interview-platform/
├── source-code/              # 主平台源码
│   └── src/
│       ├── modules/          # 功能模块
│       │   ├── jd-adapter/   # JD-简历适配
│       │   ├── mock-interview/ # 模拟面试
│       │   ├── question-bank/  # 题库
│       │   └── review/       # 复盘日记
│       ├── pages/            # 页面组件
│       ├── layouts/          # 布局组件
│       └── contexts/         # 状态管理
├── dist/                     # 生产构建
├── documents/                # 项目文档
└── jd-resume-adapter-standalone/ # 独立版 JD 适配器
```

## 📖 文档

- [产品需求文档](documents/interview-platform-prd.md)
- [系统架构文档](documents/interview-platform-architecture.md)

## 📱 响应式设计

- **桌面端** (≥960px): 左侧边栏导航
- **移动端** (<960px): 底部标签栏导航

## 💡 语音输入提示

推荐使用 **Chrome** 浏览器获得最佳语音识别体验。

## 📄 License

MIT
