"use client"

import React, { useMemo, useState } from "react"
import {
  Button,
  Box,
  Typography,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  LinearProgress,
  Paper,
  Divider,
} from "@mui/material"

import {
  CertificateData,
  CourseResponse,
  ProgressData,
  Quiz,
  TopicDto,
  TUserScore,
} from "@/types/types"
import CertificateGenerator from "./CertificateGenerator"
import CertificateDisplay from "./CertificateDisplay"
import { useSession } from "next-auth/react"
import { useQuery } from "react-query"
import { fetchCourse, getUserProgress, userQuizScores } from "@/app/api/rest"
import useQuizSummary from "@/hooks/useQuizSummary"
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  EmojiEvents as EmojiEventsIcon,
  Quiz as QuizIcon,
  PlayLesson as LessonIcon,
} from "@mui/icons-material"
import { useRouter } from "next/navigation"

interface CertificateEligibilityResult {
  eligible: boolean
  reasons: string[]
}

export const checkCertificateEligibility = ({
  registered,
  userScores,
  courseQuiz,
  data,
  progress,
}: {
  registered: boolean
  userScores: TUserScore[]
  courseQuiz: Quiz[]
  data: CourseResponse
  progress: ProgressData[]
}): CertificateEligibilityResult => {
  const reasons: string[] = []

  if (!registered) {
    reasons.push("You are not registered for this course")
    return { eligible: false, reasons }
  }

  if (!userScores || !courseQuiz || !data || !progress) {
    reasons.push("Loading completion data...")
    return { eligible: false, reasons }
  }

  const lessons =
    data?.curriculum?.topic?.flatMap((topic) => topic.lessons) || []

  const incompleteLessons = lessons?.filter((lesson) => {
    const lessonProgress = progress.find(
      (p: ProgressData) => p.lessonId === lesson?.id
    )
    return !lessonProgress || lessonProgress.completionPercentage < 100
  })

  if (incompleteLessons.length > 0) {
    reasons.push(`Complete all lessons (${incompleteLessons.length} remaining)`)
  }

  const failedOrMissingQuizzes = courseQuiz.filter((quiz: Quiz) => {
    const quizScore = userScores.find(
      (score) => String(score.quizId) === String(quiz.id)
    )

    if (!quizScore) return false

    const score = quizScore.score

    return score >= (quiz.passingScore || quiz.content.passingScore || 70)
  })

  if (failedOrMissingQuizzes.length > 0) {
    reasons.push(
      `Pass all quizzes (${failedOrMissingQuizzes.length} need attention)`
    )
  }

  return {
    eligible: reasons.length === 0,
    reasons,
  }
}

