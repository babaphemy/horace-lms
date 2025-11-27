"use client"
import React, { useMemo } from "react"
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material"
import {
  CheckCircle,
  Schedule,
  TrendingUp,
  PlayLesson as LessonIcon,
} from "@mui/icons-material"

import { useQuery } from "react-query"
import { getUserInfo, getUserProgress, userQuizScores } from "@/app/api/rest"
import useCourse from "@/hooks/useCourse"
import { LessonsList } from "./LessonList"
import { QuizScores } from "./QuizScores"
import { PerformanceMetrics } from "./PerformanceMetrics"
import { ProgressData, Quiz, tCourse } from "@/types/types"
import useQuizSummary from "@/hooks/useQuizSummary"

interface StudentCourseReportProps {
  studentId: string
  courseId: string
}

export const StudentCourseReport: React.FC<StudentCourseReportProps> = ({
  studentId,
  courseId,
}) => {
  const { data: course } = useCourse(courseId as string, studentId as string)
  const { courseQuiz } = useQuizSummary({ courseId: courseId as string })
  const {
    data: userInfo,
    isLoading,
    error,
  } = useQuery({
    queryFn: () => getUserInfo(studentId as string),
    queryKey: ["user-info", studentId],
    enabled: !!studentId,
  })

  const { data: userScores } = useQuery({
    queryFn: () => userQuizScores(studentId as string),
    queryKey: ["userQuizScores", studentId],
    enabled: !!studentId,
  })

  const { data: progress } = useQuery({
    queryKey: ["progress", studentId],
    queryFn: () => getUserProgress(studentId ?? ""),
    enabled: !!studentId,
  })

  const {
    lessonProgress,
    completedLessons,
    averageScore,
    totalLessons,
    overallPerformance,
    lastActivity,
  } = useMemo(() => {
    // Default values
    let calculatedLessonProgress = 0
    let calculatedCompletedLessons = 0
    let calculatedAverageScore = 0
    let calculatedTotalLessons = 0
    let calculatedLastActivity = ""

    if (!course || !progress || !userScores) {
      return {
        lessonProgress: calculatedLessonProgress,
        completedLessons: calculatedCompletedLessons,
        averageScore: calculatedAverageScore,
        totalLessons: calculatedTotalLessons,
        overallPerformance: {
          completionRate: 0,
          averageQuizScore: 0,
          timeSpent: 0,
          estimatedTimeRemaining: 0,
        },
        lastActivity: "",
      }
    }

    try {
      const lessons =
        (course as tCourse).curriculum?.topic?.flatMap(
          (topic) => topic.lessons || []
        ) || []

      calculatedTotalLessons = lessons.length

      if (calculatedTotalLessons === 0) {
        return {
          lessonProgress: 0,
          completedLessons: 0,
          averageScore: 0,
          totalLessons: 0,
          overallPerformance: {
            completionRate: 0,
            averageQuizScore: 0,
            timeSpent: 0,
            estimatedTimeRemaining: 0,
          },
          lastActivity: "",
        }
      }

      let totalCompletionPercentage = 0
      let completedCount = 0
      let latestActivity = ""

      lessons.forEach((lesson) => {
        const lessonProgressData = progress?.progress?.find(
          (p: ProgressData) => p.lessonId === lesson.id
        )

        if (lessonProgressData) {
          totalCompletionPercentage +=
            lessonProgressData.completionPercentage || 0

          if (
            lessonProgressData.updatedAt &&
            (!latestActivity || lessonProgressData.updatedAt > latestActivity)
          ) {
            latestActivity = lessonProgressData.updatedAt
          }

          if (lessonProgressData.completionPercentage === 100) {
            completedCount++
          }
        }
      })

      calculatedLessonProgress =
        calculatedTotalLessons > 0
          ? Math.round(totalCompletionPercentage / calculatedTotalLessons)
          : 0

      calculatedCompletedLessons = completedCount
      calculatedLastActivity = latestActivity

      const quizzes = course.quizzes || []
      let totalPercentage = 0
      let validQuizCount = 0

      quizzes.forEach((quiz: Quiz) => {
        const quizScore = userScores?.find(
          (score) => String(score.quizId) === String(quiz.id)
        )

        if (quizScore) {
          const maxScore =
            quiz.passingScore || quiz.content?.passingScore || 100
          const userScore = quizScore.score

          if (maxScore > 0 && userScore >= 0) {
            const percentage = (userScore / maxScore) * 100
            const cappedPercentage = Math.min(percentage, 100)

            totalPercentage += cappedPercentage
            validQuizCount++
          }
        }
      })

      calculatedAverageScore =
        validQuizCount > 0 ? Math.round(totalPercentage / validQuizCount) : 0

      if (calculatedAverageScore > 100) {
        calculatedAverageScore = 100
      }

      const calculatedOverallPerformance = {
        completionRate: calculatedLessonProgress,
        averageQuizScore: calculatedAverageScore,
        timeSpent: 0,
        estimatedTimeRemaining: 0,
      }

      return {
        lessonProgress: calculatedLessonProgress,
        completedLessons: calculatedCompletedLessons,
        averageScore: calculatedAverageScore,
        totalLessons: calculatedTotalLessons,
        overallPerformance: calculatedOverallPerformance,
        lastActivity: calculatedLastActivity,
      }
    } catch {
      return {
        lessonProgress: 0,
        completedLessons: 0,
        averageScore: 0,
        totalLessons: 0,
        overallPerformance: {
          completionRate: 0,
          averageQuizScore: 0,
          timeSpent: 0,
          estimatedTimeRemaining: 0,
        },
        lastActivity: "",
      }
    }
  }, [course, progress, userScores])

  const courseProgress = {
    progress: lessonProgress,
    completedLessons: completedLessons,
    totalLessons: totalLessons,
    lastActivity: lastActivity,
  }

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
        Failed to load student report: {(error as Error).message}
      </Alert>
    )
  }

  if (!userInfo) {
    return (
      <Alert severity="info">
        No report data available for this student and course.
      </Alert>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid>
            <Avatar src={userInfo?.dp} sx={{ width: 80, height: 80 }}>
              {userInfo?.firstname?.charAt(0)}
            </Avatar>
          </Grid>
          <Grid>
            <Typography variant="h4" gutterBottom>
              {userInfo?.firstname} {userInfo?.lastname}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {userInfo?.email}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Chip
                icon={<CheckCircle />}
                label={`${completedLessons}/${totalLessons} Lessons Completed`}
                color="success"
                variant="outlined"
                sx={{ mr: 1 }}
              />
              <Chip
                icon={<TrendingUp />}
                label={`${lessonProgress}% Progress`}
                color="primary"
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Progress Overview */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Course Progress
              </Typography>
              <Box sx={{ mb: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={lessonProgress}
                  sx={{ height: 10, borderRadius: 5, mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {lessonProgress}% Complete
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box display="flex" alignItems="center">
                    <LessonIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {completedLessons} of {totalLessons} lessons
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box display="flex" alignItems="center">
                    <Schedule color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {lastActivity
                        ? `Last activity: ${new Date(lastActivity).toLocaleDateString()}`
                        : "No activity recorded"}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Summary */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Summary
              </Typography>
              <Box sx={{ textAlign: "center", py: 2 }}>
                <Typography variant="h3" color="primary">
                  {averageScore}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Quiz Score
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Detailed Sections */}
      <PerformanceMetrics
        courseProgress={courseProgress}
        overallPerformance={overallPerformance}
      />

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <LessonsList
            lessons={
              (course as tCourse)?.curriculum?.topic?.flatMap(
                (topic) => topic.lessons || []
              ) || []
            }
            progress={progress}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <QuizScores quizScores={userScores || []} quizzes={courseQuiz} />
        </Grid>
      </Grid>
    </Box>
  )
}
