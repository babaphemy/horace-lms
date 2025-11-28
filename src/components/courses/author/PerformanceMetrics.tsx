import React from "react"
import { Grid, Card, CardContent, Typography, Box } from "@mui/material"
import {
  AccessTime,
  Speed,
  CalendarToday,
  Assessment,
} from "@mui/icons-material"

interface PerformanceMetricsProps {
  courseProgress: {
    progress: number
    completedLessons: number
    totalLessons: number
    lastActivity: string
  }
  overallPerformance: {
    completionRate: number
    averageQuizScore: number
    timeSpent: number
    estimatedTimeRemaining: number
  }
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  courseProgress,
  overallPerformance,
}) => {
  const metrics = [
    {
      icon: <Speed color="primary" />,
      title: "Completion Rate",
      value: `${overallPerformance.completionRate}%`,
      description: "Course completion progress",
    },
    {
      icon: <Assessment color="secondary" />,
      title: "Avg Quiz Score",
      value: `${overallPerformance.averageQuizScore}%`,
      description: "Across all assessments",
    },
    {
      icon: <AccessTime color="success" />,
      title: "Time Spent",
      value:
        overallPerformance.timeSpent > 0
          ? `${Math.round(overallPerformance.timeSpent / 60)}h`
          : "Not tracked",
      description: "Total learning time",
    },
    {
      icon: <CalendarToday color="info" />,
      title: "Last Activity",
      value: courseProgress.lastActivity
        ? new Date(courseProgress.lastActivity).toLocaleDateString()
        : "No activity",
      description: "Most recent engagement",
    },
  ]

  return (
    <Grid container spacing={2}>
      {metrics.map((metric) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={metric.title}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                {metric.icon}
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {metric.title}
                </Typography>
              </Box>
              <Typography variant="h4" gutterBottom>
                {metric.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {metric.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
