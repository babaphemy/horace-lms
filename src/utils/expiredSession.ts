import { signOut } from "next-auth/react"

let logoutPromise: Promise<void> | undefined

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
