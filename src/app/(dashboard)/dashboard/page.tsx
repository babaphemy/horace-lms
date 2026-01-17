"use client"
import {
  activities,
  dashboardStat,
  events,
  recentCourses,
  addThumbnail,
  uploadImageToS3,
} from "@/app/api/rest"
import ActivityCard from "@/components/lms/ActivityCard"
import EventCard from "@/components/lms/EventCard"
import StatsGrid from "@/components/lms/StatsGrid"
import { Activity, Event, tCourse } from "@/types/types"
import { notifyError, notifySuccess } from "@/utils/notification"
import {
  Analytics,
  Assignment,
  MoreVert,
  People,
  Person,
  Star,
  VideoLibrary,
  PhotoCamera,
  Edit,
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
  CircularProgress,
  Tooltip,
} from "@mui/material"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import React, { useMemo, useState, useRef } from "react"
import { useQuery, useMutation, useQueryClient } from "react-query"
import PlaceholderSVG from "@/components/lms/courseEditor/PlaceholderSvg"
import QuizIcon from "@mui/icons-material/Quiz"
const DashboardPage = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const userId = session?.user?.id
  const queryClient = useQueryClient()
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const [uploadingCourseId, setUploadingCourseId] = useState<string | null>(
    null
  )
  const [selectedCourseAuthorId, setSelectedCourseAuthorId] = useState<
    string | null
  >(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    cid: string
  ) => {
    setAnchorEl(event.currentTarget)
    setSelectedCourseId(cid)
    setSelectedCourseAuthorId(
      recents.find((c: tCourse) => c.id === cid)?.author?.id
    )
  }

  const handleMenuClose = (type: string) => {
    switch (type) {
      case "edit":
        router.push(`/dashboard/courses/${selectedCourseId}`)
        break
      case "quiz":
        router.push(`/dashboard/courses/${selectedCourseId}/quiz/add`)
        break
      case "quizlist":
        router.push(`/dashboard/courses/${selectedCourseId}/quiz`)
        break
      case "analytics":
        router.push(`/dashboard/courses/${selectedCourseId}/report`)
        break
      case "thumbnail":
        handleThumbnailUpload()
        break
      default:
        break
    }
    setAnchorEl(null)
  }

  const handleThumbnailUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const { mutate: updateThumbnail } = useMutation({
    mutationFn: addThumbnail,
    onSuccess: () => {
      notifySuccess("Thumbnail uploaded successfully!")
      queryClient.invalidateQueries(["recentCourses"])
      setUploadingCourseId(null)
    },
    onError: () => {
      notifyError("Failed to upload thumbnail. Please try again.")
      setUploadingCourseId(null)
    },
  })

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // TODO: if replace image delete old image from S3
    const file = event.target.files?.[0]
    if (!file || !selectedCourseId) return

    if (!file.type.startsWith("image/")) {
      notifyError("Please select a valid image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      notifyError("Image size must be less than 5MB")
      return
    }

    setUploadingCourseId(selectedCourseId)

    try {
      const uploadUrl = await uploadImageToS3(file)
      updateThumbnail({
        id: selectedCourseId,
        thumbnail: uploadUrl,
        courseName: "",
        user: userId || "",
        overview: "",
      })
    } catch {
      notifyError("Failed to upload image. Please try again.")
      setUploadingCourseId(null)
    }

    // Reset file input
    if (event.target) {
      event.target.value = ""
    }
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
  const { data: stats } = useQuery({
    queryFn: () => dashboardStat(userId as string),
    queryKey: ["dashboardStat", userId],
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
    queryFn: () => recentCourses(0, 10, stats?.organizationId),
    queryKey: [
      "recentCourses",
      dateRange.start,
      dateRange.end,
      stats?.organizationId,
    ],
    enabled: !!stats?.organizationId,
  })

  if (!userId) return null

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
                {recents?.length > 0 && (
                  <Button variant="outlined" size="small">
                    View All
                  </Button>
                )}
              </Box>

              {recents?.map((course: tCourse) => (
                <Box key={course.id}>
                  <Box sx={{ mb: 3, "&:last-child": { mb: 0 } }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          width: 60,
                          height: 40,
                          borderRadius: 1,
                          overflow: "hidden",
                          cursor: "pointer",
                          "&:hover .upload-overlay": {
                            opacity: 1,
                          },
                        }}
                        onClick={() => {
                          setSelectedCourseId(course.id)
                          handleThumbnailUpload()
                        }}
                      >
                        {course.thumbnail ? (
                          <Image
                            src={course.thumbnail}
                            alt={course.courseName}
                            fill
                            style={{
                              objectFit: "cover",
                            }}
                            sizes="60px"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = "none"
                            }}
                          />
                        ) : (
                          <PlaceholderSVG />
                        )}

                        <Box
                          className="upload-overlay"
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 0,
                            transition: "opacity 0.2s ease",
                          }}
                        >
                          {uploadingCourseId === course.id ? (
                            <CircularProgress
                              size={20}
                              sx={{ color: "white" }}
                            />
                          ) : (
                            <PhotoCamera
                              sx={{ color: "white", fontSize: 20 }}
                            />
                          )}
                        </Box>
                      </Box>

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
                              {course?.assetCount?.students || 0} students
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
                              {course?.assetCount?.rating}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Tooltip title="Course options">
                        <IconButton
                          onClick={(e) => handleMenuClick(e, course.id)}
                        >
                          <MoreVert />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
              ))}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => handleMenuClose("")}
              >
                {userId === selectedCourseAuthorId && (
                  <MenuItem onClick={() => handleMenuClose("edit")}>
                    <Edit sx={{ mr: 1, fontSize: 18 }} />
                    Edit Course
                  </MenuItem>
                )}
                <MenuItem onClick={() => handleMenuClose("thumbnail")}>
                  <PhotoCamera sx={{ mr: 1, fontSize: 18 }} />
                  Change Thumbnail
                </MenuItem>
                <MenuItem onClick={() => handleMenuClose("quiz")}>
                  <QuizIcon sx={{ mr: 1, fontSize: 18 }} />
                  Add Quiz
                </MenuItem>
                <MenuItem onClick={() => handleMenuClose("quizlist")}>
                  <Assignment sx={{ mr: 1, fontSize: 18 }} />
                  Quiz List
                </MenuItem>
                <MenuItem onClick={() => handleMenuClose("analytics")}>
                  <Analytics sx={{ mr: 1, fontSize: 18 }} />
                  View Analytics
                </MenuItem>
                {/* <MenuItem onClick={() => handleMenuClose("students")}>
                  <People sx={{ mr: 1, fontSize: 18 }} />
                  Manage Students
                </MenuItem> */}
              </Menu>
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
                    onClick={() => router.push("/dashboard/courses/add")}
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
                    <Typography variant="body2">Assignment</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <EventCard upcomingEvents={upcomingEvents?.content as Event[]} />
          <ActivityCard
            recentActivity={recentActivity?.content as Activity[]}
          />
        </Grid>
      </Grid>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        style={{ display: "none" }}
      />
    </Container>
  )
}

export default DashboardPage
