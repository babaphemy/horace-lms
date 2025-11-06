"use client"
import useLessonQuiz from "@/hooks/useLessonQuiz"
import { QuizOption, QuizQuestion } from "@/types/types"
import { useParams, useRouter } from "next/navigation"
import React, { useState, useEffect, useRef, useCallback } from "react"

interface UserAnswer {
  questionId: number
  answer: string
  isCorrect?: boolean
}

const QuizPage = () => {
  const params = useParams()
  const { lid, cid } = params
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [confirmSubmitDialog, setConfirmSubmitDialog] = useState(false)

  // Use ref to track if component is mounted
  const isMountedRef = useRef(true)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const { quiz: quizData } = useLessonQuiz({ lid: lid as string })

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const handleBackToClassroom = () => {
    router.push(`/course/classroom?courseId=${cid}`)
  }

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

  const calculateResults = useCallback(() => {
    if (!isMountedRef.current) return

    setUserAnswers((prevAnswers) => {
      const updatedAnswers = prevAnswers.map((ua) => {
        const question = quizData.content.questions.find(
          (q: QuizQuestion) => q.id === ua.questionId
        )
        if (!question) return ua

        let isCorrect = false
        if (question.type === "short_answer") {
          if (!ua.answer || !question.correctAnswer) {
            isCorrect = false
          } else {
            isCorrect = ua.answer
              .toLowerCase()
              .trim()
              .includes(
                question.correctAnswer.toLowerCase().trim().substring(0, 10)
              )
          }
        } else {
          isCorrect = ua.answer === question.correctAnswer
        }

        return { ...ua, isCorrect }
      })

      return updatedAnswers
    })

    setShowResults(true)
  }, [quizData])

  const handleTimeUp = useCallback(() => {
    if (!isMountedRef.current) return
    setQuizCompleted(true)
    calculateResults()
  }, [calculateResults])

  // Optimized timer effect - removed timeRemaining from dependencies
  useEffect(() => {
    if (quizStarted && !quizCompleted) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Clear interval before calling handleTimeUp
            if (timerRef.current) {
              clearInterval(timerRef.current)
              timerRef.current = null
            }
            handleTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }
      }
    }
  }, [quizStarted, quizCompleted, handleTimeUp])

  const handleSubmitQuiz = () => {
    setConfirmSubmitDialog(false)
    setQuizCompleted(true)
    calculateResults()
  }

  const currentQuestion = quizData?.content?.questions[currentQuestionIndex]
  const currentAnswer =
    userAnswers.find((ua) => ua.questionId === currentQuestion?.id)?.answer ||
    ""

  const lessonProgress =
    ((currentQuestionIndex + 1) / quizData?.content?.questions?.length) * 100

  const totalPoints = quizData?.content?.questions?.reduce(
    (sum: number, q: QuizQuestion) => sum + q.points,
    0
  )
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
          <div className="space-y-3">
            {currentQuestion.options.map((option: QuizOption) => (
              <label
                key={option.id}
                className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="radio"
                  name={`question_${currentQuestion.id}`}
                  value={option.id}
                  checked={currentAnswer === option.id}
                  onChange={(e) =>
                    handleAnswerChange(currentQuestion.id, e.target.value)
                  }
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">{option.text}</span>
              </label>
            ))}
          </div>
        )

      case "short_answer":
        return (
          <textarea
            value={currentAnswer}
            onChange={(e) =>
              handleAnswerChange(currentQuestion.id, e.target.value)
            }
            placeholder="Enter your answer here..."
            className="w-full p-3 border rounded-lg resize-none h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
          />
        )

      default:
        return null
    }
  }

  // Quiz start screen
  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-4">
          <button
            onClick={handleBackToClassroom}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ← Back to Classroom
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-3xl font-bold mb-3">
            {quizData?.content?.title}
          </h1>
          <p className="text-gray-600 mb-6">{quizData?.content?.description}</p>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
              <span className="text-sm">
                ⏱️ Time Limit: {quizData?.content?.timeLimit} minutes
              </span>
            </div>
            <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
              <span className="text-sm">
                🎯 Passing Score: {quizData?.content?.passingScore}%
              </span>
            </div>
            <div className="flex items-center bg-purple-100 px-3 py-1 rounded-full">
              <span className="text-sm">
                📊 {quizData?.content?.questions?.length} Questions
              </span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold mb-2">Instructions:</h3>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Read each question carefully before answering</li>
              <li>
                You can navigate between questions using the navigation buttons
              </li>
              <li>Your progress is automatically saved</li>
              <li>Submit your quiz before time runs out</li>
            </ul>
          </div>

          <button
            onClick={handleStartQuiz}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Quiz
          </button>
        </div>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div
              className={`text-6xl mb-4 ${passed ? "text-green-500" : "text-red-500"}`}
            >
              {passed ? "✅" : "❌"}
            </div>
            <h1 className="text-3xl font-bold mb-2">
              Quiz {passed ? "Passed!" : "Failed"}
            </h1>
            <div
              className={`text-4xl font-bold mb-2 ${passed ? "text-green-500" : "text-red-500"}`}
            >
              {scorePercentage}%
            </div>
            <p className="text-gray-600">
              You scored {earnedPoints} out of {totalPoints} points
            </p>
          </div>

          <hr className="my-6" />

          <h2 className="text-xl font-semibold mb-4">Review Your Answers:</h2>
          <div className="space-y-4">
            {quizData.content.questions.map(
              (question: QuizQuestion, index: number) => {
                const userAnswer = userAnswers.find(
                  (ua) => ua.questionId === question.id
                )
                const isCorrect = userAnswer?.isCorrect || false

                return (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium">
                        Question {index + 1}: {question.question}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          isCorrect
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {isCorrect ? "Correct" : "Incorrect"}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">
                        <span className="font-medium">Your answer:</span>{" "}
                        {userAnswer?.answer || "No answer"}
                      </p>
                      {!isCorrect && (
                        <p className="text-green-600">
                          <span className="font-medium">Correct answer:</span>{" "}
                          {question.correctAnswer}
                        </p>
                      )}
                      <p className="text-gray-500">
                        <span className="font-medium">Points:</span>{" "}
                        {question.points}
                      </p>
                    </div>
                  </div>
                )
              }
            )}
          </div>

          <div className="flex gap-3 justify-center mt-8">
            <button
              onClick={handleBackToClassroom}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to Classroom
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Take Quiz Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Main quiz interface
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToClassroom}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ← Back to Classroom
            </button>
          </div>
          <h1 className="text-2xl font-bold">{quizData.content.title}</h1>
          <div
            className={`px-3 py-1 rounded-full font-semibold ${
              timeRemaining < 300
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            ⏱️ {formatTime(timeRemaining)}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              Question {currentQuestionIndex + 1} of{" "}
              {quizData.content.questions.length}
            </span>
            <span>{Math.round(lessonProgress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${lessonProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="border rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-medium">{currentQuestion.question}</h2>
            <span className="bg-gray-100 px-2 py-1 rounded text-sm">
              {currentQuestion.points} pts
            </span>
          </div>

          {renderQuestion()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            ← Previous
          </button>

          <div className="flex gap-2">
            {quizData.content.questions.map(
              (_: QuizQuestion, index: number) => (
                <button
                  key={index}
                  onClick={() => handleGoToQuestion(index)}
                  className={`w-10 h-10 rounded border font-medium transition-colors ${
                    index === currentQuestionIndex
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {index + 1}
                </button>
              )
            )}
          </div>

          {currentQuestionIndex === quizData.content.questions.length - 1 ? (
            <button
              onClick={() => setConfirmSubmitDialog(true)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next →
            </button>
          )}
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      {confirmSubmitDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Submit Quiz?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit your quiz? You will not be able to
              make changes after submission.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmSubmitDialog(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitQuiz}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuizPage
