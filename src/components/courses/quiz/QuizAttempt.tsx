"use client"

import React, { useState, useEffect } from "react"
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  EmojiEvents as EmojiEventsIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material"

interface QuizOption {
  id: string
  text: string
}

interface QuizQuestion {
  id: number
  type: string
  question: string
  points: number
  options: QuizOption[]
  correctAnswer: string
  explanation: string
}

interface QuizContent {
  title: string
  description: string
  timeLimit: number
  passingScore: number
  questions: QuizQuestion[]
}

interface QuizData {
  lessonId: number
  content: QuizContent
}

interface UserAnswer {
  questionId: number
  selectedAnswer: string
  isCorrect: boolean
  pointsEarned: number
}

interface QuizAttemptProps {
  quizData: QuizData
  onQuizComplete?: (
    _score: number,
    _totalPoints: number,
    _answers: UserAnswer[]
  ) => void
}

const QuizAttempt: React.FC<QuizAttemptProps> = ({
  quizData,
  onQuizComplete,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(quizData.content.timeLimit * 60)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizFinished, setQuizFinished] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  //? Start the timer when quiz starts
  useEffect(() => {
    if (!quizStarted || quizFinished) return

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          handleFinishQuiz()
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizStarted, quizFinished])

  const currentQuestion = quizData.content.questions[currentQuestionIndex]
  const userAnswer = userAnswers.find(
    (answer) => answer.questionId === currentQuestion.id
  )

  const handleAnswerSelect = (answer: string) => {
    const isCorrect = answer === currentQuestion.correctAnswer
    const pointsEarned = isCorrect ? currentQuestion.points : 0

    //? Update or add the answer
    const updatedAnswers = userAnswers.filter(
      (a) => a.questionId !== currentQuestion.id
    )
    updatedAnswers.push({
      questionId: currentQuestion.id,
      selectedAnswer: answer,
      isCorrect,
      pointsEarned,
    })

    setUserAnswers(updatedAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.content.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setShowExplanation(false)
    } else {
      handleFinishQuiz()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
      setShowExplanation(false)
    }
  }

  const handleFinishQuiz = () => {
    setQuizFinished(true)
    setShowResults(true)

    if (onQuizComplete) {
      const totalScore = userAnswers.reduce(
        (sum, answer) => sum + answer.pointsEarned,
        0
      )
      const totalPoints = quizData.content.questions.reduce(
        (sum, question) => sum + question.points,
        0
      )
      onQuizComplete(totalScore, totalPoints, userAnswers)
    }
  }

  const handleStartQuiz = () => {
    setQuizStarted(true)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const calculateScore = () => {
    const totalScore = userAnswers.reduce(
      (sum, answer) => sum + answer.pointsEarned,
      0
    )
    const totalPoints = quizData.content.questions.reduce(
      (sum, question) => sum + question.points,
      0
    )
    const percentage = (totalScore / totalPoints) * 100
    const passed = percentage >= quizData.content.passingScore

    return { totalScore, totalPoints, percentage, passed }
  }

  const { totalScore, totalPoints, percentage, passed } = calculateScore()

  if (!quizStarted) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {quizData.content.title}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {quizData.content.description}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Chip
              icon={<AccessTimeIcon />}
              label={`Time Limit: ${quizData.content.timeLimit} minutes`}
              sx={{ mr: 1, mb: 1 }}
            />
            <Chip
              label={`${quizData.content.questions.length} questions`}
              sx={{ mr: 1, mb: 1 }}
            />
            <Chip
              label={`Passing Score: ${quizData.content.passingScore}%`}
              sx={{ mb: 1 }}
            />
          </Box>

          <Button variant="contained" size="large" onClick={handleStartQuiz}>
            Start Quiz
          </Button>
        </Paper>
      </Container>
    )
  }

  if (quizFinished && showResults) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <EmojiEventsIcon
              sx={{
                fontSize: 60,
                color: passed ? "success.main" : "error.main",
                mb: 2,
              }}
            />

            <Typography variant="h4" component="h2" gutterBottom>
              {passed ? "Congratulations!" : "Quiz Completed"}
            </Typography>

            <Typography variant="h6" color="text.secondary" gutterBottom>
              You scored {totalScore} out of {totalPoints} points
            </Typography>

            <Typography
              variant="h5"
              color={passed ? "success.main" : "error.main"}
              sx={{ mb: 3 }}
            >
              {percentage.toFixed(1)}% - {passed ? "Passed" : "Failed"}
            </Typography>

            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{
                height: 10,
                borderRadius: 5,
                mb: 3,
                backgroundColor: passed ? "success.light" : "error.light",
              }}
            />
          </Box>

          <Typography variant="h6" gutterBottom>
            Question Review
          </Typography>

          {quizData.content.questions.map((question, index) => {
            const userAnswer = userAnswers.find(
              (a) => a.questionId === question.id
            )

            return (
              <Card key={question.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                      Q{index + 1}: {question.question}
                    </Typography>

                    {userAnswer?.isCorrect ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <CancelIcon color="error" />
                    )}
                  </Box>

                  <Box sx={{ pl: 2 }}>
                    {question.options.map((option) => (
                      <Box
                        key={option.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color:
                            option.id === question.correctAnswer
                              ? "success.main"
                              : userAnswer?.selectedAnswer === option.id
                                ? "error.main"
                                : "text.primary",
                        }}
                      >
                        <Typography variant="body2">
                          {option.id.toUpperCase()}. {option.text}
                        </Typography>

                        {option.id === question.correctAnswer && (
                          <CheckCircleIcon sx={{ fontSize: 16, ml: 1 }} />
                        )}
                      </Box>
                    ))}
                  </Box>

                  {question.explanation && (
                    <Alert severity="info" sx={{ mt: 1 }}>
                      <strong>Explanation:</strong> {question.explanation}
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Header with progress and timer */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6">
            Question {currentQuestionIndex + 1} of{" "}
            {quizData.content.questions.length}
          </Typography>

          <Chip
            icon={<AccessTimeIcon />}
            label={formatTime(timeLeft)}
            color={timeLeft < 60 ? "error" : "default"}
          />
        </Box>

        <LinearProgress
          variant="determinate"
          value={
            ((currentQuestionIndex + 1) / quizData.content.questions.length) *
            100
          }
          sx={{ mb: 3, height: 8 }}
        />

        {/* Question */}
        <Typography variant="h6" gutterBottom>
          {currentQuestion.question}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          ({currentQuestion.points} point
          {currentQuestion.points !== 1 ? "s" : ""})
        </Typography>

        {/* Answer options */}
        <FormControl component="fieldset" sx={{ width: "100%", mt: 2 }}>
          <RadioGroup
            value={userAnswer?.selectedAnswer || ""}
            onChange={(e) => handleAnswerSelect(e.target.value)}
          >
            {currentQuestion.options.map((option) => (
              <FormControlLabel
                key={option.id}
                value={option.id}
                control={<Radio />}
                label={option.text}
                disabled={showExplanation}
                sx={{
                  mb: 1,
                  p: 1,
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: showExplanation
                    ? option.id === currentQuestion.correctAnswer
                      ? "success.main"
                      : userAnswer?.selectedAnswer === option.id
                        ? "error.main"
                        : "divider"
                    : "divider",
                  backgroundColor: showExplanation
                    ? option.id === currentQuestion.correctAnswer
                      ? "success.light"
                      : userAnswer?.selectedAnswer === option.id
                        ? "error.light"
                        : "transparent"
                    : "transparent",
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>

        {/* Explanation */}
        {showExplanation && currentQuestion.explanation && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <strong>Explanation:</strong> {currentQuestion.explanation}
          </Alert>
        )}

        {/* Navigation buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>

          {!showExplanation && userAnswer ? (
            <Button
              variant="contained"
              onClick={() => setShowExplanation(true)}
            >
              Check Answer
            </Button>
          ) : (
            <Button
              variant="contained"
              endIcon={
                currentQuestionIndex ===
                quizData.content.questions.length - 1 ? null : (
                  <ArrowForwardIcon />
                )
              }
              onClick={handleNextQuestion}
            >
              {currentQuestionIndex === quizData.content.questions.length - 1
                ? "Finish Quiz"
                : "Next Question"}
            </Button>
          )}
        </Box>
      </Paper>

      {/* Finish quiz dialog */}
      <Dialog
        open={
          currentQuestionIndex === quizData.content.questions.length - 1 &&
          !showExplanation &&
          !!userAnswer
        }
      >
        <DialogTitle>Finish Quiz?</DialogTitle>
        <DialogContent>
          <Typography>
            You&apos;ve answered all questions. Would you like to finish the
            quiz and see your results?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExplanation(true)}>
            Review Answer
          </Button>
          <Button variant="contained" onClick={handleFinishQuiz}>
            Finish Quiz
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default QuizAttempt
