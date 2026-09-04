import DOMPurify from "dompurify"
import { useEffect, useState } from "react"

const canUseBrowserDom = () =>
  typeof window !== "undefined" && typeof window.document !== "undefined"

export const sanitizeHtml = (html?: string | null) => {
  const dirtyHtml = html ?? ""

  if (!canUseBrowserDom()) {
    return ""
  }

  return DOMPurify.sanitize(dirtyHtml)
}

export const useSanitizedHtml = (html?: string | null, fallback = "") => {
  const [sanitizedHtml, setSanitizedHtml] = useState(fallback)

  useEffect(() => {
    setSanitizedHtml(canUseBrowserDom() ? sanitizeHtml(html) : fallback)
  }, [fallback, html])

  return sanitizedHtml
}
