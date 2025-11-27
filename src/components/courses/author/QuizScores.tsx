import React from "react"
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  LinearProgress,
  Box,
} from "@mui/material"
import { Quiz as QuizIcon } from "@mui/icons-material"
import { Quiz, TQuizScores, TUserScore } from "@/types/types"

interface QuizScoresProps {
  quizScores: TUserScore[]
  quizzes: Quiz[]
}

export const QuizScores: React.FC<QuizScoresProps> = ({
  quizScores,
  quizzes,
}) => {
  const getQuizDetails = (quizScore: TQuizScores) => {
    const quiz = quizzes?.find((q) => String(q.id) === String(quizScore.quizId))

    if (!quiz) {
      return null
    }

    const maxScore = quizScore?.maxScore * 100 || 100
    const passingScore = quiz.passingScore || quiz.content?.passingScore || 100

    if (
      typeof quizScore.score !== "number" ||
      typeof maxScore !== "number" ||
      maxScore <= 0
    ) {
      return null
    }

    const percentage = (quizScore.score / maxScore) * 100
    const passed = percentage >= passingScore

    return {
      quizTitle: quiz.title || `Quiz ${quizScore.quizId}`,
      percentage: Math.min(Math.round(percentage), 100),
      passed,
      score: quizScore.score,
      maxScore,
      completedAt: quizScore.createdOn,
    }
  }

  const validQuizScores = quizScores
    .map((quizScore) => {
      const details = getQuizDetails(quizScore)
      return details ? { ...quizScore, details } : null
    })
    .filter(Boolean)

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Quiz Scores
        </Typography>

        {validQuizScores.length > 0 ? (
          <List>
            {validQuizScores.map((quizScore) => (
              <ListItem key={quizScore?.quizId} divider>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" mb={1}>
                      <QuizIcon color="primary" sx={{ mr: 1 }} />
                      {quizScore?.details?.quizTitle}
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={quizScore?.details?.percentage}
                        sx={{ height: 8, borderRadius: 4, mb: 1 }}
                        color={quizScore?.details?.passed ? "success" : "error"}
                      />
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Chip
                          label={`${quizScore?.details?.score}/${quizScore?.details?.maxScore}`}
                          size="small"
                          color={
                            quizScore?.details?.passed ? "success" : "error"
                          }
                        />
                        <Typography variant="body2" color="text.secondary">
                          {quizScore?.details?.completedAt
                            ? new Date(
                                quizScore?.details?.completedAt
                              ).toLocaleDateString()
                            : "No date"}
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box textAlign="center" py={3}>
            <Typography variant="body2" color="text.secondary">
              No quiz attempts found
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
