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
  Button,
} from "@mui/material"
import {
  CheckCircle,
  Schedule,
  TrendingUp,
  PlayLesson as LessonIcon,
  Download,
} from "@mui/icons-material"

import { useQuery } from "react-query"
import { getUserInfo, getUserProgress, userQuizScores } from "@/app/api/rest"
import useCourse from "@/hooks/useCourse"
import { LessonsList } from "./LessonList"
import { QuizScores } from "./QuizScores"
import { PerformanceMetrics } from "./PerformanceMetrics"
import { ProgressData, Quiz, tCourse } from "@/types/types"
import useQuizSummary from "@/hooks/useQuizSummary"
import * as XLSX from "xlsx"
import { notifyError, notifySuccess } from "@/utils/notification"

interface StudentCourseReportProps {
  studentId: string
  courseId: string
}

const formatTime = (seconds: number): string => {
  if (seconds === 0) return "0 min"

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes} min`
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
    if (!course || !progress || !userScores) {
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

    try {
      const lessons =
        (course as tCourse).curriculum?.topic?.flatMap(
          (topic) => topic.lessons || []
        ) || []

      const calculatedTotalLessons = lessons.length

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

      let completedCount = 0
      let latestActivity = ""

      let totalTimeSpent = 0
      let totalCourseDuration = 0

      lessons.forEach((lesson) => {
        const lessonProgressData = progress?.progress?.find(
          (p: ProgressData) => p.lessonId === lesson.id
        )

        if (lessonProgressData) {
          // Track latest activity
          if (
            lessonProgressData.updatedAt &&
            (!latestActivity || lessonProgressData.updatedAt > latestActivity)
          ) {
            latestActivity = lessonProgressData.updatedAt
          }

          if (lessonProgressData.completionPercentage === 100) {
            completedCount++
          }

          const lessonTimeSpent = Math.min(
            lessonProgressData.currentTime || 0,
            lessonProgressData.duration || 0
          )
          totalTimeSpent += lessonTimeSpent

          totalCourseDuration += lessonProgressData.duration || 0
        } else {
          totalCourseDuration += 600
        }
      })

      const lessonsWithoutProgress =
        calculatedTotalLessons - (progress?.progress?.length || 0)
      if (lessonsWithoutProgress > 0) {
        const averageLessonDuration = 600
        totalCourseDuration += lessonsWithoutProgress * averageLessonDuration
      }

      const calculatedCompletedLessons = completedCount
      const calculatedLessonProgress =
        calculatedTotalLessons > 0
          ? Math.round((completedCount / calculatedTotalLessons) * 100)
          : 0

      const quizzes = courseQuiz || []
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

      const calculatedAverageScore =
        validQuizCount > 0 ? Math.round(totalPercentage / validQuizCount) : 0

      let calculatedEstimatedTimeRemaining = 0

      if (calculatedLessonProgress > 5 && calculatedLessonProgress < 100) {
        const timePerPercentage = totalTimeSpent / calculatedLessonProgress
        const remainingPercentage = 100 - calculatedLessonProgress
        calculatedEstimatedTimeRemaining =
          timePerPercentage * remainingPercentage
      } else if (calculatedLessonProgress <= 5 && totalCourseDuration > 0) {
        calculatedEstimatedTimeRemaining = totalCourseDuration
      }

      if (completedCount > 0 && calculatedTotalLessons > completedCount) {
        const averageTimePerLesson = totalTimeSpent / completedCount
        const remainingLessons = calculatedTotalLessons - completedCount
        const alternativeEstimate = averageTimePerLesson * remainingLessons

        calculatedEstimatedTimeRemaining = Math.min(
          calculatedEstimatedTimeRemaining,
          alternativeEstimate
        )
      }

      const calculatedOverallPerformance = {
        completionRate: calculatedLessonProgress,
        averageQuizScore: calculatedAverageScore,
        timeSpent: Math.round(totalTimeSpent),
        estimatedTimeRemaining: Math.round(calculatedEstimatedTimeRemaining),
      }

      return {
        lessonProgress: calculatedLessonProgress,
        completedLessons: calculatedCompletedLessons,
        averageScore: calculatedAverageScore,
        totalLessons: calculatedTotalLessons,
        overallPerformance: calculatedOverallPerformance,
        lastActivity: latestActivity,
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
  }, [course, progress, userScores, courseQuiz])

  const courseProgress = {
    progress: lessonProgress,
    completedLessons: completedLessons,
    totalLessons: totalLessons,
    lastActivity: lastActivity,
  }

  const exportToExcel = () => {
    const exportCourse = course as tCourse
    if (!userInfo || !exportCourse) return

    const exportData = {
      "Student Information": [
        {
          Field: "Student Name",
          Value: `${userInfo.firstname} ${userInfo.lastname}`,
        },
        { Field: "Email", Value: userInfo.email },
        { Field: "Course", Value: exportCourse?.courseName || "N/A" },
        {
          Field: "Enrollment Date",
          Value: userInfo.createdOn
            ? new Date(userInfo.createdOn).toLocaleDateString()
            : "N/A",
        },
      ],

      "Progress Summary": [
        { Metric: "Overall Progress", Value: `${lessonProgress}%` },
        {
          Metric: "Completed Lessons",
          Value: `${completedLessons}/${totalLessons}`,
        },
        { Metric: "Average Quiz Score", Value: `${averageScore}%` },
        {
          Metric: "Time Spent",
          Value: formatTime(overallPerformance.timeSpent),
        },
        {
          Metric: "Estimated Time Remaining",
          Value: formatTime(overallPerformance.estimatedTimeRemaining),
        },
        {
          Metric: "Last Activity",
          Value: lastActivity
            ? new Date(lastActivity).toLocaleDateString()
            : "No activity",
        },
      ],

      "Quiz Scores": (() => {
        const quizData = (courseQuiz || []).map((quiz: Quiz) => {
          const quizScore = userScores?.find(
            (score) => String(score.quizId) === String(quiz.id)
          )
          const maxScore =
            quiz.passingScore || quiz.content?.passingScore || 100
          const percentage = quizScore
            ? Math.round((quizScore.score / maxScore) * 100)
            : 0

          return {
            "Quiz Title": quiz.title || "Untitled Quiz",
            Score: quizScore
              ? `${quizScore.score}/${maxScore}`
              : "Not attempted",
            Percentage: quizScore ? `${percentage}%` : "N/A",
            Status: quizScore
              ? percentage >= (quiz.passingScore || 70)
                ? "Passed"
                : "Failed"
              : "Not attempted",
          }
        })

        if (quizData.length === 0) {
          return [
            {
              "Quiz Title": "No quizzes available",
              Score: "N/A",
              Percentage: "N/A",
              Status: "N/A",
            },
          ]
        }

        return quizData
      })(),

      "Lesson Progress": (() => {
        const lessons =
          exportCourse?.curriculum?.topic?.flatMap(
            (topic) => topic.lessons || []
          ) || []

        const lessonData = lessons.map((lesson) => {
          const lessonProgressData = progress?.progress?.find(
            (p: ProgressData) => p.lessonId === lesson.id
          )

          return {
            "Lesson Title": lesson.title || "Untitled Lesson",
            Completion: lessonProgressData
              ? `${lessonProgressData.completionPercentage}%`
              : "0%",
            "Time Spent": lessonProgressData
              ? formatTime(lessonProgressData.currentTime || 0)
              : "0 min",
            Status:
              lessonProgressData?.completionPercentage === 100
                ? "Completed"
                : !lessonProgressData ||
                    lessonProgressData.completionPercentage === 0
                  ? "Not Started"
                  : "In Progress",
          }
        })

        if (lessonData.length === 0) {
          return [
            {
              "Lesson Title": "No lessons available",
              Completion: "N/A",
              "Time Spent": "N/A",
              Status: "N/A",
            },
          ]
        }

        return lessonData
      })(),
    }

    const wb = XLSX.utils.book_new()

    Object.entries(exportData).forEach(([sheetName, data]) => {
      try {
        if (data && Array.isArray(data) && data.length > 0) {
          const ws = XLSX.utils.json_to_sheet(data)
          XLSX.utils.book_append_sheet(wb, ws, sheetName)
        } else {
          const emptyData = [{ Message: "No data available" }]
          const ws = XLSX.utils.json_to_sheet(emptyData)
          XLSX.utils.book_append_sheet(wb, ws, sheetName)
        }
      } catch {
        throw new Error(`Error creating sheet ${sheetName}`)
      }
    })

    if (wb.SheetNames.length === 0) {
      return
    }

    const fileName = `${userInfo.firstname}_${userInfo.lastname}_${exportCourse.courseName || "Course"}_Report_${new Date().toISOString().split("T")[0]}.xlsx`

    try {
      XLSX.writeFile(wb, fileName)
      notifySuccess("Report exported successfully")
    } catch {
      notifyError("Failed to export report")
      throw new Error("Error exporting file")
    }
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
      {/* Header Section with Export Button */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid
          container
          spacing={3}
          alignItems="center"
          justifyContent="space-between"
        >
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
          <Grid>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={exportToExcel}
              sx={{ mb: 2 }}
            >
              Export to Excel
            </Button>
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
