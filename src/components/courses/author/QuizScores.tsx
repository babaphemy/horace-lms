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
import { Quiz, TUserScore } from "@/types/types"

interface QuizScoresProps {
  quizScores: TUserScore[]
  quizzes: Quiz[]
}

export const QuizScores: React.FC<QuizScoresProps> = ({
  quizScores,
  quizzes,
}) => {
  const getQuizDetails = (quiz: Quiz, quizScore?: TUserScore) => {
    if (!quiz) {
      return null
    }

    // If no score, quiz is not attempted
    if (!quizScore) {
      return {
        quizTitle: quiz.title || `Quiz ${quiz.id}`,
        percentage: 0,
        passed: false,
        score: 0,
        maxScore: quiz.passingScore || quiz.content?.passingScore || 100,
        completedAt: null,
        attempted: false,
      }
    }

    //? max score is showing figure 1. It may be a bug or intentional. So i try to handle both cases.
    const maxScore =
      quizScore?.maxScore > 0 && quizScore?.maxScore <= 1
        ? quizScore?.maxScore * 100
        : quizScore?.maxScore || 100
    const passingScore = quiz.passingScore || quiz.content?.passingScore || 100

    if (
      typeof quizScore.score !== "number" ||
      typeof maxScore !== "number" ||
      maxScore <= 0
    ) {
      return {
        quizTitle: quiz.title || `Quiz ${quiz.id}`,
        percentage: 0,
        passed: false,
        score: 0,
        maxScore: passingScore,
        completedAt: null,
        attempted: false,
      }
    }

    const percentage = (quizScore.score / maxScore) * 100
    const passed = percentage >= passingScore

    return {
      quizTitle: quiz.title || `Quiz ${quiz.id}`,
      percentage: Math.min(Math.round(percentage), 100),
      passed,
      score: quizScore.score,
      maxScore,
      completedAt: quizScore.createdOn,
      attempted: true,
    }
  }

  // Show ALL quizzes, not just ones with scores
  const allQuizzesWithDetails = (quizzes || [])
    .map((quiz) => {
      const quizScore = quizScores?.find(
        (score) => String(score.quizId) === String(quiz.id)
      )
      const details = getQuizDetails(quiz, quizScore)
      return details ? { quiz, quizScore, details } : null
    })
    .filter(Boolean)

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Quiz Scores
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ mt: 0.5 }}
          >
            All quizzes in the course
          </Typography>
        </Typography>

        {allQuizzesWithDetails.length > 0 ? (
          <List>
            {allQuizzesWithDetails.map((item) => (
              <ListItem key={item?.quiz?.id} divider>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" mb={1}>
                      <QuizIcon
                        color={
                          item?.details?.attempted ? "primary" : "disabled"
                        }
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body1" fontWeight="medium">
                        {item?.details?.quizTitle}
                      </Typography>
                      {!item?.details?.attempted && (
                        <Chip
                          label="Not Attempted"
                          size="small"
                          color="default"
                          variant="outlined"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      {item?.details?.attempted ? (
                        <>
                          <LinearProgress
                            variant="determinate"
                            value={item?.details?.percentage}
                            sx={{ height: 8, borderRadius: 4, mb: 1 }}
                            color={item?.details?.passed ? "success" : "error"}
                          />
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            flexWrap="wrap"
                            gap={1}
                          >
                            <Box display="flex" gap={1} alignItems="center">
                              <Chip
                                label={`${item?.details?.score}/${item?.details?.maxScore}`}
                                size="small"
                                color={
                                  item?.details?.passed ? "success" : "error"
                                }
                              />
                              <Chip
                                label={`${item?.details?.percentage}%`}
                                size="small"
                                variant="outlined"
                                color={
                                  item?.details?.passed ? "success" : "error"
                                }
                              />
                              {item?.details?.passed && (
                                <Chip
                                  label="Passed"
                                  size="small"
                                  color="success"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {item?.details?.completedAt
                                ? `Completed: ${new Date(
                                    item?.details?.completedAt
                                  ).toLocaleDateString()}`
                                : "No date"}
                            </Typography>
                          </Box>
                        </>
                      ) : (
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            This quiz has not been attempted yet.
                          </Typography>
                          <Chip
                            label={`Max Score: ${item?.details?.maxScore}`}
                            size="small"
                            variant="outlined"
                            color="default"
                          />
                        </Box>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box textAlign="center" py={3}>
            <Typography variant="body2" color="text.secondary">
              No quizzes found in this course
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
