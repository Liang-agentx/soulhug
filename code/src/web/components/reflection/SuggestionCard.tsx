/**
 * SuggestionCard - 话术建议卡片
 *
 * 对话结束时显示的可操作收获卡片
 *
 * 功能：
 * - 展示对话中学到的内容
 * - 显示可复制的推荐话术
 * - 一键复制功能
 * - 提醒设置入口
 */

import { useState } from "react";
import { Copy, Check, RefreshCw, Bell } from "lucide-react";
import { copyToClipboard } from "../../utils/clipboard";
import type { SuggestionCardProps } from "../../types";

export function SuggestionCard({
  suggestions,
  script,
  onCopy,
  onRefresh,
  onSetReminder,
}: SuggestionCardProps) {
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleCopy = async () => {
    if (!script) return;

    const success = await copyToClipboard(script);
    if (success) {
      setCopied(true);
      onCopy?.(script);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    onRefresh?.();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div
      className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl
                    border-2 border-amber-200 shadow-md overflow-hidden"
    >
      {/* 标题栏 */}
      <div
        className="px-5 py-3 bg-gradient-to-r from-amber-100 to-orange-100
                      border-b border-amber-200"
      >
        <h3 className="font-bold text-amber-800 flex items-center gap-2">
          <span>📊</span>
          <span>对话收获</span>
        </h3>
      </div>

      <div className="p-5 space-y-5">
        {/* 学到的内容 */}
        {suggestions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-amber-700 mb-3 flex items-center gap-1.5">
              <span>✅</span>
              <span>你学到了什么</span>
            </h4>
            <ul className="space-y-2">
              {suggestions.map((item, i) => (
                <li
                  key={i}
                  className="text-sm text-slate-600 flex items-start gap-2"
                >
                  <span className="text-amber-400 mt-0.5 shrink-0">•</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 推荐话术 */}
        {script && (
          <div>
            <h4 className="text-sm font-medium text-amber-700 mb-3 flex items-center gap-1.5">
              <span>💬</span>
              <span>推荐话术</span>
            </h4>

            {/* 话术卡片 */}
            <div className="bg-white/80 rounded-xl p-4 border border-amber-100 shadow-sm">
              <p className="text-slate-700 leading-relaxed">
                <span className="text-amber-400">"</span>
                {script}
                <span className="text-amber-400">"</span>
              </p>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-2 mt-3">
              {/* 复制按钮 */}
              <button
                onClick={handleCopy}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5
                           rounded-xl text-sm font-medium transition-all
                           ${
                             copied
                               ? "bg-green-100 text-green-700 border border-green-200"
                               : "bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200 hover:border-amber-300"
                           }`}
              >
                {copied ? (
                  <>
                    <Check size={16} className="animate-copy-success" />
                    <span>已复制</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span>复制话术</span>
                  </>
                )}
              </button>

              {/* 换一个按钮 */}
              {onRefresh && (
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center justify-center gap-2 px-4 py-2.5
                             rounded-xl text-sm font-medium border border-amber-200
                             text-amber-600 hover:bg-amber-50 transition-all
                             disabled:opacity-50"
                >
                  <RefreshCw
                    size={16}
                    className={isRefreshing ? "animate-spin" : ""}
                  />
                  <span>换一个</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 底部提醒设置 */}
      {onSetReminder && (
        <div
          className="px-5 py-3 bg-amber-50 border-t border-amber-100
                        flex items-center justify-between"
        >
          <p className="text-xs text-amber-600 flex items-center gap-1.5">
            <Bell size={14} />
            <span>3天后提醒我问问效果</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={onSetReminder}
              className="text-xs px-3 py-1.5 bg-amber-200 text-amber-700
                         rounded-full hover:bg-amber-300 transition-colors
                         font-medium"
            >
              设置提醒
            </button>
            <button
              className="text-xs px-3 py-1.5 text-amber-500 hover:text-amber-700
                         transition-colors"
            >
              不用了
            </button>
          </div>
        </div>
      )}

      {/* 鼓励文字 */}
      <div className="px-5 py-3 bg-amber-50/50 border-t border-amber-100 text-center">
        <p className="text-xs text-amber-600">
          ✨ 不管你决定怎么做，我都在这里陪着你
        </p>
      </div>
    </div>
  );
}

export default SuggestionCard;
