# ADR-001: Phase 1 核心体验强化架构设计

> **状态**: 提议中
> **日期**: 2024-12-23
> **决策者**: SoulHug Team

---

## 1. 背景与问题

### 1.1 当前状态

SoulHug 已完成基础重构，代码结构清晰：

```
src/
├── agent.ts      (531行) - AI 智能体定义
├── server.ts     (153行) - WebSocket 服务器
└── web/
    └── App.tsx   (631行) - 前端界面
```

技术栈：
- **前端**: React 18 + TypeScript + Tailwind CSS + Vite
- **后端**: AgentX 框架 + WebSocket
- **AI**: Claude API (通过 AgentX 封装)

### 1.2 核心问题

虽然功能可用，但**核心体验不够突出**：

| 问题 | 当前状态 | 期望状态 |
|------|---------|---------|
| 角色切换 | 突然变化，无仪式感 | 有动画过渡，用户明确感知 |
| 心理活动 | 与文本混排，易被忽略 | 可展开/折叠，视觉突出 |
| 对话收获 | 纯文本建议 | 可复制的话术卡片 |

---

## 2. 决策

### 2.1 架构原则

**原则 1: 纯前端实现**
- 所有 Phase 1 功能均在前端完成
- 不修改 Agent 定义或后端逻辑
- 通过解析 AI 返回的文本实现功能

**原则 2: 组件化拆分**
- 将 App.tsx 拆分为独立组件
- 每个核心体验对应一个组件模块
- 保持单向数据流

**原则 3: 渐进增强**
- 动画使用 CSS + Framer Motion
- 无动画时功能仍可用
- 性能优先，动画可降级

### 2.2 目录结构

```
src/web/
├── App.tsx                    # 主应用（精简为布局+状态管理）
├── main.tsx                   # 入口
│
├── components/                # UI 组件
│   ├── chat/                  # 对话相关
│   │   ├── MessageBubble.tsx      # 消息气泡（重构）
│   │   ├── ThoughtBubble.tsx      # 心理活动气泡（新）
│   │   ├── RoleTransition.tsx     # 角色切换动画（新）
│   │   └── ThinkingIndicator.tsx  # 思考指示器
│   │
│   ├── reflection/            # 反思总结相关
│   │   ├── ReflectionCard.tsx     # 反思卡片（重构）
│   │   ├── SuggestionCard.tsx     # 话术建议卡片（新）
│   │   └── CopyableText.tsx       # 可复制文本组件（新）
│   │
│   ├── layout/                # 布局组件
│   │   ├── Sidebar.tsx            # 侧边栏
│   │   ├── Header.tsx             # 顶部栏
│   │   └── InputArea.tsx          # 输入区域
│   │
│   └── common/                # 通用组件
│       ├── AnimatedBackground.tsx # 情绪背景
│       └── Toast.tsx              # 提示组件
│
├── hooks/                     # 自定义 Hooks
│   ├── useRoleState.ts            # 角色状态管理
│   ├── useEmotionDetection.ts     # 情绪检测
│   └── useThoughtParser.ts        # 心理活动解析
│
├── utils/                     # 工具函数
│   ├── contentParser.ts           # 内容解析
│   └── clipboard.ts               # 剪贴板操作
│
├── types/                     # 类型定义
│   └── index.ts
│
└── styles/                    # 样式
    └── animations.css             # 自定义动画
```

---

## 3. 功能设计

### 3.1 功能一：角色切换动画

#### 交互流程

```
┌─────────────────────────────────────────────────────────────┐
│  Step 1: AI 返回包含 "🎭 我现在扮演你的妈妈" 的文本          │
│                           ↓                                │
│  Step 2: useRoleState 检测到角色切换                        │
│                           ↓                                │
│  Step 3: 触发 RoleTransition 组件                          │
│          - 显示全屏遮罩 (0.3s fade in)                      │
│          - 头像变形动画 🌳 → 👩 (0.5s)                      │
│          - 背景颜色渐变 (0.5s)                              │
│          - 文字提示 "我现在是你的妈妈了..."                  │
│                           ↓                                │
│  Step 4: 动画结束，显示角色扮演消息                         │
│          - 头像带粉色光晕                                   │
│          - 消息气泡带特殊边框                               │
│          - 顶部显示 "🎭 妈妈视角" 标签                      │
└─────────────────────────────────────────────────────────────┘
```

#### 技术方案

