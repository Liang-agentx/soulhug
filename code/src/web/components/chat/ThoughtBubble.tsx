/**
 * ThoughtBubble - 心理活动可展开气泡
 *
 * 核心差异化组件：将父母的内心想法以视觉突出的方式展示
 *
 * 功能：
 * - 折叠状态：显示"点击查看内心想法"提示
 * - 展开状态：显示详细心理活动内容
 * - 带展开/折叠动画
 */

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { ThoughtBubbleProps } from "../../types";

export function ThoughtBubble({
  thoughts,
  defaultExpanded = false,
  onExpand,
  onCollapse,
}: ThoughtBubbleProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);

    if (newState) {
      onExpand?.();
    } else {
      onCollapse?.();
    }
  };

  if (thoughts.length === 0) return null;

  return (
    <div className="ml-4 mt-2">
      {/* 折叠状态：显示提示按钮 */}
      {!isExpanded && (
        <button
          onClick={handleToggle}
          className="group flex items-center gap-2 px-4 py-2.5 bg-purple-50/80 hover:bg-purple-100
                     rounded-full border border-purple-200 hover:border-purple-300
                     text-purple-600 text-sm transition-all hover:scale-[1.02] hover:shadow-sm"
        >
          <span className="text-base">💭</span>
          <span className="font-medium">
            点击查看内心想法
            {thoughts.length > 1 && (
              <span className="ml-1 text-purple-400">({thoughts.length}条)</span>
            )}
          </span>
          <ChevronDown
            size={16}
            className="text-purple-400 group-hover:text-purple-600 transition-colors"
          />
        </button>
      )}

      {/* 展开状态：显示详情 */}
      {isExpanded && (
        <div className="animate-slide-up">
          <div
            className="bg-gradient-to-br from-purple-50 to-indigo-50
                        rounded-2xl border-2 border-purple-200 shadow-sm overflow-hidden"
          >
            {/* 标题栏 */}
            <div className="flex items-center justify-between px-5 py-3 bg-purple-100/50 border-b border-purple-200/50">
              <div className="flex items-center gap-2">
                <span className="text-xl">💭</span>
                <span className="text-purple-700 font-medium">她其实在想...</span>
              </div>
              <button
                onClick={handleToggle}
                className="p-1.5 rounded-full hover:bg-purple-200/50 text-purple-400
                           hover:text-purple-600 transition-colors"
              >
                <ChevronUp size={18} />
              </button>
            </div>

            {/* 心理活动内容 */}
            <div className="p-5 space-y-4">
              {thoughts.map((thought, i) => (
                <div key={i} className="relative pl-4">
                  {/* 装饰线 */}
                  <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-purple-200 rounded-full" />

                  <p className="text-purple-700 leading-relaxed">
                    <span className="text-purple-400 italic">"</span>
                    <span className="italic">{thought}</span>
                    <span className="text-purple-400 italic">"</span>
                  </p>
                </div>
              ))}
            </div>

            {/* 底部提示 */}
            <div className="px-5 py-3 bg-purple-50/50 border-t border-purple-100">
              <p className="text-xs text-purple-500 flex items-center gap-1.5">
                <span>✨</span>
                <span>这就是"刀子嘴豆腐心"——爱藏在严厉的话语背后</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 单条心理活动气泡（内联显示，用于消息中间）
 */
export function InlineThoughtBubble({ content }: { content: string }) {
  return (
    <div className="ml-4 relative">
      {/* 连接线 */}
      <div className="absolute -left-3 top-4 w-3 h-px bg-purple-200" />

      {/* 气泡主体 */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 px-5 py-4 rounded-2xl border-2 border-purple-200 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="text-xl shrink-0 mt-0.5">💭</span>
          <div>
            <p className="text-xs text-purple-500 font-medium mb-1.5">内心的声音</p>
            <p className="text-purple-700 leading-relaxed italic">
              "{content}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThoughtBubble;
