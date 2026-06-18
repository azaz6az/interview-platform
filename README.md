# 面面俱到 - 大学生面试备战平台

## 快速开始

### 方式一：一键安装（推荐）

1. 确保已安装 [Node.js](https://nodejs.org)（v18+）
2. 双击 `setup.bat` → 自动安装依赖 + 创建桌面快捷方式
3. 双击桌面 `Interview-Platform` 图标启动

### 方式二：手动启动

```bash
cd source-code
npm install
npm run dev
```

浏览器打开 http://localhost:5173

## 分享给好友

直接把整个项目文件夹发给好友（压缩成 zip 即可），好友只需：

1. 解压
2. 确保安装了 Node.js
3. 双击 `setup.bat`
4. 完成！桌面会出现快捷方式

## 功能

- **JD 简历适配**：上传简历+JD，AI 分析匹配度，给出修改建议
- **AI 模拟面试**：语音/文字面试，AI 实时评估打分+追问
- **面试题库**：100+ 真实面试题，按岗位和难度分类
- **复盘日记**：记录面试经历，分析薄弱环节

## 配置 API（可选）

填入通义千问 API Key 可解锁 AI 增强功能：

1. 获取免费 Key：https://dashscope.console.aliyun.com/apiKey
2. 启动后点击左侧栏底部齿轮图标，填入 Key

| 功能 | 无 API Key | 有 API Key |
|------|-----------|-----------|
| JD 图片识别 | 本地识别（慢） | AI 识别（秒级） |
| 面试评估 | 规则打分 | AI 语义评估 |
| JD 面试 | 固定题库 | AI 生成专属题 |

## 技术栈

React 18 + Vite 5 + MUI v5 + React Router v6 + Recharts + 通义千问 API
# Updated
