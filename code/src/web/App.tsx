/**
 * SoulHug - 心灵拥抱
 *
 * 核心价值：帮助青少年理解父母视角的情感陪伴智能体
 *
 * 使用 @soulhug/ui 组件库
 */

import {
  useAgentX,
  useAgent,
  MessagePane,
  InputPane,
  AssistantMessage,
  UserMessage,
} from "@soulhug/ui";
import type {
  ConversationData,
  AssistantConversationData,
  UserConversationData,
  AssistantMessageStatus,
  ToolBarItem,
} from "@soulhug/ui";
import { useState, useEffect, useCallback, useMemo } from "react";
import { MessageSquare, Menu, Ghost, UserCircle, Users } from "lucide-react";

// 类型导入
import type { EmotionType } from "./types";
import { useRoleState } from "./hooks/useRoleState";
import { RoleTransition } from "./components/chat/RoleTransition";
import { Live2DViewer } from "./components/live2d/Live2DViewer";

// ============================================================================
// 情绪检测（客户端实现）
// ============================================================================

const EMOTION_KEYWORDS: Record<EmotionType, RegExp> = {
  angry: /生气|愤怒|气死|烦死|讨厌|恨|吵架|骂|烦|火大|崩溃/,
  sad: /难过|伤心|哭|委屈|失落|沮丧|心痛|绝望|无助/,
  anxious: /焦虑|担心|害怕|紧张|压力|崩溃|喘不过气|失眠/,
  understood: /理解|明白|原来|懂了|释然|感谢|谢谢/,
  hopeful: /希望|会好|试试|可以|愿意|想通|决定/,
  neutral: /.*/,
};

const EMOTION_STYLES: Record<EmotionType, { bg: string; label: string }> = {
  neutral: { bg: "from-rose-50 via-purple-50 to-sky-50", label: "平静" },
  angry: { bg: "from-red-50 via-orange-50 to-amber-50", label: "愤怒" },
  sad: { bg: "from-slate-100 via-blue-50 to-indigo-50", label: "难过" },
  anxious: { bg: "from-purple-50 via-indigo-50 to-blue-50", label: "焦虑" },
  understood: { bg: "from-green-50 via-emerald-50 to-teal-50", label: "被理解" },
  hopeful: { bg: "from-amber-50 via-yellow-50 to-orange-50", label: "希望" },
};

function detectEmotion(text: string): EmotionType {
  for (const [emotion, regex] of Object.entries(EMOTION_KEYWORDS)) {
    if (emotion !== "neutral" && regex.test(text)) {
      return emotion as EmotionType;
    }
  }
  return "neutral";
}

// ============================================================================
// 消息状态映射
// ============================================================================

function getAssistantStatus(
  conv: AssistantConversationData,
  agentStatus: string
): AssistantMessageStatus {
  // 根据 conversation 状态映射到 UI 状态
  switch (conv.status) {
    case "streaming":
      return "responding";
    case "completed":
      return "completed";
    case "thinking":
      return "thinking";
    case "processing":
    case "queued":
    default:
      // 如果 agent 正在思考，显示思考状态
      if (agentStatus === "thinking" || agentStatus === "planning_tool") {
        return "thinking";
      }
      return "queued";
  }
}

// ============================================================================
// 主应用组件
// ============================================================================

