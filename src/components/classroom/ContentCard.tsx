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
} from "@mui/icons-material"
import {
  LessonDto,
  ProgressData,
  Quiz,
  QuizItem,
  TUserScore,
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
  handleSelect: (_lesson: LessonDto) => void
  quizSummary: QuizItem[]
  courseId: string
  progress: ProgressData[]
  userScores: TUserScore[] | undefined
}

interface CertificateEligibilityProps {
  userScores: TUserScore[] | null | undefined
  courseQuiz: Quiz[] | null | undefined
  progress: ProgressData[] | null | undefined
  topics: Topic[]
}

const checkCertificateEligibility = ({
  userScores,
  courseQuiz,
  progress,
  topics,
}: CertificateEligibilityProps): boolean => {
  //? If any required data is missing, they can't get a certificate
  if (!userScores || !courseQuiz || !topics || !progress) {
    return false
  }

  try {
    const lessons =
      topics?.flatMap((topic) => topic.lessons as LessonDto[]) || []

    const quizzes = courseQuiz as Quiz[]

    //? All lessons must be completed (100% progress)
    const allLessonsCompleted = lessons.every((lesson: LessonDto) => {
      const lessonProgress = progress.find(
        (p: ProgressData) => p.lessonId === lesson.id
      )
      return lessonProgress && lessonProgress.completionPercentage === 100
    })

    if (!allLessonsCompleted) {
      return false
    }

    //? All quizzes must be attempted
    const allQuizzesPassed = quizzes.every((quiz: Quiz) => {
      const quizScore = userScores.find(
        (score) => String(score.quizId) === String(quiz.id)
      )

      return quizScore
    })

    if (!allQuizzesPassed) {
      return false
    }

    //? Verify that all quizzes meet the passing score requirement
    const quizzesMeetRequirements = quizzes.every((quiz: Quiz) => {
      const quizScore = userScores.find(
        (score) => String(score.quizId) === String(quiz.id)
      )

      if (!quizScore) return false

      const score = quizScore.score

      return score >= (quiz.passingScore || quiz.content.passingScore || 70)
    })

    if (!quizzesMeetRequirements) {
      return false
    }
    return true
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

  const canGetCeritificate = useMemo(() => {
    if (userScores && quizSummary && topics && progress) {
      return checkCertificateEligibility({
        userScores,
        courseQuiz: quizSummary,

        progress,
        topics,
      })
    } else return false
  }, [userScores, quizSummary, topics, progress])

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
  const handleQuizClick = (quiz: QuizItem) => {
    router.push(`/course/${courseId}/${quiz.lessonId}`)
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
          Content
        </Typography>

        {topics.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center">
            No content available for this course.
          </Typography>
        ) : (
          <List disablePadding>
            {topics
              .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
              .map((topic, idx) => {
                return (
                  <Box key={topic.id} sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1,
                        cursor: "pointer",
                      }}
                      onClick={() => handleTopicToggle(topic.id)}
                    >
                      {expandedTopics[topic.id] ? (
                        <KeyboardArrowDown
                          sx={{ color: "primary.main", fontSize: 16, mr: 1 }}
                        />
                      ) : (
                        <KeyboardArrowUp
                          sx={{ color: "primary.main", fontSize: 16, mr: 1 }}
                        />
                      )}
                      <Typography variant="caption" fontWeight="medium">
                        {idx + 1}: {topic?.module || topic?.title}
                      </Typography>
                    </Box>

                    <Collapse in={expandedTopics[topic.id] || false}>
                      {topic.lessons
                        .sort(
                          (a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)
                        )
                        .map((lesson) => {
                          const isCurrentLesson = lesson.id === currentLessonId
                          const lessonQuiz = getQuizForLesson(lesson.id ?? "")

                          return (
                            <Box key={lesson.id}>
                              {/* Lesson Item */}
                              <ListItem
                                onClick={() => handleSelect(lesson)}
                                sx={{
                                  backgroundColor: isCurrentLesson
                                    ? "#ffcdd2" // Current lesson highlight
                                    : "grey.100",
                                  borderRadius: 1,
                                  mb: 1,
                                  py: 0.5,
                                  cursor: "pointer",
                                  "&:hover": {
                                    backgroundColor: isCurrentLesson
                                      ? "#ffbdbd"
                                      : "grey.200",
                                  },
                                }}
                              >
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
                                  }}
                                />
                                {getLessonIcon(lesson.type)}
                              </ListItem>

                              {/* Quiz Item for this lesson (if exists) */}
                              {lessonQuiz && (
                                <Box sx={{ ml: 2, mb: 1 }}>
                                  <ListItem
                                    onClick={() => handleQuizClick(lessonQuiz)}
                                    sx={{
                                      backgroundColor: "primary.50",
                                      border: "1px solid",
                                      borderColor: "primary.light",
                                      borderRadius: 1,
                                      cursor: "pointer",
                                      py: 1,
                                      "&:hover": {
                                        backgroundColor: "primary.100",
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
                                        color="primary"
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
                                            color="primary"
                                          >
                                            {lessonQuiz.title}
                                          </Typography>
                                          <Chip
                                            size="small"
                                            label="Quiz"
                                            color="primary"
                                            variant="outlined"
                                            sx={{
                                              height: 16,
                                              fontSize: "0.6rem",
                                            }}
                                          />
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
                                            lineHeight: 1.2,
                                            mb: 0.5,
                                          }}
                                        >
                                          {lessonQuiz.description}
                                        </Typography>

                                        <Box
                                          sx={{
                                            display: "flex",
                                            gap: 1,
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
                                            <AccessTime sx={{ fontSize: 10 }} />
                                            <Typography
                                              variant="caption"
                                              sx={{ fontSize: "0.65rem" }}
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
                                            <Grade sx={{ fontSize: 10 }} />
                                            <Typography
                                              variant="caption"
                                              sx={{ fontSize: "0.65rem" }}
                                            >
                                              {lessonQuiz.passingScore}%
                                            </Typography>
                                          </Box>

                                          <Typography
                                            variant="caption"
                                            color="primary"
                                            sx={{ fontSize: "0.65rem" }}
                                          >
                                            {lessonQuiz.questionsCount} Q
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
                    </Collapse>
                  </Box>
                )
              })}
          </List>
        )}
        {/** Get Certificate */}
        {canGetCeritificate && (
          <Button
            onClick={() => {
              router.push(`/course/certificate/${courseId}`)
            }}
            variant="outlined"
            sx={{ mt: 3 }}
          >
            Get Certificate
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default ContentCard
