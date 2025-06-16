"use client"
import {
  Analytics,
  Assignment,
  CalendarToday,
  MoreVert,
  Notifications,
  People,
  Person,
  School,
  Star,
  Timer,
  TrendingUp,
  VideoLibrary,
} from "@mui/icons-material"
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material"
import { useSession } from "next-auth/react"
import React, { useState } from "react"

const DashboardPage = () => {
  const { data: session } = useSession()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const stats = [
    {
      title: "Total Courses",
      value: "4",
      change: "+12%",
      icon: <School sx={{ fontSize: 32, color: "#1976d2" }} />,
      color: "#e3f2fd",
    },
    {
      title: "Active Students",
      value: "7",
      change: "+8%",
      icon: <People sx={{ fontSize: 32, color: "#388e3c" }} />,
      color: "#e8f5e8",
    },
    {
      title: "Completed Lessons",
      value: "6",
      change: "+23%",
      icon: <Assignment sx={{ fontSize: 32, color: "#f57c00" }} />,
      color: "#fff3e0",
    },
    {
      title: "Revenue",
      value: "$450",
      change: "+15%",
      icon: <TrendingUp sx={{ fontSize: 32, color: "#7b1fa2" }} />,
      color: "#f3e5f5",
    },
  ]

  const recentCourses = [
    {
      id: 1,
      title: "Advanced React Development",
      thumbnail: "https://via.placeholder.com/60x40/1976d2/ffffff?text=React",
      progress: 75,
      students: 156,
      rating: 4.8,
      status: "Published",
    },
    {
      id: 2,
      title: "UI/UX Design Fundamentals",
      thumbnail: "https://via.placeholder.com/60x40/f57c00/ffffff?text=UI",
      progress: 45,
      students: 89,
      rating: 4.6,
      status: "Draft",
    },
    {
      id: 3,
      title: "JavaScript Masterclass",
      thumbnail: "https://via.placeholder.com/60x40/388e3c/ffffff?text=JS",
      progress: 90,
      students: 234,
      rating: 4.9,
      status: "Published",
    },
  ]

  const upcomingEvents = [
    {
      title: "Live Q&A Session",
      time: "2:00 PM Today",
      course: "React Development",
      attendees: 45,
    },
    {
      title: "Course Review Meeting",
      time: "Tomorrow 10:00 AM",
      course: "UI/UX Design",
      attendees: 8,
    },
    {
      title: "Student Presentation",
      time: "Friday 3:00 PM",
      course: "JavaScript",
      attendees: 23,
    },
  ]

  const recentActivity = [
    {
      user: "Sarah Johnson",
      action: "completed",
      course: "React Hooks Module",
      time: "2 hours ago",
      avatar: "SJ",
    },
    {
      user: "Mike Chen",
      action: "enrolled in",
      course: "Advanced JavaScript",
      time: "3 hours ago",
      avatar: "MC",
    },
    {
      user: "Emma Wilson",
      action: "submitted assignment for",
      course: "UI/UX Design",
      time: "5 hours ago",
      avatar: "EW",
    },
    {
      user: "David Brown",
      action: "left a 5-star review for",
      course: "React Development",
      time: "1 day ago",
      avatar: "DB",
    },
  ]

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Welcome back, {session?.user?.firstname}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here&apos;s what&apos;s happening with your courses today
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
            <Card
              sx={{
                height: "100%",
                background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}88 100%)`,
                border: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography variant="h4" component="div" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                      sx={{ mb: 1 }}
                    >
                      {stat.title}
                    </Typography>
                    <Chip
                      label={stat.change}
                      size="small"
                      color="success"
                      sx={{ fontSize: "0.75rem" }}
                    />
                  </Box>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: "rgba(255,255,255,0.8)",
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Courses */}
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
                <Button variant="outlined" size="small">
                  View All
                </Button>
              </Box>

              {recentCourses.map((course) => (
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
                      alt={course.title}
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
                          {course.title}
                        </Typography>
                        <Chip
                          label={course.status}
                          size="small"
                          color={
                            course.status === "Published"
                              ? "success"
                              : "warning"
                          }
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
                            {course.students} students
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
                            {course.rating}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
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
                      </Box>
                    </Box>
                    <IconButton onClick={handleMenuClick}>
                      <MoreVert />
                    </IconButton>
                  </Box>
                  {course.id !== recentCourses[recentCourses.length - 1].id && (
                    <Divider />
                  )}
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
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

        {/* Sidebar */}
        <Grid size={{ xs: 12, lg: 4 }}>
          {/* Upcoming Events */}
          <Card sx={{ mb: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
              >
                <CalendarToday color="primary" />
                <Typography variant="h6" component="h2" fontWeight="bold">
                  Upcoming Events
                </Typography>
              </Box>
              <List sx={{ p: 0 }}>
                {upcomingEvents.map((event, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: "primary.light",
                            width: 32,
                            height: 32,
                          }}
                        >
                          <Timer sx={{ fontSize: 16 }} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={event.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {event.time}
                            </Typography>
                            <Typography variant="body2" color="primary">
                              {event.course} • {event.attendees} attendees
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < upcomingEvents.length - 1 && (
                      <Divider variant="inset" component="li" />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card sx={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
              >
                <Notifications color="secondary" />
                <Typography variant="h6" component="h2" fontWeight="bold">
                  Recent Activity
                </Typography>
              </Box>
              <List sx={{ p: 0 }}>
                {recentActivity.map((activity, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar
                          sx={{ width: 32, height: 32, fontSize: "0.875rem" }}
                        >
                          {activity.avatar}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2">
                            <strong>{activity.user}</strong> {activity.action}{" "}
                            <strong>{activity.course}</strong>
                          </Typography>
                        }
                        secondary={activity.time}
                      />
                    </ListItem>
                    {index < recentActivity.length - 1 && (
                      <Divider variant="inset" component="li" />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
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
