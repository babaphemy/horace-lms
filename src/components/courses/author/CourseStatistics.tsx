import React from "react"
import { Card, CardContent, Typography, Grid, Box } from "@mui/material"
import { MenuBook, Quiz, Science, Download, Note } from "@mui/icons-material"
import { tCourse } from "@/types/types"

interface CourseStatisticsProps {
  assetCount: tCourse["assetCount"]
}

export const CourseStatistics: React.FC<CourseStatisticsProps> = ({
  assetCount,
}) => {
  const stats = [
    {
      icon: <MenuBook color="primary" />,
      label: "Total Lessons",
      value: assetCount?.lessonCount,
      color: "primary",
    },
    {
      icon: <Quiz color="secondary" />,
      label: "Quizzes",
      value: assetCount?.quizCount,
      color: "secondary",
    },
    {
      icon: <Science color="success" />,
      label: "Labs",
      value: assetCount?.labCount,
      color: "success",
    },
    {
      icon: <Note color="info" />,
      label: "Notes",
      value: assetCount?.noteCount,
      color: "info",
    },
    {
      icon: <Download color="warning" />,
      label: "Downloads",
      value: assetCount?.downloadCount,
      color: "warning",
    },
  ]

  return (
    <Card sx={{ width: "100%", height: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Course Content & Statistics
        </Typography>

        {/* Asset Statistics */}
        <Grid container spacing={2}>
          {stats.map((stat, index) => (
            <Grid sx={{ xs: 6, sm: 6, md: 2.4 }} key={index}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                {stat.icon}
                <Typography
                  variant="h4"
                  sx={{ mt: 1, color: `${stat.color}.main` }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}