**方案 A: 纯 CSS 动画** ✅ 推荐
```tsx
// RoleTransition.tsx
const RoleTransition = ({ from, to, onComplete }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/20 animate-fade-in" />

      {/* 角色变形 */}
      <div className="relative">
        <div className="text-6xl animate-role-morph">
          {/* CSS animation: scale down → change content → scale up */}
        </div>
        <p className="mt-4 text-lg text-white animate-fade-in-delay">
          我现在是你的{to === 'mom' ? '妈妈' : '爸爸'}了...
        </p>
      </div>
    </div>
  );
};
```

优点：
- 零依赖，性能好
- 实现简单
- 可降级

**方案 B: Framer Motion**
```tsx
import { motion, AnimatePresence } from 'framer-motion';

const RoleTransition = ({ from, to, onComplete }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onAnimationComplete={onComplete}
      >
        {/* 更复杂的动画序列 */}
      </motion.div>
    </AnimatePresence>
  );
};
```

优点：
- 动画更流畅
- 手势支持
- 动画编排更灵活

**决策：使用方案 A（纯 CSS），保持零依赖原则**

#### 动画 CSS 定义

```css
/* animations.css */

@keyframes role-morph {
  0% { transform: scale(1); opacity: 1; }
  40% { transform: scale(0.5); opacity: 0; }
  60% { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-role-morph {
  animation: role-morph 0.8s ease-in-out forwards;
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}

.animate-fade-in-delay {
  animation: fade-in 0.3s ease-out 0.5s forwards;
  opacity: 0;
}
```

---

### 3.2 功能二：心理活动可展开

#### 交互流程

```
┌─────────────────────────────────────────────────────────────┐
│  初始状态：心理活动折叠                                       │
│  ┌───────────────────────────────────────────┐             │
│  │ 👩 你怎么又玩手机！作业做完了吗！            │             │
│  │                                           │             │
│  │ ╭─────────────────────────────────────╮   │             │
│  │ │ 💭 点击查看妈妈的内心想法 (1条)        │   │             │
│  │ ╰─────────────────────────────────────╯   │             │
│  └───────────────────────────────────────────┘             │
│                           ↓ 点击                           │
│  展开状态：显示心理活动详情                                   │
│  ┌───────────────────────────────────────────┐             │
│  │ 👩 你怎么又玩手机！作业做完了吗！            │             │
│  │                                           │             │
│  │ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓   │             │
│  │ ┃ 💭 她其实在想...                     ┃   │             │
│  │ ┃                                     ┃   │             │
│  │ ┃ "我看到你玩手机就害怕，怕你视力不好，  ┃   │             │
│  │ ┃  也怕你沉迷游戏耽误学习，              ┃   │             │
│  │ ┃  但我不知道怎么温和地说..."           ┃   │             │
│  │ ┃                                     ┃   │             │
│  │ ┃ ✨ 这就是"刀子嘴豆腐心"               ┃   │             │
│  │ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛   │             │
│  └───────────────────────────────────────────┘             │
└─────────────────────────────────────────────────────────────┘
```

#### 组件设计

```tsx
// ThoughtBubble.tsx

interface ThoughtBubbleProps {
  thoughts: string[];           // 心理活动数组
  defaultExpanded?: boolean;    // 默认是否展开
  onExpand?: () => void;        // 展开回调
}

const ThoughtBubble = ({ thoughts, defaultExpanded = false, onExpand }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) onExpand?.();
  };

  return (
    <div className="ml-4 mt-2">
      {/* 折叠状态：显示提示 */}
      {!isExpanded && (
        <button
          onClick={handleToggle}
          className="flex items-center gap-2 px-4 py-2 bg-purple-50 hover:bg-purple-100
                     rounded-full border border-purple-200 text-purple-600 text-sm
                     transition-all hover:scale-105"
        >
          <span>💭</span>
          <span>点击查看内心想法 ({thoughts.length}条)</span>
          <ChevronDown size={16} />
        </button>
      )}

      {/* 展开状态：显示详情 */}
      {isExpanded && (
        <div className="animate-slide-up">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50
                          rounded-2xl border-2 border-purple-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">💭</span>
                <span className="text-purple-600 font-medium">她其实在想...</span>
              </div>
              <button onClick={handleToggle} className="text-purple-400 hover:text-purple-600">
                <ChevronUp size={16} />
              </button>
            </div>

            <div className="space-y-3">
              {thoughts.map((thought, i) => (
                <p key={i} className="text-purple-700 italic leading-relaxed">
                  "{thought}"
                </p>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-purple-100">
              <p className="text-xs text-purple-500 flex items-center gap-1">
                <span>✨</span>
                <span>这就是"刀子嘴豆腐心"</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

#### 状态管理

```tsx
// useThoughtParser.ts

