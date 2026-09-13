"use client"

import { getLabNotificationsKey } from "@/utils/labs"
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded"
import { Alert, Box, Chip, Container, Stack, Typography } from "@mui/material"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

const NotificationPage = () => {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<string[]>([])

  useEffect(() => {
    const userId = session?.user?.id || "guest"
    const saved = window.localStorage.getItem(getLabNotificationsKey(userId))
    setNotifications(saved ? (JSON.parse(saved) as string[]) : [])
  }, [session?.user?.id])

  return (
    <Box sx={{ bgcolor: "#f6fafb", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
          <NotificationsRoundedIcon color="primary" />
          <Typography variant="h4" fontWeight={900}>
            Notifications
          </Typography>
          <Chip label={notifications.length} size="small" />
        </Stack>

        {notifications.length === 0 ? (
          <Alert severity="info">No notifications yet.</Alert>
        ) : (
          <Stack spacing={2}>
            {notifications.map((notification, index) => (
              <Alert severity="success" key={`${notification}-${index}`}>
                {notification}
              </Alert>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  )
}

export default NotificationPage