const CourseCompletion: React.FC<{ id: string }> = ({ id }) => {
  const { data: session } = useSession()
  const [showGenerator, setShowGenerator] = useState(false)
  const [showCertificate, setShowCertificate] = useState(false)
  const [certificate, setCertificate] = useState<CertificateData | null>(null)
  const router = useRouter()

  const { courseQuiz } = useQuizSummary({ courseId: id as string })
  const { data } = useQuery({
    queryKey: ["course", id, session?.user?.id],
    queryFn: () => fetchCourse(id as string, session?.user?.id as string),
    refetchOnWindowFocus: false,
    enabled: !!id && !!session?.user?.id,
  })

  const { data: userScores } = useQuery({
    queryFn: () => userQuizScores(session?.user?.id as string),
    queryKey: ["userQuizScores", session?.user?.id],
    enabled: !!session?.user?.id,
  })

  const { data: progress } = useQuery({
    queryKey: ["progress", session?.user?.id],
    queryFn: () => getUserProgress(session?.user?.id ?? ""),
    enabled: !!session?.user?.id,
  })

  const certificateEligibility = useMemo(() => {
    if (userScores && courseQuiz && data && progress) {
      return checkCertificateEligibility({
        registered: data?.registered || false,
        userScores,
        courseQuiz,
        data,
        progress: progress?.progress || [],
      })
    } else {
      return { eligible: false, reasons: ["Loading eligibility data..."] }
    }
  }, [userScores, courseQuiz, data, progress])

  const handleCertificateGenerated = (cert: CertificateData) => {
    setCertificate(cert)
    setShowCertificate(true)
  }

  // Get detailed progress information for UI
  const getProgressDetails = () => {
    if (!data || !progress) return null

    const lessons =
      (data?.curriculum?.topic as TopicDto[])?.flatMap(
        (topic) => topic.lessons
      ) || []

    const completedLessons = lessons?.filter((lesson) => {
      const lessonProgress = progress.progress.find(
        (p: ProgressData) => p.lessonId === lesson?.id
      )
      return lessonProgress && lessonProgress.completionPercentage === 100
    })

    return {
      totalLessons: lessons.length,
      completedLessons: completedLessons.length,
      completionPercentage:
        lessons.length > 0
          ? Math.round((completedLessons.length / lessons.length) * 100)
          : 0,
    }
  }

  const getQuizDetails = () => {
    if (!courseQuiz || !userScores) return null

    const passedQuizzes = courseQuiz.filter((quiz: Quiz) => {
      const quizScore = userScores.find(
        (score) => String(score.quizId) === String(quiz.id)
      )
      return quizScore
    })

    return {
      totalQuizzes: courseQuiz.length,
      passedQuizzes: passedQuizzes.length,
      quizCompletionPercentage:
        courseQuiz.length > 0
          ? Math.round((passedQuizzes.length / courseQuiz.length) * 100)
          : 0,
    }
  }

  const progressDetails = getProgressDetails()
  const quizDetails = getQuizDetails()

  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        my: "4rem",
        maxWidth: 800,
        mx: "auto",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Course Completion Status
      </Typography>

      {certificateEligibility.eligible ? (
        <>
          <Typography variant="body1" sx={{ mb: 3, textAlign: "center" }}>
            Congratulations on completing the course! You&apos;ve met all
            requirements and can now generate your certificate of completion.
          </Typography>

          <Alert severity="success" sx={{ mb: 3, width: "100%" }}>
            <Typography variant="h6">
              You&apos;re eligible for a certificate!
            </Typography>
          </Alert>

          <Button
            variant="contained"
            size="large"
            onClick={() => setShowGenerator(true)}
            startIcon={<EmojiEventsIcon />}
            sx={{ mb: 4 }}
          >
            Generate Certificate
          </Button>

          {/* Progress Summary */}
          <Paper elevation={2} sx={{ p: 3, width: "100%", mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Your Achievement Summary
            </Typography>
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              <Card variant="outlined" sx={{ flex: 1, minWidth: 200 }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LessonIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      {progressDetails?.completedLessons}/
                      {progressDetails?.totalLessons}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Lessons Completed
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={progressDetails?.completionPercentage || 0}
                    sx={{ mt: 1, height: 8, borderRadius: 4 }}
                  />
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ flex: 1, minWidth: 200 }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <QuizIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      {quizDetails?.passedQuizzes}/{quizDetails?.totalQuizzes}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Quizzes Passed
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={quizDetails?.quizCompletionPercentage || 0}
                    sx={{ mt: 1, height: 8, borderRadius: 4 }}
                  />
                </CardContent>
              </Card>
            </Box>
          </Paper>
        </>
      ) : (
        <>
          <Typography variant="body1" sx={{ mb: 3, textAlign: "center" }}>
            You&apos;re making great progress! Complete the requirements below
            to earn your certificate.
          </Typography>

          <Alert severity="info" sx={{ mb: 3, width: "100%" }}>
            <Typography variant="h6">
              Certificate Requirements Not Yet Met
            </Typography>
          </Alert>

          {/* Requirements Card */}
          <Card sx={{ width: "100%", mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Certificate Requirements
              </Typography>

              {/* Lesson Completion Requirement */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  {progressDetails?.completionPercentage === 100 ? (
                    <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  ) : (
                    <CancelIcon color="error" sx={{ mr: 1 }} />
                  )}
                  <Typography variant="body1">
                    Complete All Lessons ({progressDetails?.completedLessons}/
                    {progressDetails?.totalLessons})
                  </Typography>
                  <Chip
                    label={`${progressDetails?.completionPercentage}%`}
                    size="small"
                    color={
                      progressDetails?.completionPercentage === 100
                        ? "success"
                        : "default"
                    }
                    sx={{ ml: 2 }}
                  />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progressDetails?.completionPercentage || 0}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Quiz Completion Requirement */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  {quizDetails?.quizCompletionPercentage === 100 ? (
                    <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  ) : (
                    <CancelIcon color="error" sx={{ mr: 1 }} />
                  )}
                  <Typography variant="body1">
                    Pass All Quizzes ({quizDetails?.passedQuizzes}/
                    {quizDetails?.totalQuizzes})
                  </Typography>
                  <Chip
                    label={`${quizDetails?.quizCompletionPercentage}%`}
                    size="small"
                    color={
                      quizDetails?.quizCompletionPercentage === 100
                        ? "success"
                        : "default"
                    }
                    sx={{ ml: 2 }}
                  />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={quizDetails?.quizCompletionPercentage || 0}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Additional Requirements */}
              {certificateEligibility.reasons.length > 0 && (
                <>
                  <Typography variant="subtitle2" gutterBottom>
                    Additional requirements needed:
                  </Typography>
                  <List dense>
                    {certificateEligibility.reasons.map((reason, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CancelIcon color="error" />
                        </ListItemIcon>
                        <ListItemText primary={reason} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </CardContent>
          </Card>

          <Button
            variant="outlined"
            size="large"
            onClick={() => {
              //? Navigate to the first incomplete lesson or quiz
              const firstIncompleteLesson = (
                data?.curriculum?.topic as TopicDto[]
              )
                ?.flatMap((topic) => topic.lessons)
                ?.find((lesson) => {
                  const lessonProgress = progress?.progress?.find(
                    (p: ProgressData) => p.lessonId === lesson?.id
                  )
                  return (
                    !lessonProgress || lessonProgress.completionPercentage < 100
                  )
                })

              if (firstIncompleteLesson) {
                // Navigate to the lesson
                router.push(`/course/classroom?courseId=${id}`)
              }
            }}
          >
            Continue Learning
          </Button>
        </>
      )}

      <CertificateGenerator
        open={showGenerator}
        onClose={() => setShowGenerator(false)}
        onCertificateGenerated={handleCertificateGenerated}
        courseId={id}
        courseName={data?.courseName}
      />

      {certificate && (
        <CertificateDisplay
          certificate={certificate}
          open={showCertificate}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </Box>
  )
}

export default CourseCompletion
