/**
 * 剪贴板工具函数
 *
 * 提供跨浏览器的复制功能，带降级方案
 */

/**
 * 复制文本到剪贴板
 * @param text - 要复制的文本
 * @returns 是否复制成功
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // 方案 1: 优先使用现代 Clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn("Clipboard API failed:", err);
      // 继续尝试降级方案
    }
  }

  // 方案 2: 降级到 execCommand（兼容旧浏览器）
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;

    // 设置样式，确保不影响页面布局
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "-9999px";
    textarea.style.opacity = "0";
    textarea.setAttribute("readonly", ""); // 防止移动设备弹出键盘

    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, text.length); // 兼容移动设备

    const result = document.execCommand("copy");
    document.body.removeChild(textarea);

    return result;
  } catch (err) {
    console.error("execCommand copy failed:", err);
    return false;
  }
}

/**
 * 检测浏览器是否支持 Clipboard API
 */
export function isClipboardSupported(): boolean {
  return !!(navigator.clipboard && window.isSecureContext);
}

/**
 * 复制带格式的文本（HTML）
 * 注意：仅在支持 Clipboard API 的浏览器中可用
 */
export async function copyRichText(
  text: string,
  html: string
): Promise<boolean> {
  if (!navigator.clipboard || !window.isSecureContext) {
    // 降级到纯文本复制
    return copyToClipboard(text);
  }

  try {
    const blob = new Blob([html], { type: "text/html" });
    const textBlob = new Blob([text], { type: "text/plain" });

    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": blob,
        "text/plain": textBlob,
      }),
    ]);
    return true;
  } catch (err) {
    console.warn("Rich text copy failed, falling back to plain text:", err);
    return copyToClipboard(text);
  }
}
