import { Quiz, TUserScore } from "@/types/types"
import { useMemo } from "react"

//? Calculate quiz metrics from quiz scores endpoint
export const useStudentMetrics = (
  courseQuiz: Quiz[],
  userScores: TUserScore[] | undefined
) => {
  const { averageScore, quizCompletionRate, quizProgress } = useMemo(() => {
    if (!courseQuiz || !userScores) {
      return {
        averageScore: 0,
        quizCompletionRate: 0,
        quizProgress: 0,
      }
    }

    try {
      const quizzes = courseQuiz
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
          const maxScore =
            quizScore?.maxScore > 0 && quizScore?.maxScore <= 1
              ? quizScore?.maxScore * 100
              : quizScore?.maxScore || 100
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

  return { averageScore, quizCompletionRate, quizProgress }
}
