/**
 * InputPane - SoulHug 输入面板
 *
 * 简化版输入组件:
 * - 全高度文本输入区
 * - 发送按钮
 * - 加载状态处理
 */

import * as React from "react";
import { Send, Square } from "lucide-react";
import { cn } from "~/utils/utils";
import { InputToolBar, type ToolBarItem } from "./InputToolBar";

export interface InputPaneProps {
  /**
   * Callback when user sends a message
   */
  onSend?: (content: string) => void;
  /**
   * Callback when stop button is clicked (during loading)
   */
  onStop?: () => void;
  /**
   * Whether the input is disabled
   */
  disabled?: boolean;
  /**
   * Whether currently loading/processing
   */
  isLoading?: boolean;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Additional class name
   */
  className?: string;
  /**
   * Toolbar items to display
   */
  toolbarItems?: ToolBarItem[];
  /**
   * Toolbar items to display on the right
   */
  toolbarRightItems?: ToolBarItem[];
  /**
   * Callback when a toolbar item is clicked
   */
  onToolbarItemClick?: (id: string) => void;
  /**
   * Files that were dropped onto the drop zone
   */
  droppedFiles?: File[];
  /**
   * Callback when dropped files have been processed/added to input
   */
  onDroppedFilesProcessed?: () => void;
}

/**
 * InputPane component - Simple input with send button
 */
export const InputPane = React.forwardRef<HTMLDivElement, InputPaneProps>(
  (
    {
      onSend,
      onStop,
      disabled = false,
      isLoading = false,
      placeholder = "有什么想说的，我在听...",
      className,
      toolbarItems,
      toolbarRightItems,
      onToolbarItemClick,
      droppedFiles,
      onDroppedFilesProcessed,
    },
    ref
  ) => {
    const [text, setText] = React.useState("");
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    // Effect to handle dropped files
    React.useEffect(() => {
      if (droppedFiles && droppedFiles.length > 0) {
        // Here we could handle file attachments logic
        // For now, we just notify they are processed
        onDroppedFilesProcessed?.();
      }
    }, [droppedFiles, onDroppedFilesProcessed]);

    /**
     * Handle send
     */
    const handleSend = React.useCallback(() => {
      const trimmedText = text.trim();
      if (!trimmedText || disabled || isLoading) return;

      onSend?.(trimmedText);
      setText("");

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }, [text, disabled, isLoading, onSend]);

    /**
     * Handle keyboard events
     */
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Enter to send (without Shift)
        if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
          e.preventDefault();
          handleSend();
        }
      },
      [handleSend]
    );

    /**
     * Auto-resize textarea
     */
    const handleInput = React.useCallback((e: React.FormEvent<HTMLTextAreaElement>) => {
      const target = e.target as HTMLTextAreaElement;
      target.style.height = "auto";
      target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
    }, []);

    const canSend = text.trim().length > 0 && !disabled && !isLoading;

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col h-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60 transition-all duration-300",
          "hover:shadow-xl focus-within:shadow-xl focus-within:border-rose-200/50",
          className
        )}
      >
        {/* Toolbar */}
        {(toolbarItems || toolbarRightItems) && (
          <InputToolBar
            items={toolbarItems || []}
            rightItems={toolbarRightItems}
            onItemClick={onToolbarItemClick}
            className="border-b border-slate-100/50 px-3 py-2"
          />
        )}

        {/* Full-height textarea area */}
        <div className="flex-1 relative min-h-0 overflow-hidden">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            className={cn(
              "w-full h-full resize-none bg-transparent",
              "px-4 py-3 pr-14 text-base text-slate-700",
              "placeholder:text-slate-400",
              "focus:outline-none",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "overflow-y-auto"
            )}
          />

          {/* Send/Stop button at bottom right */}
          <div className="absolute bottom-3 right-3">
            {isLoading && onStop ? (
              <button
                type="button"
                onClick={onStop}
                className={cn(
                  "p-2.5 rounded-xl transition-all duration-150",
                  "bg-red-500 text-white",
                  "hover:bg-red-600",
                  "active:scale-95"
                )}
                title="停止"
              >
                <Square className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSend}
                disabled={!canSend}
                className={cn(
                  "p-2.5 rounded-xl transition-all duration-150",
                  "bg-gradient-to-r from-rose-400 to-purple-500 text-white",
                  "hover:shadow-lg hover:scale-105",
                  "active:scale-95",
                  "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                )}
                title="发送"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-slate-100/50">
          <p className="text-xs text-slate-400 text-center">
            Shift + Enter 换行 · 你说的话只有树洞知道
          </p>
        </div>
      </div>
    );
  }
);

InputPane.displayName = "InputPane";
