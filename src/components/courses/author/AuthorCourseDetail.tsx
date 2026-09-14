"use client"
import React from "react"
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material"
import {
  People,
  School,
  Assessment,
  Schedule,
  ArrowBack,
  Edit,
} from "@mui/icons-material"
import DOMPurify from "dompurify"
import Link from "next/link"
import { CourseStatistics } from "./CourseStatistics"
import useCourse from "@/hooks/useCourse"
import { useSession } from "next-auth/react"
import { useParams } from "next/navigation"
import { StudentsList } from "./StudentsList"
import { useQuery } from "react-query"
import { registeredStudents } from "@/app/api/rest"

const AuthorCourseDetail: React.FC = () => {
  const params = useParams()
  const { id } = params
  const { data: session } = useSession()
  const userId = session?.user.id
  const {
    data: course,
    isLoading,
    error,
  } = useCourse(id as string, userId as string)

  const { data } = useQuery({
    queryKey: ["registered-students", id],
    queryFn: () => registeredStudents(id as string),
    enabled: !!id,
  })
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={400}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load course details: {(error as Error).message}
      </Alert>
    )
  }

  if (!course) {
    return <Alert severity="info">Course not found.</Alert>
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            mb: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Button startIcon={<ArrowBack />} component={Link} href="/dashboard">
            Back to Dashboard
          </Button>

          <Button
            startIcon={<Edit />}
            component={Link}
            variant="contained"
            href={`/dashboard/courses/add?cid=${course.id}`}
          >
            Edit Course
          </Button>
        </Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          {course?.courseName}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Course Management - Student Progress Tracking
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Course Overview */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            sx={{
              p: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 600, mb: 2 }}
            >
              Course Overview
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  lineHeight: 1.6,
                }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      course?.overview || "No overview available"
                    ),
                  }}
                />
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <School color="primary" sx={{ fontSize: 20 }} />
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Category
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {course?.category}
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <People color="primary" sx={{ fontSize: 20 }} />
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Target Audience
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {course?.target}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Assessment color="primary" sx={{ fontSize: 20 }} />
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Price
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      ${course?.price}
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Schedule color="primary" sx={{ fontSize: 20 }} />
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Created
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {new Date(course?.createdOn).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Instructor Info */}
            <Divider sx={{ my: 3 }} />
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 600, mb: 2 }}
            >
              Instructor
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ width: 48, height: 48, bgcolor: "primary.main" }}>
                {course?.author?.firstname.charAt(0)}
                {course?.author?.lastname.charAt(0)}
              </Avatar>
              <Box flex={1}>
                <Typography variant="body1" fontWeight={500}>
                  {course?.author?.firstname} {course?.author?.lastname}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  {course?.author?.email}
                </Typography>
                <Chip
                  label={`Rating: ${course?.author?.rating}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Course Statistics */}
        <Grid size={{ xs: 12, md: 6 }}>
          <CourseStatistics assetCount={course?.assetCount} />
        </Grid>
      </Grid>

      {/* Students List Section */}
      {data && (
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Enrolled Students
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Manage and track student progress for this course
          </Typography>
          <StudentsList
            students={data}
            course={course}
            courseId={id as string}
          />
        </Paper>
      )}
    </Container>
  )
}

export default AuthorCourseDetail
