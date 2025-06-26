import { Activity } from "@/types/types"
import { Notifications } from "@mui/icons-material"
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material"
import React from "react"
const getActivityTypeColor = (activityType: string): string => {
  const colorMap: Record<string, string> = {
    LOGIN: "#4CAF50",
    LOGOUT: "#FF9800",
    COURSE_COMPLETE: "#2196F3",
    LESSON_COMPLETE: "#9C27B0",
    QUIZ_COMPLETE: "#FF5722",
    ENROLLMENT: "#00BCD4",
    DEFAULT: "#757575",
  }

  return colorMap[activityType.toUpperCase()] || colorMap.DEFAULT
}
const formatActivityTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInMinutes < 1) return "Just now"
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInHours < 24) return `${diffInHours}h ago`
  if (diffInDays < 7) return `${diffInDays}d ago`

  return date.toLocaleDateString()
}
const ActivityCard = ({ recentActivity }: { recentActivity: Activity[] }) => {
  return (
    <Card sx={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <Notifications color="secondary" />
          <Typography variant="h6" component="h2" fontWeight="bold">
            Recent Activity
          </Typography>
        </Box>

        {recentActivity?.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography color="text.secondary">No recent activity</Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {recentActivity?.map((activity: Activity, index: number) => (
              <React.Fragment key={activity.id || index}>
                <ListItem sx={{ px: 0, py: 1.5 }}>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        fontSize: "0.875rem",
                        bgcolor: getActivityTypeColor(activity.activityType),
                      }}
                    >
                      {activity.userId.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>User {activity.userId}</strong>{" "}
                        {activity.action}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        {activity.description && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mb: 0.5 }}
                          >
                            {activity.description}
                          </Typography>
                        )}
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                          }}
                        >
                          <Chip
                            label={activity.activityType.replace("_", " ")}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: "0.7rem",
                              height: 20,
                              borderColor: getActivityTypeColor(
                                activity.activityType
                              ),
                              color: getActivityTypeColor(
                                activity.activityType
                              ),
                            }}
                          />
                          {activity.createdOn && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {formatActivityTime(activity.createdOn)}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {index < recentActivity.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  )
}
export default ActivityCard
