"use client"

import { useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useQueryClient } from "react-query"
import {
  confirmMissingSession,
  logoutExpiredSession,
} from "@/utils/expiredSession"
import { notifyError } from "@/utils/notification"

export default function SessionExpiryHandler() {
  const { status } = useSession()
  const wasAuthenticated = useRef(false)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (status === "authenticated") {
      wasAuthenticated.current = true
    } else if (status === "unauthenticated" && wasAuthenticated.current) {
      const controller = new AbortController()
      void confirmMissingSession(controller.signal).then((confirmed) => {
        if (!confirmed || controller.signal.aborted) return
        wasAuthenticated.current = false
        queryClient.clear()
        void logoutExpiredSession().catch(() => {
          notifyError("We could not sign you out. Please reload and try again.")
        })
      })
      return () => controller.abort()
    }
  }, [status, queryClient])

  return null
}