function App() {
  // WebSocket 连接
  const wsUrl = `ws://${window.location.hostname}:5800`;
  const agentx = useAgentX(wsUrl);
  const containerId = "default";

  // 对话状态
  const [currentImageId, setCurrentImageId] = useState<string | null>(null);
  // const { images } = useImages(agentx, { containerId, autoLoad: true });

  // UI 状态
  const [currentEmotion, setCurrentEmotion] = useState<EmotionType>("neutral");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 角色状态管理
  const {
    currentRole,
    roleConfig,
    isTransitioning,
    transitionTarget,
    handleRoleDetection,
    startTransition,
    completeTransition,
  } = useRoleState();

  // Agent Hook
  const { conversations, streamingText, send, isLoading, status } = useAgent(
    agentx,
    currentImageId
  );

  // 角色检测：监听 streamingText
  useEffect(() => {
    if (streamingText) {
      handleRoleDetection(streamingText);
    }
  }, [streamingText, handleRoleDetection]);

  // 工具栏点击处理
  const handleToolbarClick = useCallback(
    (id: string) => {
      if (isLoading) return;

      const prompts = {
        "tree-hole": "请结束角色扮演，回到'树洞'模式。做回那个安静、温暖的倾听者，不要带任何评判。",
        "roleplay-mom": "请切换到'妈妈'的视角。以一位关爱孩子的母亲的口吻和我对话。请在回复开头使用标记 '---🎭 我现在扮演你的妈妈---'，并在对话中使用（括号）表达你的心理活动。",
        "roleplay-dad": "请切换到'爸爸'的视角。以一位沉稳、理性的父亲的口吻和我对话。请在回复开头使用标记 '---🎭 我现在扮演你的爸爸---'，并在对话中使用（括号）表达你的心理活动。",
      };

      if (id in prompts) {
        // 1. 发送指令给 Agent
        send(prompts[id as keyof typeof prompts]);
        
        // 2. 立即触发视觉转换效果 (提升响应速度)
        if (id === 'roleplay-mom') startTransition('roleplay-mom');
        if (id === 'roleplay-dad') startTransition('roleplay-dad');
        if (id === 'tree-hole') startTransition('soulhug');
      }
    },
    [isLoading, send, startTransition]
  );

  // 工具栏配置
  const toolbarItems = useMemo<ToolBarItem[]>(
    () => [
      {
        id: "tree-hole",
        icon: <Ghost className="w-4 h-4" />,
        label: "回归树洞",
        variant: currentRole === "soulhug" ? "primary" : "default",
      },
      {
        id: "roleplay-mom",
        icon: <UserCircle className="w-4 h-4" />,
        label: "妈妈视角",
        variant: currentRole === "roleplay-mom" ? "primary" : "default",
      },
      {
        id: "roleplay-dad",
        icon: <Users className="w-4 h-4" />,
        label: "爸爸视角",
        variant: currentRole === "roleplay-dad" ? "primary" : "default",
      },
    ],
    [currentRole]
  );

  // 调试日志
  useEffect(() => {
    console.log("[SoulHug Debug]", {
      agentx: !!agentx,
      currentImageId,
      conversationsCount: conversations.length,
      status,
      isLoading,
      streamingText: streamingText?.slice(0, 50),
    });
  }, [agentx, currentImageId, conversations.length, status, isLoading, streamingText]);

  // 监听 WebSocket 事件 - 调试用
  useEffect(() => {
    if (!agentx || !currentImageId) return;

    console.log("[SoulHug] Setting up event listeners for imageId:", currentImageId);

    const unsubscribes: Array<() => void> = [];

    // 监听所有关键事件
    const events = [
      "message_start",
      "text_delta",
      "conversation_start",
      "conversation_thinking",
      "conversation_responding",
      "conversation_end",
      "assistant_message",
      "error_occurred",
    ];

    events.forEach((eventName) => {
      unsubscribes.push(
        agentx.on(eventName as Parameters<typeof agentx.on>[0], (event: { context?: { imageId?: string }; data?: unknown }) => {
          console.log(`[SoulHug Event] ${eventName}:`, {
            eventImageId: event.context?.imageId,
            currentImageId,
            matches: event.context?.imageId === currentImageId,
            data: event.data,
          });
        })
      );
    });

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [agentx, currentImageId]);

  // 情绪检测：基于用户最后一条消息
  useEffect(() => {
    const userMessages = conversations.filter((c) => c.type === "user");
    if (userMessages.length > 0) {
      const lastUserMsg = userMessages[userMessages.length - 1] as UserConversationData;
      const content = (lastUserMsg.content as string) || "";
      setCurrentEmotion(detectEmotion(content));
    }
  }, [conversations]);

  // 自动创建新对话（每次加载都创建新的）
  useEffect(() => {
    if (!agentx || currentImageId) return;

    // 总是创建新的对话，避免复用旧的 image 导致 imageId 不匹配
    console.log("[SoulHug] Creating new conversation...");
    agentx
      .request("image_create_request", { containerId, config: {} })
      .then((res: { data: { record: { imageId: string } | null } }) => {
        if (res.data?.record?.imageId) {
          console.log("[SoulHug] New conversation created:", res.data.record.imageId);
          setCurrentImageId(res.data.record.imageId);
        } else {
          console.error("[SoulHug] Failed to create image:", res);
        }
      })
      .catch((err: Error) => {
        console.error("[SoulHug] Image creation error:", err);
      });
  }, [agentx, currentImageId, containerId]);

  // 发送消息
  const handleSend = useCallback(
    (content: string | unknown[]) => {
      if (typeof content === "string") {
        const text = content.trim();
        if (!text || isLoading) return;
        send(text);
      }
    },
    [isLoading, send]
  );

  // 连接中状态
  if (!agentx) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-purple-50 to-sky-50">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-rose-100 to-purple-100 flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-4xl">🌳</span>
          </div>
          <p className="text-purple-400 text-lg mt-6 font-medium">
            正在连接树洞...
          </p>
        </div>
      </div>
    );
  }

  const emotionStyle = EMOTION_STYLES[currentEmotion];
  const hasMessages = conversations.length > 0;
  const isThinking = status === "thinking" || status === "planning_tool";

  return (
    <div className="h-screen w-screen flex overflow-hidden text-slate-700 font-sans">
      {/* 角色切换动画 */}
      {isTransitioning && transitionTarget && (
        <RoleTransition
          from={currentRole}
          to={transitionTarget}
          onComplete={completeTransition}
        />
      )}

      {/* 动态背景 */}
      <div
        className={`fixed inset-0 -z-10 bg-gradient-to-br ${emotionStyle.bg} transition-all duration-1000`}
      />

      {/* 移动端菜单遮罩 */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 侧边栏 (支持移动端抽屉模式) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/40 backdrop-blur-xl border-r border-white/50 p-6 transition-transform duration-300 md:relative md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 mb-8">
          <div
            className={`w-10 h-10 rounded-full bg-gradient-to-br ${roleConfig.color} flex items-center justify-center text-white shadow-lg text-2xl transition-all duration-500`}
          >
            {roleConfig.avatar}
          </div>
          <div>
            <h1 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-purple-600">
              {roleConfig.name}
            </h1>
            <p className="text-xs text-slate-400">
              {currentRole === "soulhug" ? "心灵拥抱" : "换位思考中..."}
            </p>
          </div>
        </div>

        <nav className="flex-1">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-rose-100/80 to-purple-100/80 text-rose-600">
            <MessageSquare size={20} />
            <span className="font-medium">树洞对话</span>
          </div>
        </nav>

        <div className="pt-4 border-t border-white/30">
          <p className="text-xs text-slate-400 text-center">
            "理解是爱的另一种表达"
          </p>
        </div>
      </aside>

      {/* 主对话区 */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Live2D 数字人层 - z-20 确保在 backdrop-blur 元素上面 */}
        <div className="absolute bottom-0 right-4 z-20 opacity-80 pointer-events-none md:opacity-100 transition-opacity duration-1000">
           <Live2DViewer
             role={currentRole}
             emotion={currentEmotion}
             className="w-[200px] h-[300px] md:w-[350px] md:h-[450px]"
           />
        </div>

        {/* 顶部栏 */}
        <header className="h-14 flex items-center justify-between px-4 md:px-6 bg-white/30 backdrop-blur-sm border-b border-white/30">
          <div className="flex items-center gap-3">
            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-white/50 md:hidden"
            >
              <Menu size={20} className="text-slate-600" />
            </button>

            <div
              className={`w-2 h-2 rounded-full transition-colors duration-500 ${
                currentEmotion === "angry"
                  ? "bg-red-400"
                  : currentEmotion === "sad"
                  ? "bg-blue-400"
                  : currentEmotion === "anxious"
                  ? "bg-purple-400"
                  : currentEmotion === "understood"
                  ? "bg-green-400"
                  : currentEmotion === "hopeful"
                  ? "bg-amber-400"
                  : "bg-emerald-400"
              }`}
            />
            <span className="font-medium text-slate-600 truncate">
              {roleConfig.name}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/50 text-slate-500 border border-white/50 whitespace-nowrap">
              {isThinking ? "正在思考..." : emotionStyle.label}
            </span>
          </div>
        </header>

        {/* 消息区域 - 使用 MessagePane */}
        <MessagePane
          className="flex-1"
          emptyState={{
            icon: <span className="text-5xl">🌳</span>,
            title: "你好，我是树洞",
            description: "这里没有评判，只有倾听。把那些让你睡不着的心事，都告诉我吧。",
          }}
        >
          {hasMessages && (
            <div className="max-w-2xl mx-auto space-y-2 py-4">
              {conversations.map((conv) => (
                <MessageRenderer
                  key={conv.id}
                  conversation={conv}
                  streamingText={streamingText}
                  agentStatus={status}
                />
              ))}

              {/* 当 isLoading 但没有 streaming 消息时，显示思考状态 */}
              {isLoading && !streamingText && conversations.length > 0 && (
                <AssistantMessage status="thinking" />
              )}
            </div>
          )}
        </MessagePane>

        {/* 输入区 - 使用 InputPane */}
        <div className="p-4 bg-white/20 backdrop-blur-sm border-t border-white/30">
          <div className="max-w-2xl mx-auto h-32">
            <InputPane
              onSend={handleSend}
              isLoading={isLoading}
              disabled={isLoading}
              placeholder="在这里写下你的心事..."
              toolbarItems={toolbarItems}
              onToolbarItemClick={handleToolbarClick}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

// ============================================================================
// 消息渲染器
// ============================================================================

function MessageRenderer({
  conversation,
  streamingText,
  agentStatus,
}: {
  conversation: ConversationData;
  streamingText: string;
  agentStatus: string;
}) {
  if (conversation.type === "user") {
    const userConv = conversation as UserConversationData;
    const content = (userConv.content as string) || "";
    return <UserMessage content={content} status="success" />;
  }

  if (conversation.type === "assistant") {
    const assistantConv = conversation as AssistantConversationData;
    const status = getAssistantStatus(assistantConv, agentStatus);

    // 提取文本内容（已完成的 text block 内容）
    const completedTextContent = assistantConv.blocks
      .filter((b) => b.type === "text")
      .map((b) => (b as { content: string }).content)
      .join("");

    // streaming 时：已完成的内容 + 正在流式输出的内容
    // completed 时：只有已完成的内容
    const fullContent = status === "responding"
      ? completedTextContent + streamingText
      : completedTextContent;

    return (
      <AssistantMessage
        status={status}
        content={fullContent}
        streaming={fullContent}
      />
    );
  }

  if (conversation.type === "error") {
    return (
      <div className="text-red-500 text-sm p-3 bg-red-50 rounded-lg">
        发生了一些错误，请稍后重试
      </div>
    );
  }

  return null;
}

export default App;
