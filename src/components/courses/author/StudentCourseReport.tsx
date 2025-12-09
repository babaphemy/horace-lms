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
  AccessTime,
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

  //? Calculate course progress from progress data endpoint
  const {
    lessonProgress,
    completedLessons,
    totalLessons,
    overallPerformance,
    lastActivity,
  } = useMemo(() => {
    if (!course || !progress) {
      return {
        lessonProgress: 0,
        completedLessons: 0,
        totalLessons: 0,
        overallPerformance: {
          completionRate: 0,
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
          totalLessons: 0,
          overallPerformance: {
            completionRate: 0,
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
        if (!lesson.id) return // Skip lessons without IDs

        const lessonProgressData = progress?.progress?.find(
          (p: ProgressData) => String(p.lessonId) === String(lesson.id)
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
        completionRate: calculatedLessonProgress, // Course completion rate from progress data
        timeSpent: Math.round(totalTimeSpent),
        estimatedTimeRemaining: Math.round(calculatedEstimatedTimeRemaining),
      }

      return {
        lessonProgress: calculatedLessonProgress,
        completedLessons: calculatedCompletedLessons,
        totalLessons: calculatedTotalLessons,
        overallPerformance: calculatedOverallPerformance,
        lastActivity: latestActivity,
      }
    } catch {
      return {
        lessonProgress: 0,
        completedLessons: 0,
        totalLessons: 0,
        overallPerformance: {
          completionRate: 0,
          timeSpent: 0,
          estimatedTimeRemaining: 0,
        },
        lastActivity: "",
      }
    }
  }, [course, progress])

  //? Calculate quiz metrics from quiz scores endpoint
  const { averageScore, quizCompletionRate, quizProgress } = useMemo(() => {
    if (!courseQuiz || !userScores) {
      return {
        averageScore: 0,
        quizCompletionRate: 0,
        quizProgress: 0,
      }
    }

    try {
      const quizzes = courseQuiz || []
      const totalQuizzes = quizzes.length

      if (totalQuizzes === 0) {
        return {
          averageScore: 0,
          quizCompletionRate: 0,
          quizProgress: 0,
        }
      }

      let totalScorePercentage = 0
      let completedQuizCount = 0

      // Calculate average score including ALL quizzes (unattempted = 0%)
      quizzes.forEach((quiz: Quiz) => {
        const quizScore = userScores?.find(
          (score) => String(score.quizId) === String(quiz.id)
        )

        // If quiz is found in scores array, it's 100% complete and 100% progress
        if (quizScore) {
          completedQuizCount++
          // Convert score to percentage: (userScore / maxScore) * 100
          const maxScore = quizScore.maxScore > 0 ? quizScore.maxScore : 100
          const scorePercentage =
            maxScore > 0 ? (quizScore.score / maxScore) * 100 : 0
          totalScorePercentage += Math.min(scorePercentage, 100) // Cap at 100%
        } else {
          // Quiz not attempted = 0% score
          totalScorePercentage += 0
        }
      })

      // Average score = sum of all quiz percentages (including 0% for unattempted) / total quizzes
      const calculatedAverageScore =
        totalQuizzes > 0 ? Math.round(totalScorePercentage / totalQuizzes) : 0

      // Completion rate = (quizzes with scores) / (total quizzes) * 100
      const calculatedQuizCompletionRate =
        totalQuizzes > 0
          ? Math.round((completedQuizCount / totalQuizzes) * 100)
          : 0

      // Quiz progress = completion rate (each quiz with score is 100% progress)
      const calculatedQuizProgress = calculatedQuizCompletionRate

      return {
        averageScore: calculatedAverageScore,
        quizCompletionRate: calculatedQuizCompletionRate,
        quizProgress: calculatedQuizProgress,
      }
    } catch {
      return {
        averageScore: 0,
        quizCompletionRate: 0,
        quizProgress: 0,
      }
    }
  }, [courseQuiz, userScores])

  const courseProgress = {
    progress: lessonProgress,
    completedLessons: completedLessons,
    totalLessons: totalLessons,
    lastActivity: lastActivity,
  }

  // Combine course progress and quiz metrics for overallPerformance
  const overallPerformanceWithQuiz = {
    ...overallPerformance,
    averageQuizScore: averageScore, // From quiz scores endpoint
    quizCompletionRate: quizCompletionRate, // From quiz scores endpoint
    quizProgress: quizProgress, // From quiz scores endpoint
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
        { Metric: "Course Progress", Value: `${lessonProgress}%` },
        {
          Metric: "Completed Lessons",
          Value: `${completedLessons}/${totalLessons}`,
        },
        { Metric: "Average Quiz Score", Value: `${averageScore}%` },
        { Metric: "Quiz Completion Rate", Value: `${quizCompletionRate}%` },
        { Metric: "Quiz Progress", Value: `${quizProgress}%` },
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
          // Use maxScore
          const maxScore =
            quizScore && quizScore.maxScore > 0
              ? quizScore.maxScore
              : quiz.passingScore || quiz.content?.passingScore || 100
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
          const lessonProgressData = lesson.id
            ? progress?.progress?.find(
                (p: ProgressData) => String(p.lessonId) === String(lesson.id)
              )
            : undefined

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
                  label={`${completedLessons}/${totalLessons} Lessons`}
                  color="success"
                  variant="outlined"
                  sx={{ mr: 1 }}
                  title="Lessons completed (from progress data)"
                />
                <Chip
                  icon={<TrendingUp />}
                  label={`${lessonProgress}% Course Progress`}
                  color="primary"
                  variant="outlined"
                  title="Course progress based on lesson completion"
                />
                {averageScore > 0 && (
                  <Chip
                    icon={<TrendingUp />}
                    label={`${averageScore}% Quiz Avg`}
                    color="secondary"
                    variant="outlined"
                    sx={{ ml: 1 }}
                    title="Average quiz score (from quiz scores)"
                  />
                )}
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

      {/* Course Progress Overview */}
      <Grid container spacing={3} sx={{ height: "100%" }}>
        <Grid size={{ xs: 12, md: 8 }} sx={{ height: "100%" }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Course Progress
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  sx={{ mt: 0.5 }}
                >
                  Based on lesson completion (from progress data)
                </Typography>
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
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box display="flex" alignItems="center">
                    <AccessTime color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {formatTime(overallPerformance.timeSpent)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Time spent (from progress data)
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box display="flex" alignItems="center">
                    <Schedule color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {formatTime(overallPerformance.estimatedTimeRemaining)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Estimated time remaining
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Quiz Performance Summary */}
        <Grid size={{ xs: 12, md: 4 }} sx={{ height: "100%" }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quiz Performance
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  sx={{ mt: 0.5 }}
                >
                  Based on quiz scores
                </Typography>
              </Typography>
              <Box sx={{ textAlign: "center", py: 2 }}>
                <Typography variant="h3" color="secondary">
                  {averageScore}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Quiz Score
                </Typography>
                {courseQuiz && courseQuiz.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        Quiz Completion Rate
                      </Typography>
                      <Typography variant="h5" color="secondary">
                        {quizCompletionRate}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {userScores?.filter((score) =>
                          courseQuiz.some(
                            (quiz: Quiz) =>
                              String(quiz.id) === String(score.quizId)
                          )
                        ).length || 0}{" "}
                        of {courseQuiz.length} quizzes completed
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        Quiz Progress
                      </Typography>
                      <Typography variant="h5" color="secondary">
                        {quizProgress}%
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Detailed Sections */}
      <PerformanceMetrics
        courseProgress={courseProgress}
        overallPerformance={overallPerformanceWithQuiz}
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
