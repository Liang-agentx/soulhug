/**
 * useRoleState - 角色状态管理 Hook
 *
 * 功能：
 * - 检测 AI 响应中的角色切换标记
 * - 管理当前角色状态
 * - 检测角色转换事件，触发动画
 */

import { useState, useCallback, useMemo } from "react";
import type { RoleState, RoleDetectResult, RoleConfig } from "../types";

/** 角色配置常量 */
export const ROLE_CONFIGS: Record<RoleState, RoleConfig> = {
  soulhug: {
    avatar: "🌳",
    name: "树洞",
    color: "from-rose-100 to-purple-100",
    border: "",
  },
  "roleplay-mom": {
    avatar: "👩",
    name: "妈妈",
    color: "from-pink-100 to-rose-100",
    border: "border-2 border-pink-300",
  },
  "roleplay-dad": {
    avatar: "👨",
    name: "爸爸",
    color: "from-blue-100 to-indigo-100",
    border: "border-2 border-blue-300",
  },
};

/**
 * 检测内容中的角色状态
 * @param content - AI 响应内容
 * @param previousRole - 上一个角色状态
 * @returns 角色检测结果
 */
export function detectRoleState(
  content: string,
  previousRole: RoleState = "soulhug"
): RoleDetectResult {
  // 检测角色扮演开始标记
  // 匹配格式：---🎭 我现在扮演你的妈妈---
  const roleplayMatch = content.match(
    /---\s*🎭\s*我现在扮演你的(妈妈|爸爸|母亲|父亲)\s*---/
  );

  if (roleplayMatch) {
    const parentType = roleplayMatch[1];
    const isMom = parentType === "妈妈" || parentType === "母亲";
    const newRole = isMom ? "roleplay-mom" : "roleplay-dad";

    return {
      role: newRole,
      cleanContent: content.replace(/---\s*🎭[^-]*---/g, "").trim(),
      parentType: isMom ? "妈妈" : "爸爸",
      isTransition: previousRole !== newRole,
    };
  }

  // 检测结束扮演标记
  if (
    content.includes("结束扮演") ||
    content.includes("我是 SoulHug") ||
    content.includes("我是SoulHug") ||
    content.includes("回到树洞")
  ) {
    return {
      role: "soulhug",
      cleanContent: content,
      isTransition: previousRole !== "soulhug",
    };
  }

  // 检测是否在角色扮演中（通过中文括号心理活动判断）
  const hasThoughts = /（[^）]+）/.test(content);
  if (hasThoughts && !content.includes("SoulHug") && !content.includes("树洞")) {
    // 继续上一个角色扮演状态，或默认为妈妈
    const currentRole =
      previousRole !== "soulhug" ? previousRole : "roleplay-mom";
    return {
      role: currentRole,
      cleanContent: content,
      parentType: currentRole === "roleplay-mom" ? "妈妈" : "爸爸",
      isTransition: false,
    };
  }

  return {
    role: "soulhug",
    cleanContent: content,
    isTransition: false,
  };
}

/**
 * 角色状态管理 Hook
 */
export function useRoleState() {
  const [currentRole, setCurrentRole] = useState<RoleState>("soulhug");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTarget, setTransitionTarget] = useState<RoleState | null>(
    null
  );

  /**
   * 处理角色检测，触发转换
   */
  const handleRoleDetection = useCallback(
    (content: string): RoleDetectResult => {
      const result = detectRoleState(content, currentRole);

      if (result.isTransition) {
        setIsTransitioning(true);
        setTransitionTarget(result.role);
      }

      return result;
    },
    [currentRole]
  );

  /**
   * 完成角色转换动画后调用
   */
  const completeTransition = useCallback(() => {
    if (transitionTarget) {
      setCurrentRole(transitionTarget);
    }
    setIsTransitioning(false);
    setTransitionTarget(null);
  }, [transitionTarget]);

  /**
   * 取消角色转换
   */
  const cancelTransition = useCallback(() => {
    setIsTransitioning(false);
    setTransitionTarget(null);
  }, []);

  /**
   * 手动触发角色转换
   */
  const startTransition = useCallback(
    (target: RoleState) => {
      if (target === currentRole) return;
      setTransitionTarget(target);
      setIsTransitioning(true);
    },
    [currentRole]
  );

  /**
   * 获取当前角色配置
   */
  const roleConfig = useMemo(
    () => ROLE_CONFIGS[currentRole],
    [currentRole]
  );

  /**
   * 获取目标角色配置（转换中使用）
   */
  const targetRoleConfig = useMemo(
    () => (transitionTarget ? ROLE_CONFIGS[transitionTarget] : null),
    [transitionTarget]
  );

  return {
    currentRole,
    roleConfig,
    isTransitioning,
    transitionTarget,
    targetRoleConfig,
    handleRoleDetection,
    startTransition,
    completeTransition,
    cancelTransition,
    setCurrentRole,
  };
}

export default useRoleState;
