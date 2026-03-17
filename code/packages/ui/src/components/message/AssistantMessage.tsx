/**
 * AssistantMessage - SoulHug 情感陪伴助手消息组件
 *
 * 使用温暖、治愈的文案和动画效果
 *
 * States:
 * - queued: 准备聆听
 * - thinking: 用心思考中
 * - responding: 正在回应
 * - completed: 消息完成
 */

import * as React from "react";
import { MessageAvatar } from "./MessageAvatar";
import { MessageContent } from "./MessageContent";
import { cn } from "~/utils/utils";

export type AssistantMessageStatus = "queued" | "thinking" | "responding" | "completed";

export interface AssistantMessageProps {
  /**
   * Message status (lifecycle state)
   */
  status: AssistantMessageStatus;
  /**
   * Message content (for completed status)
   */
  content?: string;
  /**
   * Streaming text (for responding status)
   */
  streaming?: string;
  /**
   * Additional class name
   */
  className?: string;
}

/**
 * AssistantMessage Component - SoulHug 定制版
 */
export const AssistantMessage: React.FC<AssistantMessageProps> = ({
  status,
  content = "",
  streaming = "",
  className,
}) => {
  const [dots, setDots] = React.useState("");

  // Animated dots for queued/thinking states
  React.useEffect(() => {
    if (status === "queued" || status === "thinking") {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [status]);

  const renderContent = () => {
    switch (status) {
      case "queued":
        return (
          <span className="text-muted-foreground flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-primary/60 rounded-full animate-pulse" />
            准备聆听{dots}
          </span>
        );

      case "thinking":
        return (
          <span className="text-muted-foreground flex items-center gap-2">
            <span className="inline-flex gap-1">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </span>
            正在用心思考{dots}
          </span>
        );

      case "responding":
        return (
          <>
            <MessageContent content={streaming} />
            <span className="inline-block w-1.5 h-4 bg-primary/50 animate-pulse ml-0.5 align-middle rounded-sm" />
          </>
        );

      case "completed":
        return <MessageContent content={content} />;

      default:
        return null;
    }
  };

  return (
    <div className={cn("flex gap-4 py-4 px-2 animate-fade-in", className)}>
      <MessageAvatar role="assistant" className="mt-1" />
      <div className="rounded-2xl rounded-tl-sm px-5 py-4 glass-panel max-w-[85%] shadow-soulhug-glow text-foreground border-l-4 border-l-primary/30">
        <div className="text-sm leading-relaxed tracking-wide">{renderContent()}</div>
      </div>
    </div>
  );
};
