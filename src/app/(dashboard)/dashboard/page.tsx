"use client"
import {
  activities,
  dashboardStat,
  events,
  recentCourses,
} from "@/app/api/rest"
import ActivityCard from "@/components/lms/ActivityCard"
import EventCard from "@/components/lms/EventCard"
import StatsGrid from "@/components/lms/StatsGrid"
import { Activity, Event, tCourse } from "@/types/types"
import {
  Analytics,
  Assignment,
  MoreVert,
  People,
  Person,
  Star,
  VideoLibrary,
} from "@mui/icons-material"
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material"
import { useSession } from "next-auth/react"
import React, { useMemo, useState } from "react"
import { useQuery } from "react-query"

const DashboardPage = () => {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const { data: recentActivity } = useQuery({
    queryFn: () => activities(userId as string),
    queryKey: ["recentActivity", userId],
    enabled: !!userId,
  })
  const { data: upcomingEvents } = useQuery({
    queryFn: () => events(userId as string),
    queryKey: ["upcomingEvents", userId],
    enabled: !!userId,
  })
  const dateRange = useMemo(() => {
    const today = new Date()
    const fourWeeksAgo = new Date()
    fourWeeksAgo.setDate(today.getDate() - 28)

    return {
      start: fourWeeksAgo.toISOString().slice(0, 19),
      end: today.toISOString().slice(0, 19),
    }
  }, [])
  const { data: recents } = useQuery({
    queryFn: () => recentCourses(dateRange.start, dateRange.end),
    queryKey: ["recentCourses", dateRange.start, dateRange.end],
  })
  const { data: stats } = useQuery({
    queryFn: () => dashboardStat(userId as string),
    queryKey: ["dashboardStat", userId],
    enabled: !!userId,
  })

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Welcome back, {session?.user?.firstname || "Horace User"}! 👋
        </Typography>
      </Box>

      <StatsGrid stats={stats} />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ mb: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6" component="h2" fontWeight="bold">
                  Your Courses
                </Typography>
                {stats?.totalCourses && (
                  <Button variant="outlined" size="small">
                    View All
                  </Button>
                )}
              </Box>

              {recents?.map((course: tCourse) => (
                <Box key={course.id} sx={{ mb: 3, "&:last-child": { mb: 0 } }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Box
                      component="img"
                      src={course.thumbnail}
                      alt={course.courseName}
                      sx={{
                        width: 60,
                        height: 40,
                        borderRadius: 1,
                        objectFit: "cover",
                      }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight="medium">
                          {course.courseName}
                        </Typography>
                        <Chip
                          label={course.status}
                          size="small"
                          color={course.status ? "success" : "warning"}
                          variant="outlined"
                        />
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Person
                            sx={{ fontSize: 16, color: "text.secondary" }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {course.assetCount.students} students
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Star sx={{ fontSize: 16, color: "#ffc107" }} />
                          <Typography variant="body2" color="text.secondary">
                            {course.assetCount.rating}
                          </Typography>
                        </Box>
                      </Box>
                      {/* <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <LinearProgress
                          variant="determinate"
                          value={course.progress}
                          sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {course.progress}%
                        </Typography>
                      </Box> */}
                    </Box>
                    <IconButton onClick={handleMenuClick}>
                      <MoreVert />
                    </IconButton>
                  </Box>
                  {/* {course.id !== recentCourses[recentCourses.length - 1].id && (
                    <Divider />
                  )} */}
                </Box>
              ))}
            </CardContent>
          </Card>

          <Card sx={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Typography
                variant="h6"
                component="h2"
                fontWeight="bold"
                sx={{ mb: 3 }}
              >
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        backgroundColor: "primary.light",
                        color: "white",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <VideoLibrary sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="body2">Create Course</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        backgroundColor: "secondary.light",
                        color: "white",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Analytics sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="body2">View Analytics</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        backgroundColor: "success.light",
                        color: "white",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <People sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="body2">Manage Students</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        backgroundColor: "warning.light",
                        color: "white",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Assignment sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="body2">Create Assignment</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <EventCard upcomingEvents={upcomingEvents as Event[]} />

          <ActivityCard
            recentActivity={recentActivity?.content as Activity[]}
          />
        </Grid>
      </Grid>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Edit Course</MenuItem>
        <MenuItem onClick={handleMenuClose}>View Analytics</MenuItem>
        <MenuItem onClick={handleMenuClose}>Manage Students</MenuItem>
        <MenuItem onClick={handleMenuClose}>Course Settings</MenuItem>
      </Menu>
    </Container>
  )
}

export default DashboardPage
