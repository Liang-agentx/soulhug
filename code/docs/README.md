# Buffett AI 交易助手

一句话：**让 AI 帮你看盘、分析、交易**。

---

## 这是什么

一个网页应用。右边跟 AI 聊天，AI 能直接操作交易。

AI 扮演巴菲特，能：
- 查实时价格（BTC、ETH、港股...）
- 分析技术指标（RSI、MACD、均线...）
- 执行买卖（OKX 模拟盘、富途港股模拟盘）
- 持续盯盘（"帮我盯 5 分钟，跌破 6 万提醒我"）

---

## 技术栈

| 层 | 技术 | 说明 |
|----|-----|------|
| 前端 | React + AgentX UI | 对话界面 |
| 后端 | AgentX Runtime | AI 运行时 |
| 工具 | **PromptX** | 角色 + 工具管理 |
| 模型 | Claude API | Anthropic |

**PromptX 是核心**——角色定义、工具代码都通过它管理。

---

## 项目结构

```
├── src/                       # 开发者自定义区 ⭐
│   ├── server.ts              # 服务器配置
│   ├── agent.ts               # AI 智能体配置
│   └── web/                   # 前端界面
│       └── App.tsx            # 主界面组件
│
├── .promptx/resource/         # PromptX 资源目录
│   ├── role/buffett/          # 巴菲特角色
│   └── tool/                  # 工具目录
│       ├── okx-btc/           # OKX 交易
│       ├── okx-analysis/      # 技术分析
│       ├── futu-hk/           # 富途港股
│       └── email-sender/      # 邮件通知
│
└── .env                       # 环境变量
```

---

## 快速开始

```bash
# 1. 安装 PromptX（全局）
npm install -g promptx

# 2. 安装项目依赖
pnpm install

# 3. 配置 API Key
cp .env.example .env
# 编辑 .env，填入 ANTHROPIC_API_KEY

# 4. 启动
pnpm dev:full
```

打开 http://localhost:5173

---

## 文档导航

| 文档 | 内容 |
|------|------|
| [快速开始](./快速开始.md) | 3 步跑起来 |
| [开发者教程](./开发者教程.md) | src/ 目录详解、自定义 UI 和 Agent |
| [工作原理](./工作原理.md) | 架构设计、PromptX MCP 机制 |
| [自定义指南](./自定义.md) | 角色开发、工具开发 |
