"use client"
import useLessonQuiz from "@/hooks/useLessonQuiz"
import { QuizOption, QuizQuestion, Quiz } from "@/types/types"
import { useParams, useRouter } from "next/navigation"
import React, { useState, useEffect, useCallback, useMemo } from "react"
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  AppBar,
  Toolbar,
} from "@mui/material"
import {
  ArrowBack as ArrowBackIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  AccessTime as AccessTimeIcon,
  EmojiEvents as EmojiEventsIcon,
} from "@mui/icons-material"
import { useSession } from "next-auth/react"
import { addScore, getUserQuizScores } from "@/app/api/rest"
import { useQuery } from "react-query"

interface UserAnswer {
  questionId: number
  answer: string
  isCorrect?: boolean
}

const QuizPage = () => {
  const params = useParams()
  const { lid, cid } = params
  const { data: session } = useSession()
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [confirmSubmitDialog, setConfirmSubmitDialog] = useState(false)

  const handleBackToClassroom = () => {
    router.push(`/course/classroom?courseId=${cid}`)
  }

  const { quiz: quizData }: { quiz: Quiz } = useLessonQuiz({
    lid: lid as string,
  })

  const { data: quizScores, isLoading: isLoadingScores } = useQuery({
    queryKey: ["quizScores", quizData?.id, session?.user?.id],
    queryFn: () => getUserQuizScores(session?.user?.id ?? ""),
    enabled: !!session?.user?.id,
  })

  const hasUserTakenQuiz = useMemo(() => {
    if (!quizScores || !quizData?.id) return false
    return quizScores.some((score) => score.quizId === quizData.id)
  }, [quizScores, quizData?.id])

  const previousQuizScore = useMemo(() => {
    if (!quizScores || !quizData?.id) return null
    return quizScores.find((score) => score.quizId === quizData.id)
  }, [quizScores, quizData?.id])

  const handleStartQuiz = () => {
    setQuizStarted(true)
    setTimeRemaining(quizData.content.timeLimit * 60)
    const initialAnswers = quizData.content.questions.map(
      (q: QuizQuestion) => ({
        questionId: q.id,
        answer: "",
      })
    )
    setUserAnswers(initialAnswers)
  }

  const handleAnswerChange = (questionId: number, answer: string) => {
    setUserAnswers((prev) =>
      prev.map((ua) => (ua.questionId === questionId ? { ...ua, answer } : ua))
    )
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.content.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleGoToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  const totalPoints = quizData?.content?.questions?.reduce(
    (sum: number, q: QuizQuestion) => sum + q.points,
    0
  )

  const submitQuizScore = useCallback(
    async (answers: UserAnswer[]) => {
      try {
        const earnedPoints = answers.reduce((sum: number, ua) => {
          const question = quizData?.content?.questions?.find(
            (q: QuizQuestion) => q.id === ua.questionId
          )
          return sum + (ua.isCorrect && question ? question.points : 0)
        }, 0)

        const passingScore = quizData?.content?.passingScore

        const scorePercentage =
          totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0
        const timeTaken = quizData?.content?.timeLimit * 60 - timeRemaining
        await addScore({
          userId: session?.user?.id ?? "",
          score: scorePercentage,
          maxScore: passingScore,
          timeTaken,
          quizId: quizData.id,
        })
      } catch (error) {
        throw error
      }
    },
    [quizData, session, timeRemaining, totalPoints]
  )

  const calculateResults = useCallback(() => {
    const updatedAnswers = userAnswers.map((ua) => {
      const question = quizData.content.questions.find(
        (q: QuizQuestion) => q.id === ua.questionId
      )
      if (!question) return ua

      let isCorrect = false
      if (question.type === "short_answer") {
        isCorrect = ua.answer
          .toLowerCase()
          .trim()
          .includes(
            question.correctAnswer.toLowerCase().trim().substring(0, 10)
          )
      } else {
        isCorrect = ua.answer === question.correctAnswer
      }

      return { ...ua, isCorrect }
    })

    setUserAnswers(updatedAnswers)
    setShowResults(true)

    //? Submit score to the API endpoint
    submitQuizScore(updatedAnswers)
  }, [userAnswers, quizData, submitQuizScore])

  const handleTimeUp = useCallback(() => {
    setQuizCompleted(true)
    calculateResults()
  }, [calculateResults])

  useEffect(() => {
    if (quizStarted && !quizCompleted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [quizStarted, quizCompleted, timeRemaining, handleTimeUp])

  const handleSubmitQuiz = () => {
    setConfirmSubmitDialog(false)
    setQuizCompleted(true)
    calculateResults()
  }

  const currentQuestion = useMemo(() => {
    return quizData?.content?.questions[currentQuestionIndex]
  }, [quizData, currentQuestionIndex])
  const currentAnswer = useMemo(() => {
    return (
      userAnswers.find((ua) => ua.questionId === currentQuestion?.id)?.answer ||
      ""
    )
  }, [userAnswers, currentQuestion])

  const lessonProgress =
    ((currentQuestionIndex + 1) / quizData?.content?.questions?.length) * 100

  const earnedPoints = userAnswers.reduce((sum: number, ua) => {
    const question = quizData?.content?.questions?.find(
      (q: QuizQuestion) => q.id === ua.questionId
    )
    return sum + (ua.isCorrect && question ? question.points : 0)
  }, 0)
  const scorePercentage =
    totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0
  const passed = scorePercentage >= quizData?.content?.passingScore

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Render question based on type
  const renderQuestion = () => {
    if (!currentQuestion) return null

    switch (currentQuestion.type) {
      case "multiple_choice":
      case "true_false":
        return (
          <RadioGroup
            value={currentAnswer}
            onChange={(e) => {
              handleAnswerChange(currentQuestion.id, e.target.value)
            }}
            sx={{ gap: 1 }}
          >
            {currentQuestion.options.map((option: QuizOption) => (
              <Paper
                key={option.id}
                elevation={1}
                sx={{
                  p: 2,
                  border: 1,
                  borderColor:
                    currentAnswer === option.id ? "primary.main" : "grey.300",
                  borderRadius: 1,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
                onClick={() => {
                  handleAnswerChange(currentQuestion.id, option.id)
                }}
              >
                <FormControlLabel
                  value={option.id}
                  control={<Radio />}
                  label={option.text}
                  sx={{ width: "100%", m: 0 }}
                />
              </Paper>
            ))}
          </RadioGroup>
        )

      case "short_answer":
        return (
          <TextField
            value={currentAnswer}
            onChange={(e) =>
              handleAnswerChange(currentQuestion.id, e.target.value)
            }
            placeholder="Enter your answer here..."
            multiline
            rows={4}
            fullWidth
            variant="outlined"
          />
        )

      default:
        return null
    }
  }

  if (isLoadingScores) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <Typography>Checking quiz status...</Typography>
      </Box>
    )
  }

  if (hasUserTakenQuiz && previousQuizScore) {
    return (
      <Box maxWidth="md" sx={{ mx: "auto", p: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToClassroom}
          sx={{ mb: 3 }}
        >
          Back to Classroom
        </Button>

        <Card sx={{ textAlign: "center", p: 4 }}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            ✅
          </Typography>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Quiz Already Completed
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            You have already taken this quiz and cannot retake it.
          </Typography>

          <Card
            variant="outlined"
            sx={{ textAlign: "center", mb: 4, maxWidth: 400, mx: "auto" }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Your Previous Score:
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  mb: 2,
                }}
              >
                <Chip
                  icon={<EmojiEventsIcon />}
                  label={`Score: ${previousQuizScore.score}%`}
                  color={
                    previousQuizScore.score >= quizData?.content?.passingScore
                      ? "success"
                      : "error"
                  }
                  variant="filled"
                />
                <Chip
                  icon={<AccessTimeIcon />}
                  label={`Time: ${previousQuizScore.timeTaken}s`}
                  variant="outlined"
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Passing Score: {quizData?.content?.passingScore}%
              </Typography>
              <Typography
                variant="body2"
                color={
                  previousQuizScore.score >= quizData?.content?.passingScore
                    ? "success.main"
                    : "error.main"
                }
                sx={{ fontWeight: "bold", mt: 1 }}
              >
                {previousQuizScore.score >= quizData?.content?.passingScore
                  ? "PASSED"
                  : "FAILED"}
              </Typography>
            </CardContent>
          </Card>

          <Button
            variant="contained"
            onClick={handleBackToClassroom}
            sx={{ px: 4, py: 1.5 }}
          >
            Back to Classroom
          </Button>
        </Card>
      </Box>
    )
  }

  // Quiz start screen
  if (!quizStarted && !hasUserTakenQuiz) {
    return (
      <Box maxWidth="md" sx={{ mx: "auto", p: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToClassroom}
          sx={{ mb: 3 }}
        >
          Back to Classroom
        </Button>

        <Card sx={{ textAlign: "center", p: 4 }}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            📝
          </Typography>
          <Typography variant="h4" sx={{ mb: 2 }}>
            {quizData?.content?.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {quizData?.content?.description}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              justifyContent: "center",
              mb: 4,
            }}
          >
            <Chip
              icon={<AccessTimeIcon />}
              label={`Time Limit: ${quizData?.content?.timeLimit} minutes`}
            />
            <Chip
              label={`Passing Score: ${quizData?.content?.passingScore}%`}
              color="success"
            />
            <Chip
              label={`${quizData?.content?.questions?.length} Questions`}
              variant="outlined"
            />
          </Box>

          <Card
            variant="outlined"
            sx={{ textAlign: "left", mb: 4, bgcolor: "" }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Instructions:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Read each question carefully before answering" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="You can navigate between questions using the navigation buttons" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Your progress is automatically saved" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Submit your quiz before time runs out" />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Button
            variant="contained"
            size="large"
            onClick={handleStartQuiz}
            sx={{ px: 4, py: 1.5 }}
          >
            Start Quiz
          </Button>
        </Card>
      </Box>
    )
  }

  if (showResults) {
    return (
      <Box maxWidth="lg" sx={{ mx: "auto", p: 3 }}>
        <Card sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            {passed ? (
              <CheckIcon sx={{ fontSize: 60, color: "success.main", mb: 2 }} />
            ) : (
              <CloseIcon sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
            )}
            <Typography variant="h4" sx={{ mb: 1 }}>
              Quiz {passed ? "Passed!" : "Failed"}
            </Typography>
            <Typography
              variant="h3"
              sx={{ mb: 1, color: passed ? "success.main" : "error.main" }}
            >
              {scorePercentage}%
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You scored {earnedPoints} out of {totalPoints} points
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" sx={{ mb: 3 }}>
            Review Your Answers:
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {quizData.content.questions.map(
              (question: QuizQuestion, index: number) => {
                const userAnswer = userAnswers.find(
                  (ua) => ua.questionId === question.id
                )
                const isCorrect = userAnswer?.isCorrect || false

                return (
                  <Card key={question.id} variant="outlined">
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Typography variant="h6">
                          Question {index + 1}: {question.question}
                        </Typography>
                        <Chip
                          label={isCorrect ? "Correct" : "Incorrect"}
                          color={isCorrect ? "success" : "error"}
                          size="small"
                        />
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        <Typography variant="body2">
                          <strong>Your answer:</strong>{" "}
                          {userAnswer?.answer || "No answer"}
                        </Typography>
                        {!isCorrect && (
                          <Typography variant="body2" color="success.main">
                            <strong>Correct answer:</strong>{" "}
                            {question.correctAnswer}
                          </Typography>
                        )}
                        <Typography variant="body2" color="text.secondary">
                          <strong>Points:</strong> {question.points}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                )
              }
            )}
          </Box>

          <Box
            sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 4 }}
          >
            <Button variant="outlined" onClick={handleBackToClassroom}>
              Back to Classroom
            </Button>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
            >
              Take Quiz Again
            </Button>
          </Box>
        </Card>
      </Box>
    )
  }

  // Main quiz interface
  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 2 }}>
      <AppBar position="static" color="transparent" elevation={1}>
        <Toolbar>
          <IconButton
            edge="start"
            onClick={handleBackToClassroom}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {quizData.content.title}
          </Typography>
          <Chip
            icon={<AccessTimeIcon />}
            label={formatTime(timeRemaining)}
            color={timeRemaining < 300 ? "error" : "primary"}
            variant="filled"
          />
        </Toolbar>
      </AppBar>

      <Card sx={{ mt: 2, p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Question {currentQuestionIndex + 1} of{" "}
              {quizData.content.questions.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(lessonProgress)}% Complete
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={lessonProgress}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        {/* Question */}
        <Card variant="outlined" sx={{ p: 3, mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 3,
            }}
          >
            <Typography variant="h6">{currentQuestion?.question}</Typography>
            <Chip label={`${currentQuestion?.points} pts`} variant="outlined" />
          </Box>

          {renderQuestion()}
        </Card>

        {/* Navigation */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            startIcon={<NavigateBeforeIcon />}
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            variant="outlined"
          >
            Previous
          </Button>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {quizData.content.questions.map(
              (_: QuizQuestion, index: number) => (
                <Button
                  key={index}
                  variant={
                    index === currentQuestionIndex ? "contained" : "outlined"
                  }
                  onClick={() => handleGoToQuestion(index)}
                  sx={{ minWidth: 40, height: 40 }}
                >
                  {index + 1}
                </Button>
              )
            )}
          </Box>

          {currentQuestionIndex === quizData.content.questions.length - 1 ? (
            <Button
              variant="contained"
              color="success"
              onClick={() => setConfirmSubmitDialog(true)}
              endIcon={<EmojiEventsIcon />}
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              endIcon={<NavigateNextIcon />}
              onClick={handleNextQuestion}
              variant="contained"
            >
              Next
            </Button>
          )}
        </Box>
      </Card>

      {/* Submit Confirmation Dialog */}
      <Dialog
        open={confirmSubmitDialog}
        onClose={() => setConfirmSubmitDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Submit Quiz?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to submit your quiz? You will not be able to
            make changes after submission.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmSubmitDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSubmitQuiz}
            variant="contained"
            color="success"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default QuizPage
