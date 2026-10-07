import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Remove HTML tags, styles, scripts and decode common HTML entities for clean plain text display
 */
export function stripHtml(htmlOrText: string): string {
  if (!htmlOrText) return "";
  return htmlOrText
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<img[^>]*>/gi, "")
    .replace(/&lt;\s*\/?\s*br\s*\/?\s*&gt;/gi, " ")
    .replace(/<\s*\/?\s*br\s*\/?\s*>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Get clean plain text excerpt of specified maximum length
 */
export function getCleanExcerpt(htmlOrText: string, maxLen = 160): string {
  const plainText = stripHtml(htmlOrText);
  if (!plainText) return "";
  if (plainText.length <= maxLen) return plainText;
  return plainText.slice(0, maxLen).trim() + "...";
}

/**
 * Normalize and beautify product description containing HTML, malformed br tags (like </br>), or plain text
 */
export function formatProductDescription(htmlOrText: string): string {
  if (!htmlOrText) return "";

  let formatted = htmlOrText;

  // 1. Convert malformed br variants (</br>, <br/>, &lt;/br&gt;) to standard <br />
  formatted = formatted
    .replace(/&lt;\s*\/?\s*br\s*\/?\s*&gt;/gi, "<br />")
    .replace(/<\s*\/?\s*br\s*\/?\s*>/gi, "<br />");

  // 2. Normalize separator dashes / underscores like ___________ or -----------
  formatted = formatted.replace(
    /([_\-–—]{4,})/g,
    '<hr class="my-3 border-neutral-200" />'
  );

  // 3. Compress excessive consecutive <br /> (more than 2) to maximum 2
  formatted = formatted.replace(/(<br\s*\/?>\s*){3,}/gi, "<br /><br />");

  // 4. If content has standard line breaks (\n) and no block tags (<p>, <div>), convert \n to <br />
  if (!/<(?:p|div|table|ul|ol|li)[^>]*>/i.test(formatted)) {
    formatted = formatted.replace(/\r?\n/g, "<br />");
    formatted = formatted.replace(/(<br\s*\/?>\s*){3,}/gi, "<br /><br />");
  }

  return formatted.trim();
}
