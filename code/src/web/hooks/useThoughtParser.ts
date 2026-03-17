/**
 * useThoughtParser - 心理活动解析 Hook
 *
 * 功能：
 * - 从 AI 返回的文本中提取中文括号（）内的心理活动
 * - 将内容分割为普通文本和心理活动片段
 * - 使用 useMemo 缓存解析结果
 */

import { useMemo } from "react";
import type { ThoughtParseResult, ContentSegment } from "../types";

/**
 * 解析内容中的心理活动
 * @param content - 要解析的文本内容
 * @returns 解析结果，包含分段、心理活动列表和是否有心理活动
 */
export function useThoughtParser(content: string): ThoughtParseResult {
  return useMemo(() => {
    const segments: ContentSegment[] = [];
    const thoughts: string[] = [];

    // 使用正则匹配中文括号内容
    const regex = /（([^）]+)）/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      // 添加括号前的普通文本
      if (match.index > lastIndex) {
        const text = content.slice(lastIndex, match.index).trim();
        if (text) {
          segments.push({ type: "text", content: text });
        }
      }

      // 添加心理活动
      const thought = match[1];
      segments.push({ type: "thought", content: thought });
      thoughts.push(thought);

      lastIndex = match.index + match[0].length;
    }

    // 添加剩余文本
    if (lastIndex < content.length) {
      const text = content.slice(lastIndex).trim();
      if (text) {
        segments.push({ type: "text", content: text });
      }
    }

    return {
      segments: segments.length > 0 ? segments : [{ type: "text", content }],
      thoughts,
      hasThoughts: thoughts.length > 0,
    };
  }, [content]);
}

/**
 * 纯函数版本（不使用 Hook，用于非组件场景）
 */
export function parseThoughts(content: string): ThoughtParseResult {
  const segments: ContentSegment[] = [];
  const thoughts: string[] = [];

  const regex = /（([^）]+)）/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const text = content.slice(lastIndex, match.index).trim();
      if (text) {
        segments.push({ type: "text", content: text });
      }
    }

    const thought = match[1];
    segments.push({ type: "thought", content: thought });
    thoughts.push(thought);

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    const text = content.slice(lastIndex).trim();
    if (text) {
      segments.push({ type: "text", content: text });
    }
  }

  return {
    segments: segments.length > 0 ? segments : [{ type: "text", content }],
    thoughts,
    hasThoughts: thoughts.length > 0,
  };
}