interface ThoughtParseResult {
  segments: Array<
    | { type: 'text'; content: string }
    | { type: 'thought'; content: string }
  >;
  thoughts: string[];
  hasThoughts: boolean;
}

export function useThoughtParser(content: string): ThoughtParseResult {
  return useMemo(() => {
    const segments: ThoughtParseResult['segments'] = [];
    const thoughts: string[] = [];

    // 使用正则匹配中文括号内容
    const regex = /（([^）]+)）/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      // 添加括号前的普通文本
      if (match.index > lastIndex) {
        const text = content.slice(lastIndex, match.index).trim();
        if (text) segments.push({ type: 'text', content: text });
      }

      // 添加心理活动
      const thought = match[1];
      segments.push({ type: 'thought', content: thought });
      thoughts.push(thought);

      lastIndex = match.index + match[0].length;
    }

    // 添加剩余文本
    if (lastIndex < content.length) {
      const text = content.slice(lastIndex).trim();
      if (text) segments.push({ type: 'text', content: text });
    }

    return {
      segments: segments.length > 0 ? segments : [{ type: 'text', content }],
      thoughts,
      hasThoughts: thoughts.length > 0,
    };
  }, [content]);
}
```

---

### 3.3 功能三：话术卡片 + 复制

#### 交互流程

```
┌─────────────────────────────────────────────────────────────┐
│  对话结束时显示反思卡片                                       │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 📊 对话收获                                            │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │                                                       │  │
│  │ ✅ 你学到了什么                                        │  │
│  │   • 妈妈批评你的时候，其实是在担心你                    │  │
│  │   • 她不知道怎么温和表达，所以用了命令式语气            │  │
│  │                                                       │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │                                                       │  │
│  │ 💬 推荐话术                                            │  │
│  │ ┌─────────────────────────────────────────────────┐   │  │
│  │ │ "妈，我知道你是担心我。以后我每天玩手机不超过     │   │  │
│  │ │  1小时，作业做完再玩，你看行吗？"                 │   │  │
│  │ └─────────────────────────────────────────────────┘   │  │
│  │                                                       │  │
│  │               [📋 复制话术]  [✨ 换一个]               │  │
│  │                                                       │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │ ⏰ 3天后提醒我问问效果    [设置提醒]  [不用了]         │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  复制成功后显示 Toast：                                      │
│  ┌──────────────────────┐                                  │
│  │ ✅ 话术已复制到剪贴板  │                                  │
│  └──────────────────────┘                                  │
└─────────────────────────────────────────────────────────────┘
```

#### 组件设计

```tsx
// SuggestionCard.tsx

interface SuggestionCardProps {
  suggestions: string[];
  script?: string;              // 推荐话术
  onCopy?: (text: string) => void;
  onSetReminder?: () => void;
}

