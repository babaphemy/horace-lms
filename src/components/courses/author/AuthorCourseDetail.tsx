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
    queryKey: ["registered=students", id],
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
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            mb: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            startIcon={<ArrowBack />}
            component={Link}
            href="/dashboard"
            sx={{ mb: 2 }}
          >
            Back to Dashboard
          </Button>

          <Button
            startIcon={<Edit />}
            component={Link}
            variant="contained"
            href={`/dashboard/courses/add?cid=${course.id}`}
            sx={{ mb: 2 }}
          >
            Edit Course
          </Button>
        </Box>
        <Typography variant="h4" gutterBottom>
          {course?.courseName}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Course Management - Student Progress Tracking
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Course Overview */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Paper sx={{ p: 3, width: "100%", height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Course Overview
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {course?.overview}
            </Typography>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <School color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    <strong>Category:</strong> {course?.category}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <People color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    <strong>Target:</strong> {course?.target}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Assessment color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    <strong>Price:</strong> ${course?.price}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <Schedule color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    <strong>Created:</strong>{" "}
                    {new Date(course?.createdOn).toLocaleDateString()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Instructor Info */}
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Instructor
            </Typography>
            <Box display="flex" alignItems="center">
              <Avatar sx={{ mr: 2 }}>
                {course?.author?.firstname.charAt(0)}
                {course?.author?.lastname.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="body1">
                  {course?.author?.firstname} {course?.author?.lastname}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {course?.author?.email}
                </Typography>
                <Chip
                  label={`Rating: ${course?.author?.rating}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Course Statistics */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <CourseStatistics assetCount={course?.assetCount} />
        </Grid>
      </Grid>

      {/* Students List Section */}
      {data && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h5" gutterBottom>
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
