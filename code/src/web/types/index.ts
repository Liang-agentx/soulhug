/**
 * SoulHug 类型定义
 */

// ============================================================================
// 角色相关类型
// ============================================================================

/** 角色状态：SoulHug助手 或 扮演父母 */
export type RoleState = "soulhug" | "roleplay-mom" | "roleplay-dad";

/** 角色配置 */
export interface RoleConfig {
  avatar: string;
  name: string;
  color: string;
  border: string;
}

/** 角色切换事件 */
export interface RoleTransitionEvent {
  from: RoleState;
  to: RoleState;
  parentType?: string;
}

// ============================================================================
// 情绪相关类型
// ============================================================================

/** 情绪类型 */
export type EmotionType = "neutral" | "angry" | "sad" | "anxious" | "understood" | "hopeful";

/** 情绪样式配置 */
export interface EmotionStyle {
  bg: string;
  label: string;
}

// ============================================================================
// 内容解析类型
// ============================================================================

/** 内容片段类型 */
export type SegmentType = "text" | "thought";

/** 解析后的内容片段 */
export interface ContentSegment {
  type: SegmentType;
  content: string;
}

/** 心理活动解析结果 */
export interface ThoughtParseResult {
  segments: ContentSegment[];
  thoughts: string[];
  hasThoughts: boolean;
}

/** 角色检测结果 */
export interface RoleDetectResult {
  role: RoleState;
  cleanContent: string;
  parentType?: string;
  isTransition: boolean;
}

// ============================================================================
// 反思卡片类型
// ============================================================================

/** 反思部分 */
export interface ReflectionSection {
  title: string;
  content: string;
}

/** 反思卡片数据 */
export interface ReflectionData {
  isReflection: boolean;
  title?: string;
  sections: ReflectionSection[];
  suggestions: string[];
  script?: string; // 推荐话术
}

// ============================================================================
// 组件 Props 类型
// ============================================================================

/** 心理活动气泡 Props */
export interface ThoughtBubbleProps {
  thoughts: string[];
  defaultExpanded?: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;
}

/** 角色切换动画 Props */
export interface RoleTransitionProps {
  from: RoleState;
  to: RoleState;
  parentType?: string;
  onComplete?: () => void;
}

/** 话术建议卡片 Props */
export interface SuggestionCardProps {
  suggestions: string[];
  script?: string;
  onCopy?: (text: string) => void;
  onRefresh?: () => void;
  onSetReminder?: () => void;
}

/** 反思卡片 Props */
export interface ReflectionCardProps {
  content: string;
  reflection: ReflectionData;
}
