import DOMPurify from "dompurify"
import { useEffect, useState } from "react"

export const sanitizeHtml = (html?: string | null) => {
  const dirtyHtml = html ?? ""

  if (typeof window === "undefined") {
    return ""
  }

  return DOMPurify.sanitize(dirtyHtml)
}

export const useSanitizedHtml = (html?: string | null) => {
  const [sanitizedHtml, setSanitizedHtml] = useState("")

  useEffect(() => {
    setSanitizedHtml(sanitizeHtml(html))
  }, [html])

  return sanitizedHtml
}
