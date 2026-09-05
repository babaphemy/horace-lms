import DOMPurify from "dompurify"
import { useMemo } from "react"

const canUseBrowserDom = () =>
  typeof window !== "undefined" && typeof window.document !== "undefined"

export const sanitizeHtml = (html?: string | null) => {
  const dirtyHtml = html ?? ""

  if (!canUseBrowserDom()) {
    return ""
  }

  return DOMPurify.sanitize(dirtyHtml)
}

export const useSanitizedHtml = (html?: string | null, fallback = "") =>
  useMemo(
    () => (canUseBrowserDom() ? sanitizeHtml(html) : fallback),
    [fallback, html]
  )
