/**
 * UserMessage - SoulHug 用户消息组件
 *
 * 温暖的气泡设计，右对齐布局
 */

import * as React from "react";
import { Loader2, AlertCircle, PauseCircle, Heart } from "lucide-react";
import { MessageAvatar } from "./MessageAvatar";
import { MessageContent } from "./MessageContent";
import { cn } from "~/utils/utils";
import type { UserConversationStatus } from "~/hooks/useAgent";

type UserMessageStatus = UserConversationStatus;

export interface UserMessageProps {
  /**
   * Message content
   */
  content: string;
  /**
   * Message status
   */
  status: UserMessageStatus;
  /**
   * Additional class name
   */
  className?: string;
}

/**
 * Status icon component - SoulHug 定制版
 */
const StatusIcon: React.FC<{ status: UserMessageStatus }> = ({ status }) => {
  const iconClassName = "w-4 h-4 flex-shrink-0";

  switch (status) {
    case "pending":
      return <Loader2 className={cn(iconClassName, "animate-spin text-primary/60")} />;
    case "success":
      return <Heart className={cn(iconClassName, "text-primary fill-primary/20")} />;
    case "error":
      return <AlertCircle className={cn(iconClassName, "text-destructive")} />;
    case "interrupted":
      return <PauseCircle className={cn(iconClassName, "text-muted-foreground")} />;
    default:
      return null;
  }
};

/**
 * UserMessage Component - SoulHug 定制版
 */
export const UserMessage: React.FC<UserMessageProps> = ({ content, status, className }) => {
  return (
    <div className={cn("flex gap-4 py-4 px-2 flex-row-reverse animate-slide-in", className)}>
      <MessageAvatar role="user" className="mt-1" />
      <div className="flex items-start gap-2 max-w-[80%] flex-row-reverse">
        <div className="rounded-2xl rounded-tr-sm px-5 py-4 bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-lg shadow-primary/20">
          <MessageContent content={content} className="text-sm leading-relaxed tracking-wide" />
        </div>
        <div className="flex items-center h-8 opacity-70">
          <StatusIcon status={status} />
        </div>
      </div>
    </div>
  );
};
