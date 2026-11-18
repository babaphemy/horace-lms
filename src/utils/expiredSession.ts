import { signOut } from "next-auth/react"

let logoutPromise: Promise<void> | undefined

export const confirmMissingSession = async (
  signal: AbortSignal
): Promise<boolean> => {
  try {
    const response = await fetch("/api/auth/session", {
      credentials: "same-origin",
      cache: "no-store",
      signal,
    })
    if (!response.ok) return false
    const session: unknown = await response.json()
    return (
      session === null ||
      (typeof session === "object" &&
        !Array.isArray(session) &&
        Object.keys(session).length === 0)
    )
  } catch {
    // A failed request does not confirm that the session has expired.
    return false
  }
}

export const logoutExpiredSession = (): Promise<void> => {
  if (typeof window === "undefined") return Promise.resolve()

  if (!logoutPromise) {
    const returnTo = window.location.pathname + window.location.search
    const loginUrl = `/login?redirect=${encodeURIComponent(returnTo)}`
    logoutPromise = signOut({ redirect: false }).then(() => {
      window.location.replace(loginUrl)
    })
    logoutPromise = logoutPromise.catch((error) => {
      logoutPromise = undefined
      throw error
    })
  }

  return logoutPromise
}
