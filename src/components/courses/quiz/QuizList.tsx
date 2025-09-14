"use client"

import React from "react"
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material"
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Quiz as QuizIcon,
  AccessTime as AccessTimeIcon,
  EmojiEvents as EmojiEventsIcon,
} from "@mui/icons-material"
import { useQuery, useMutation, useQueryClient } from "react-query"
import Link from "next/link"
import { allCourseQuiz } from "@/app/api/rest"
import { Quiz } from "@/types/types"

const QuizList: React.FC<{ id: string }> = ({ id }) => {
  const queryClient = useQueryClient()

  const {
    data: quizzes,
    isLoading,
    error,
  } = useQuery<Quiz[]>({
    queryKey: ["quizzes"],
    queryFn: () => allCourseQuiz(id),
    enabled: !!id,
  })

  const deleteQuizMutation = useMutation({
    mutationFn: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return id
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData(["quizzes"], (old: Quiz[] | undefined) =>
        old ? old.filter((quiz) => quiz.id !== deletedId) : []
      )
    },
  })

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Box textAlign="center">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading all quiz...
          </Typography>
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Error loading quiz: {(error as Error).message}
        </Alert>
        <Button
          variant="contained"
          onClick={() => queryClient.refetchQueries({ queryKey: ["quizzes"] })}
        >
          Try Again
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          All Quiz ({quizzes?.length || 0})
        </Typography>
        <Button
          variant="contained"
          component={Link}
          href={`/dashboard/courses/${id}/quizzes/add`}
          startIcon={<QuizIcon />}
          size="large"
        >
          Create New Quiz
        </Button>
      </Box>

      {quizzes?.length === 0 ? (
        <Paper
          sx={{ p: 6, textAlign: "center", borderRadius: 2 }}
          elevation={2}
        >
          <QuizIcon
            sx={{ fontSize: 80, color: "text.secondary", mb: 2, opacity: 0.5 }}
          />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No quiz yet
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 400, mx: "auto" }}
          >
            Create your first quiz to test your students&lsquo; knowledge and
            track their progress
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            href="/quizzes/create"
            sx={{ borderRadius: 2 }}
          >
            Create Your First Quiz
          </Button>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {quizzes?.map((quiz) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={quiz.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h6" component="h2" gutterBottom noWrap>
                      {quiz.content.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ mb: 2, height: 40, overflow: "hidden" }}
                    >
                      {quiz?.content?.description?.length > 100
                        ? `${quiz.content?.description.substring(0, 100)}...`
                        : quiz.content?.description}
                    </Typography>

                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
                    >
                      <Chip
                        icon={<AccessTimeIcon />}
                        label={formatDuration(quiz.content.timeLimit)}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                      <Chip
                        icon={<EmojiEventsIcon />}
                        label={`${quiz.content.passingScore} pts`}
                        size="small"
                        variant="outlined"
                        color="secondary"
                      />
                      <Chip
                        label={`${quiz.content.questions.length} Qs`}
                        size="small"
                        variant="outlined"
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Created {formatDate(quiz.createdOn)}
                      </Typography>
                      <Chip
                        label={quiz.lessonId}
                        size="small"
                        variant="filled"
                        color="default"
                      />
                    </Box>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      size="small"
                      component={Link}
                      href={`/quizzes/edit/${quiz.id}`}
                      startIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => {
                        if (
                          confirm("Are you sure you want to delete this quiz?")
                        ) {
                          deleteQuizMutation.mutate(quiz.id)
                        }
                      }}
                      disabled={deleteQuizMutation.isLoading}
                    >
                      Delete
                    </Button>
                    <Box sx={{ flexGrow: 1 }} />
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  )
}

export default QuizList
