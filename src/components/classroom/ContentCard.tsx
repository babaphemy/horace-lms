import React, { useMemo, useState } from "react"
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Collapse,
  Chip,
  Button,
  LinearProgress,
} from "@mui/material"
import {
  PlayCircleOutline,
  ArticleOutlined,
  FiberManualRecord,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Quiz as QuizIcon,
  AccessTime,
  Grade,
  CheckCircle,
} from "@mui/icons-material"
import {
  LessonDto,
  Quiz,
  QuizItem,
  TUserScore,
  CourseProgressResponse,
  LessonProgressData,
} from "@/types/types"
import { useRouter } from "next/navigation"

interface Topic {
  id: string
  title?: string
  module?: string
  orderIndex?: number
  lessons: LessonDto[]
}

interface ContentCardProps {
  topics: Topic[]
  currentLessonId?: string
  handleSelect: (_lesson: LessonDto, _topicId: string) => void
  quizSummary: QuizItem[]
  courseId: string
  progress: LessonProgressData[]
  userScores: TUserScore[] | undefined
  courseProgressData?: CourseProgressResponse | null
}

interface CertificateEligibilityProps {
  userScores: TUserScore[] | null | undefined
  courseQuiz: Quiz[] | null | undefined
  courseProgressData?: CourseProgressResponse | null
}

const checkCertificateEligibility = ({
  userScores,
  courseQuiz,
  courseProgressData,
}: CertificateEligibilityProps): boolean => {
  if (!userScores || !courseQuiz || !courseProgressData) {
    return false
  }

  try {
    // Check if all lessons are completed
    const allLessonsCompleted =
      courseProgressData.completedLessons === courseProgressData.totalLessons

    if (!allLessonsCompleted) {
      return false
    }

    const quizzes = courseQuiz as Quiz[]

    // All quizzes must be attempted
    const allQuizzesPassed = quizzes.every((quiz: Quiz) => {
      const quizScore = userScores.find(
        (score) => String(score.quizId) === String(quiz.id)
      )

      if (!quizScore) return false

      const passingScore = quiz.passingScore || quiz.content?.passingScore || 70
      return quizScore.score >= passingScore
    })

    return allQuizzesPassed
  } catch {
    return false
  }
}

