/**
 * MessageAvatar - SoulHug 头像组件
 *
 * 温暖可爱的头像设计
 */

import * as React from "react";
import type { MessageRole } from "agentxjs";
import { cn } from "~/utils/utils";

export interface MessageAvatarProps {
  /**
   * Message role
   */
  role: MessageRole;
  /**
   * Additional class name
   */
  className?: string;
}

/**
 * MessageAvatar Component - SoulHug 定制版
 */
export const MessageAvatar: React.FC<MessageAvatarProps> = ({ role, className }) => {
  const avatarClasses = cn(
    "w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 shadow-sm animate-breathe transition-all duration-300 overflow-hidden bg-white/20 backdrop-blur-sm",
    className
  );

  const renderAvatar = (url: string, alt: string) => (
    <img 
      src={url} 
      alt={alt} 
      className="w-full h-full object-cover rounded-full hover:scale-110 transition-transform duration-500"
    />
  );

  switch (role) {
    case "user":
      // 用户头像 - 使用 Adventurer 风格 (更像真人的插画)
      return (
        <div className={cn(avatarClasses, "ring-2 ring-indigo-200 shadow-soulhug-glow")}>
          {renderAvatar("https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Felix&backgroundColor=ffdfbf", "User")}
        </div>
      );
    case "assistant":
      // SoulHug 助手头像 - 使用 Bottts 风格 (软萌机器人)
      return (
        <div className={cn(avatarClasses, "ring-4 ring-pink-200/50 shadow-soulhug-glow")}>
          {renderAvatar("https://api.dicebear.com/9.x/bottts-neutral/svg?seed=SoulHug&backgroundColor=b6e3f4", "Assistant")}
        </div>
      );
    case "system":
      return (
        <div className={cn(avatarClasses, "bg-muted text-muted-foreground w-8 h-8 text-sm")}>
          💫
        </div>
      );
    case "tool":
      return (
        <div className={cn(avatarClasses, "bg-accent/20 text-accent w-8 h-8 text-sm")}>
          🔧
        </div>
      );
    case "error":
      return (
        <div className={cn(avatarClasses, "bg-destructive/20 text-destructive w-8 h-8 text-sm")}>
          💔
        </div>
      );
    default:
      return null;
  }
};