const SuggestionCard = ({ suggestions, script, onCopy, onSetReminder }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!script) return;

    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
      onCopy?.(script);

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl
                    border-2 border-amber-200 shadow-md overflow-hidden">
      {/* 标题 */}
      <div className="px-5 py-3 bg-gradient-to-r from-amber-100 to-orange-100
                      border-b border-amber-200">
        <h3 className="font-bold text-amber-800 flex items-center gap-2">
          <span>📊</span>
          <span>对话收获</span>
        </h3>
      </div>

      {/* 学到的内容 */}
      <div className="p-5 space-y-4">
        <div>
          <h4 className="text-sm font-medium text-amber-700 mb-2 flex items-center gap-1">
            <span>✅</span> 你学到了什么
          </h4>
          <ul className="space-y-1">
            {suggestions.map((item, i) => (
              <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                <span className="text-amber-400 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 推荐话术 */}
        {script && (
          <div>
            <h4 className="text-sm font-medium text-amber-700 mb-2 flex items-center gap-1">
              <span>💬</span> 推荐话术
            </h4>
            <div className="bg-white/80 rounded-xl p-4 border border-amber-100">
              <p className="text-slate-700 text-sm leading-relaxed">"{script}"</p>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleCopy}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2
                           rounded-lg text-sm font-medium transition-all
                           ${copied
                             ? 'bg-green-100 text-green-700 border border-green-200'
                             : 'bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200'
                           }`}
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    <span>已复制</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span>复制话术</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 提醒设置 */}
      <div className="px-5 py-3 bg-amber-50 border-t border-amber-100
                      flex items-center justify-between">
        <p className="text-xs text-amber-600 flex items-center gap-1">
          <span>⏰</span>
          <span>3天后提醒我问问效果</span>
        </p>
        <div className="flex gap-2">
          <button
            onClick={onSetReminder}
            className="text-xs px-3 py-1 bg-amber-200 text-amber-700
                       rounded-full hover:bg-amber-300 transition-colors"
          >
            设置提醒
          </button>
          <button className="text-xs px-3 py-1 text-amber-500 hover:text-amber-700">
            不用了
          </button>
        </div>
      </div>
    </div>
  );
};
```

#### 复制功能实现

```tsx
// utils/clipboard.ts

export async function copyToClipboard(text: string): Promise<boolean> {
  // 优先使用 Clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Clipboard API failed:', err);
    }
  }

  // 降级方案：使用 execCommand
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    const result = document.execCommand('copy');
    document.body.removeChild(textarea);
    return result;
  } catch (err) {
    console.error('execCommand failed:', err);
    return false;
  }
}
```

---

## 4. 实现计划

### 4.1 任务分解

| 阶段 | 任务 | 工时 | 优先级 |
|------|------|------|--------|
| **准备** | 创建目录结构 | 0.5h | P0 |
| **准备** | 定义类型和工具函数 | 1h | P0 |
| **核心** | 实现 RoleTransition 组件 | 2h | P0 |
| **核心** | 实现 ThoughtBubble 组件 | 2h | P0 |
| **核心** | 实现 SuggestionCard 组件 | 2h | P0 |
| **集成** | 重构 App.tsx，集成新组件 | 2h | P0 |
| **集成** | 添加动画 CSS | 1h | P0 |
| **测试** | 端到端测试 | 1h | P1 |
| **优化** | 动画调优 | 1h | P2 |

**总工时估计：12-15 小时**

### 4.2 实现顺序

```
Day 1:
├── 创建目录结构和类型定义
├── 实现 useThoughtParser Hook
├── 实现 ThoughtBubble 组件（含展开/折叠）
└── 集成到 MessageBubble

Day 2:
├── 实现 useRoleState Hook
├── 实现 RoleTransition 动画组件
├── 添加角色切换 CSS 动画
└── 集成到 App.tsx

Day 3:
├── 实现 SuggestionCard 组件
├── 实现复制功能
├── 重构 ReflectionCard
└── 最终集成和测试
```

---

## 5. 技术决策

### 5.1 依赖选择

| 功能 | 决策 | 理由 |
|------|------|------|
| 动画 | CSS Animation | 零依赖，性能好，够用 |
| 图标 | lucide-react（已有） | 已在项目中使用 |
| 状态管理 | React useState/useMemo | 状态简单，无需引入新库 |
| 剪贴板 | Clipboard API + 降级 | 原生支持，兼容性好 |

### 5.2 不引入的库

- **Framer Motion**: 动画需求简单，CSS 够用
- **Zustand/Jotai**: 状态简单，useState 够用
- **React Query**: 无复杂数据请求需求

### 5.3 性能考虑

1. **动画**：使用 `transform` 和 `opacity`，避免触发重排
2. **解析**：使用 `useMemo` 缓存解析结果
3. **渲染**：ThoughtBubble 使用条件渲染，避免不必要的 DOM

---

## 6. 风险与缓解

| 风险 | 可能性 | 影响 | 缓解措施 |
|------|--------|------|----------|
| 角色检测不准确 | 中 | 中 | 增加更多标记模式，提供手动切换 |
| 心理活动解析失败 | 低 | 低 | 降级为普通文本显示 |
| 动画卡顿 | 低 | 低 | 使用 CSS 硬件加速，减少动画复杂度 |
| 剪贴板权限被拒 | 中 | 低 | 提供降级方案（手动选择复制） |

---

## 7. 后续迭代

Phase 1 完成后，可考虑：

1. **Phase 2: 情感增强**
   - 情绪背景粒子效果
   - 语音输入支持
   - 提醒通知系统

2. **Phase 3: 产品闭环**
   - 父母画像持久化
   - 对话历史浏览
   - 成长轨迹展示

---

## 8. 结论

Phase 1 采用**纯前端方案**，通过组件拆分和 CSS 动画实现三个核心体验优化：

1. **角色切换动画** - 增加仪式感
2. **心理活动可展开** - 突出核心卖点
3. **话术卡片+复制** - 提供可带走的收获

预计工时 12-15 小时，零新依赖引入，符合渐进增强原则。
