import DOMPurify from "dompurify"

export const sanitizeHtml = (html?: string | null) =>
  DOMPurify.sanitize(html ?? "")