const ContentCard: React.FC<ContentCardProps> = ({
  topics,
  currentLessonId,
  handleSelect,
  quizSummary,
  courseId,
  progress,
  userScores,
  courseProgressData,
}) => {
  const [expandedTopics, setExpandedTopics] = useState<{
    [key: string]: boolean
  }>({})
  const router = useRouter()

  React.useEffect(() => {
    if (topics.length > 0) {
      const initialTopic =
        topics?.find((topic) =>
          topic.lessons.some((lesson) => lesson.id === currentLessonId)
        ) || topics[0]
      setExpandedTopics({ [initialTopic.id]: true })
    }
  }, [topics, currentLessonId])

  const handleTopicToggle = (topicId: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }))
  }

  const canGetCertificate = useMemo(() => {
    return checkCertificateEligibility({
      userScores,
      courseQuiz: quizSummary,
      courseProgressData,
    })
  }, [userScores, quizSummary, courseProgressData])

  const getLessonIcon = (lessonType: string) => {
    switch (lessonType?.toLowerCase()) {
      case "video":
        return <PlayCircleOutline fontSize="small" color="primary" />
      case "document":
      case "text":
        return <ArticleOutlined fontSize="small" color="primary" />
      default:
        return <FiberManualRecord sx={{ color: "primary.main", fontSize: 8 }} />
    }
  }

  const getQuizForLesson = (lessonId: string): QuizItem | undefined => {
    return quizSummary.find((quiz) => quiz.lessonId === lessonId)
  }

  const getLessonProgress = (lessonId: string): number => {
    const lessonProgress = progress.find((p) => p.lessonId === lessonId)
    return lessonProgress?.completionPercentage || 0
  }

  const isLessonCompleted = (lessonId: string): boolean => {
    const lessonProgress = progress.find((p) => p.lessonId === lessonId)
    return (
      lessonProgress?.completed || lessonProgress?.completionPercentage === 100
    )
  }

  const isQuizPassed = (quizId: string): boolean => {
    const score = userScores?.find((s) => String(s.quizId) === String(quizId))
    if (!score) return false

    const quiz = quizSummary.find((q) => String(q.id) === String(quizId))
    const passingScore = quiz?.passingScore || 70

    return score.score >= passingScore
  }

  const handleQuizClick = (quiz: QuizItem) => {
    router.push(`/course/${courseId}/${quiz.lessonId}`)
  }

  // Calculate topic progress from backend data
  const getTopicProgress = (topicId: string): number => {
    if (!courseProgressData) return 0

    const topicProgress = courseProgressData.topics.find(
      (t) => t.topicId === topicId
    )

    return Math.round(topicProgress?.progressPercentage || 0)
  }

  const getTopicCompletedLessons = (
    topicId: string
  ): { completed: number; total: number } => {
    if (!courseProgressData) return { completed: 0, total: 0 }

    const topicProgress = courseProgressData.topics.find(
      (t) => t.topicId === topicId
    )

    return {
      completed: topicProgress?.completedLessons || 0,
      total: topicProgress?.totalLessons || 0,
    }
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Content
          </Typography>
          {courseProgressData && (
            <Chip
              label={`${courseProgressData.completedLessons}/${courseProgressData.totalLessons}`}
              size="small"
              color={
                courseProgressData.completedLessons ===
                courseProgressData.totalLessons
                  ? "success"
                  : "primary"
              }
              variant="outlined"
            />
          )}
        </Box>

        {topics.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center">
            No content available for this course.
          </Typography>
        ) : (
          <List disablePadding>
            {topics
              .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
              .map((topic, idx) => {
                const topicProgress = getTopicProgress(topic.id)
                const { completed, total } = getTopicCompletedLessons(topic.id)

                return (
                  <Box key={topic.id} sx={{ mb: 2 }}>
                    {/* Topic Header */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 1,
                        cursor: "pointer",
                        p: 1,
                        borderRadius: 1,
                        "&:hover": {
                          backgroundColor: "grey.100",
                        },
                      }}
                      onClick={() => handleTopicToggle(topic.id)}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", flex: 1 }}
                      >
                        {expandedTopics[topic.id] ? (
                          <KeyboardArrowDown
                            sx={{ color: "primary.main", fontSize: 20, mr: 1 }}
                          />
                        ) : (
                          <KeyboardArrowUp
                            sx={{ color: "primary.main", fontSize: 20, mr: 1 }}
                          />
                        )}
                        <Typography variant="body2" fontWeight="medium">
                          {idx + 1}. {topic?.module || topic?.title}
                        </Typography>
                      </Box>

                      {/* Topic Progress */}
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {completed}/{total}
                        </Typography>
                        {topicProgress === 100 && (
                          <CheckCircle
                            sx={{ fontSize: 18, color: "success.main" }}
                          />
                        )}
                      </Box>
                    </Box>

                    {/* Topic Progress Bar */}
                    {topicProgress > 0 && (
                      <LinearProgress
                        variant="determinate"
                        value={topicProgress}
                        sx={{
                          height: 4,
                          borderRadius: 1,
                          mb: 1,
                          ml: 1,
                          mr: 1,
                          backgroundColor: "grey.200",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor:
                              topicProgress === 100
                                ? "success.main"
                                : "primary.main",
                          },
                        }}
                      />
                    )}

                    <Collapse in={expandedTopics[topic.id] || false}>
                      <Box sx={{ pl: 1 }}>
                        {topic.lessons
                          .sort(
                            (a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)
                          )
                          .map((lesson) => {
                            const isCurrentLesson =
                              lesson.id === currentLessonId
                            const lessonQuiz = getQuizForLesson(lesson.id ?? "")
                            const completed = isLessonCompleted(lesson.id || "")
                            const lessonProgress = getLessonProgress(
                              lesson.id || ""
                            )

                            return (
                              <Box key={lesson.id}>
                                {/* Lesson Item */}
                                <ListItem
                                  onClick={() => handleSelect(lesson, topic.id)}
                                  sx={{
                                    backgroundColor: isCurrentLesson
                                      ? "#ffcdd2"
                                      : completed
                                        ? "success.50"
                                        : "grey.100",
                                    borderRadius: 1,
                                    mb: 1,
                                    py: 1,
                                    cursor: "pointer",
                                    border: isCurrentLesson
                                      ? "2px solid"
                                      : "1px solid",
                                    borderColor: isCurrentLesson
                                      ? "primary.main"
                                      : completed
                                        ? "success.light"
                                        : "transparent",
                                    "&:hover": {
                                      backgroundColor: isCurrentLesson
                                        ? "#ffbdbd"
                                        : completed
                                          ? "success.100"
                                          : "grey.200",
                                      borderColor: isCurrentLesson
                                        ? "primary.dark"
                                        : completed
                                          ? "success.main"
                                          : "grey.300",
                                    },
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      width: "100%",
                                      gap: 1,
                                    }}
                                  >
                                    {getLessonIcon(lesson.type)}

                                    <ListItemText
                                      primary={lesson.title}
                                      primaryTypographyProps={{
                                        variant: "body2",
                                        color: isCurrentLesson
                                          ? "#000000"
                                          : "text.secondary",
                                        fontWeight: isCurrentLesson
                                          ? "medium"
                                          : "regular",
                                        sx: { flex: 1 },
                                      }}
                                    />

                                    {lessonProgress > 0 &&
                                      lessonProgress < 100 && (
                                        <Chip
                                          label={`${lessonProgress}%`}
                                          size="small"
                                          sx={{
                                            height: 20,
                                            fontSize: "0.7rem",
                                          }}
                                        />
                                      )}

                                    {completed && (
                                      <CheckCircle
                                        sx={{
                                          fontSize: 20,
                                          color: "success.main",
                                        }}
                                      />
                                    )}
                                  </Box>
                                </ListItem>

                                {/* Quiz Item */}
                                {lessonQuiz && (
                                  <Box sx={{ ml: 2, mb: 1 }}>
                                    <ListItem
                                      onClick={() =>
                                        handleQuizClick(lessonQuiz)
                                      }
                                      sx={{
                                        backgroundColor: isQuizPassed(
                                          lessonQuiz.id
                                        )
                                          ? "success.50"
                                          : "primary.50",
                                        border: "1px solid",
                                        borderColor: isQuizPassed(lessonQuiz.id)
                                          ? "success.light"
                                          : "primary.light",
                                        borderRadius: 1,
                                        cursor: "pointer",
                                        py: 1,
                                        "&:hover": {
                                          backgroundColor: isQuizPassed(
                                            lessonQuiz.id
                                          )
                                            ? "success.100"
                                            : "primary.100",
                                          borderColor: isQuizPassed(
                                            lessonQuiz.id
                                          )
                                            ? "success.main"
                                            : "primary.main",
                                        },
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "flex-start",
                                          width: "100%",
                                        }}
                                      >
                                        <QuizIcon
                                          color={
                                            isQuizPassed(lessonQuiz.id)
                                              ? "success"
                                              : "primary"
                                          }
                                          fontSize="small"
                                          sx={{ mt: 0.5, mr: 1 }}
                                        />
                                        <Box sx={{ flex: 1 }}>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: 1,
                                              mb: 0.5,
                                            }}
                                          >
                                            <Typography
                                              variant="caption"
                                              fontWeight="medium"
                                              color={
                                                isQuizPassed(lessonQuiz.id)
                                                  ? "success"
                                                  : "primary"
                                              }
                                            >
                                              {lessonQuiz.title}
                                            </Typography>
                                            <Chip
                                              size="small"
                                              label="Quiz"
                                              color={
                                                isQuizPassed(lessonQuiz.id)
                                                  ? "success"
                                                  : "primary"
                                              }
                                              variant="outlined"
                                              sx={{
                                                height: 18,
                                                fontSize: "0.65rem",
                                              }}
                                            />
                                            {isQuizPassed(lessonQuiz.id) && (
                                              <CheckCircle
                                                sx={{
                                                  fontSize: 16,
                                                  color: "success.main",
                                                }}
                                              />
                                            )}
                                          </Box>

                                          <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{
                                              display: "-webkit-box",
                                              WebkitLineClamp: 2,
                                              WebkitBoxOrient: "vertical",
                                              overflow: "hidden",
                                              fontSize: "0.7rem",
                                              lineHeight: 1.3,
                                              mb: 0.5,
                                            }}
                                          >
                                            {lessonQuiz.description}
                                          </Typography>

                                          <Box
                                            sx={{
                                              display: "flex",
                                              gap: 1.5,
                                              flexWrap: "wrap",
                                            }}
                                          >
                                            <Box
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 0.3,
                                              }}
                                            >
                                              <AccessTime
                                                sx={{ fontSize: 12 }}
                                              />
                                              <Typography
                                                variant="caption"
                                                sx={{ fontSize: "0.7rem" }}
                                              >
                                                {lessonQuiz.timeLimit}min
                                              </Typography>
                                            </Box>

                                            <Box
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 0.3,
                                              }}
                                            >
                                              <Grade sx={{ fontSize: 12 }} />
                                              <Typography
                                                variant="caption"
                                                sx={{ fontSize: "0.7rem" }}
                                              >
                                                Pass: {lessonQuiz.passingScore}%
                                              </Typography>
                                            </Box>

                                            <Typography
                                              variant="caption"
                                              color="primary"
                                              sx={{
                                                fontSize: "0.7rem",
                                                fontWeight: "medium",
                                              }}
                                            >
                                              {lessonQuiz.questionsCount}{" "}
                                              Questions
                                            </Typography>
                                          </Box>
                                        </Box>
                                      </Box>
                                    </ListItem>
                                  </Box>
                                )}
                              </Box>
                            )
                          })}
                      </Box>
                    </Collapse>
                  </Box>
                )
              })}
          </List>
        )}

        {canGetCertificate && (
          <Box sx={{ mt: 3 }}>
            <Button
              onClick={() => {
                router.push(`/course/certificate/${courseId}`)
              }}
              variant="contained"
              color="success"
              fullWidth
              startIcon={<CheckCircle />}
              sx={{
                py: 1.5,
                fontWeight: "bold",
                boxShadow: 3,
                "&:hover": {
                  boxShadow: 5,
                },
              }}
            >
              Get Your Certificate 🎓
            </Button>
          </Box>
        )}

        {courseProgressData &&
          courseProgressData.overallProgressPercentage < 100 && (
            <Box
              sx={{ mt: 2, p: 2, backgroundColor: "info.50", borderRadius: 1 }}
            >
              <Typography variant="caption" color="text.secondary">
                Complete all {courseProgressData.totalLessons} lessons and pass
                all quizzes to earn your certificate
              </Typography>
            </Box>
          )}
      </CardContent>
    </Card>
  )
}

export default ContentCard
