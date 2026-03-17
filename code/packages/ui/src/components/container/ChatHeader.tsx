/**
 * ChatHeader - Header component for Chat interface
 *
 * Displays current agent information, status, and actions.
 *
 * @example
 * ```tsx
 * <ChatHeader
 *   agentName="Assistant"
 *   status="thinking"
 *   messageCount={5}
 * />
 * ```
 */

import * as React from "react";
import { MessageSquare } from "lucide-react";
import type { AgentState } from "agentxjs";
import { Badge } from "~/components/element/Badge";
import { cn } from "~/utils";

export interface ChatHeaderProps {
  /** Agent display name */
  agentName?: string;
  /** Current agent state */
  status?: AgentState;
  /** Number of messages in conversation */
  messageCount?: number;
  /** Action buttons to display */
  actions?: React.ReactNode;
  /** Additional class name */
  className?: string;
  /** Optional avatar component */
  avatar?: React.ReactNode;
}

/**
 * Get status display info
 */
function getStatusInfo(status: AgentState) {
  switch (status) {
    case "thinking":
      return { text: "思考中...", colorClass: "bg-amber-400 animate-pulse" };
    case "planning_tool":
      return { text: "规划工具...", colorClass: "bg-blue-400 animate-pulse" };
    case "awaiting_tool_result":
      return { text: "调用工具...", colorClass: "bg-purple-400 animate-pulse" };
    case "responding":
      return { text: "回复中...", colorClass: "bg-green-400 animate-pulse" };
    case "idle":
    default:
      return { text: "在线", colorClass: "bg-green-500" };
  }
}

/**
 * ChatHeader component
 */
export function ChatHeader({
  agentName = "New Conversation",
  status = "idle",
  messageCount = 0,
  actions,
  className,
  avatar,
}: ChatHeaderProps) {
  const statusInfo = getStatusInfo(status);

  return (
    <div className={cn("px-6 py-4 z-50 transition-all duration-300", className)}>
      <div className="flex items-center justify-between">
        {/* Left: Agent info */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {/* Avatar */}
          {avatar && (
            <div className="relative w-12 h-12 flex items-center justify-center">
              {avatar}
            </div>
          )}

          {/* Name and status */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-lg text-foreground/90 truncate tracking-tight">{agentName}</h2>
              {messageCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  {messageCount}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={cn("w-2 h-2 rounded-full", statusInfo.colorClass)} />
              <span className="text-xs font-medium text-muted-foreground/80">
                {statusInfo.text}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        {actions && <div className="flex items-center gap-2 ml-4">{actions}</div>}
      </div>
    </div>
  );
}
