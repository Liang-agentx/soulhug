# SoulHug (心灵拥抱) 🌳

> "理解是爱的另一种表达方式"

SoulHug 是一个专注于亲子关系的情感陪伴智能体。它不仅是一个树洞，更是一座连接两代人内心的桥梁。通过先进的 AI 角色扮演技术，帮助青少年在冲突后"听见"父母心底的声音。

## 🌟 核心逻辑与用户旅程 (Project Logic)

我们的产品不仅仅是对话，而是一场精心设计的情感疗愈之旅：

1.  **倾听与感知 (Listen & Sense)**
    *   用户倾诉烦恼，系统通过 **`analyze_emotion`** 工具实时感知情绪强度，动态调整 UI 氛围（如背景色变暖），让用户感到被"看见"。
2.  **构建画像 (Build Profile)**
    *   在对话中，系统使用 **`save_memory`** 工具自动提取并记录父母的性格特征（如"刀子嘴"、"重视成绩"），构建独一无二的父母画像。
3.  **深度共情 (Deep Empathy)**
    *   AI 切换至"父母角色"，基于画像进行真实演绎。独特的"心理活动气泡"设计，展示父母言语背后的真实爱意（如责备背后的担心）。
4.  **疗愈与行动 (Heal & Act)**
    *   对话结束时，系统提供具体的沟通话术建议。若检测到情绪低落，会自动调用 **`recommend_music`** 工具播放治愈音乐，完成情感闭环。

## 🛠️ 智能体能力 (Agent Capabilities)

SoulHug 内置了专用的工具集，以支持上述逻辑：

*   🧠 **Memory System (`save_memory`)**: 长期记忆用户的家庭结构和父母性格，越用越懂你。
*   ❤️ **Emotion Engine (`analyze_emotion`)**: 量化分析用户情绪（愤怒、委屈、无助等），驱动交互反馈。
*   🎵 **Healing Echo (`recommend_music`)**: 根据当前对话氛围，智能推荐并模拟播放治愈系音乐。

## 📜 使用政策与安全 (Usage Policy)

我们高度重视用户的心理安全与隐私：

*   **安全边界**: 系统内置危机干预机制。检测到自杀倾向或家庭暴力风险时，会强制触发安全拦截并推荐专业援助（详见 [Terms of Service](./TERMS_OF_SERVICE.md)）。
*   **隐私保护**: 所有的对话仅用于即时生成回复，用户的敏感画像数据存储于本地或加密环境（详见 [Privacy Policy](./PRIVACY_POLICY.md)）。

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure API Key

```bash
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### 3. Run Development Server

```bash
# Terminal 1: Start WebSocket server (Agent Backend)
pnpm dev:server

# Terminal 2: Start Web UI (React Frontend)
pnpm dev
```

Or run both together:

```bash
pnpm dev:full
```

## 📂 Project Structure

```
SoulHug/
├── src/
│   ├── agent.ts          # Agent 核心逻辑 (System Prompt + Tools)
│   ├── server.ts         # AgentX Server (WebSocket)
│   └── web/              # React 前端应用
├── docs/                 # 产品文档与设计愿景
├── TERMS_OF_SERVICE.md   # 服务条款
└── PRIVACY_POLICY.md     # 隐私政策
```

## 🌈 为什么选择 SoulHug？ (Unique Value)

*   **不仅仅是聊天**: 我们提供可视化的"心理活动"解读，解决"听不懂父母话"的痛点。
*   **不仅仅是安慰**: 我们提供可执行的沟通策略，真正改善现实关系。
*   **不仅仅是机器**: 通过记忆和音乐，我们致力于打造有温度的情感连接。