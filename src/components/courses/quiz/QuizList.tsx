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
  Avatar,
} from "@mui/material"
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Quiz as QuizIcon,
  AccessTime as AccessTimeIcon,
  EmojiEvents as EmojiEventsIcon,
  Person as PersonIcon,
} from "@mui/icons-material"
import { useQuery, useMutation, useQueryClient } from "react-query"
import Link from "next/link"
import Image from "next/image"

// Define the quiz interface
interface Quiz {
  id: string
  quizName: string
  createdBy: number
  courseId: string
  coverTitle: string
  description: string
  coverImage?: string
  totalDuration: number
  totalPoints: number
  questionsCount: number
  createdAt: string
  accessibility: {
    review: boolean
    countdown: boolean
    countdownTransition: boolean
    countDown: number
    showAnswer: boolean
    showResult: boolean
  }
}

// Dummy data for demonstration
const dummyQuizzes: Quiz[] = [
  {
    id: "1",
    quizName: "JavaScript Basics",
    createdBy: 1,
    courseId: "web-dev-101",
    coverTitle: "Test Your JS Knowledge",
    description:
      "A comprehensive quiz covering fundamental JavaScript concepts including variables, functions, and control flow.",
    coverImage:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    totalDuration: 1200,
    totalPoints: 100,
    questionsCount: 10,
    createdAt: "2023-05-15T10:30:00Z",
    accessibility: {
      review: true,
      countdown: true,
      countdownTransition: true,
      countDown: 5,
      showAnswer: true,
      showResult: true,
    },
  },
  {
    id: "2",
    quizName: "React Fundamentals",
    createdBy: 1,
    courseId: "react-course",
    coverTitle: "Master React Concepts",
    description:
      "Test your understanding of React components, hooks, state management, and JSX syntax.",
    coverImage:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    totalDuration: 1800,
    totalPoints: 150,
    questionsCount: 15,
    createdAt: "2023-06-20T14:45:00Z",
    accessibility: {
      review: true,
      countdown: true,
      countdownTransition: false,
      countDown: 3,
      showAnswer: false,
      showResult: true,
    },
  },
  {
    id: "3",
    quizName: "CSS Layout Techniques",
    createdBy: 2,
    courseId: "css-mastery",
    coverTitle: "CSS Layout Challenge",
    description:
      "A quiz focused on CSS layout techniques including Flexbox, Grid, and responsive design principles.",
    coverImage:
      "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    totalDuration: 900,
    totalPoints: 80,
    questionsCount: 8,
    createdAt: "2023-07-05T09:15:00Z",
    accessibility: {
      review: false,
      countdown: false,
      countdownTransition: false,
      countDown: 0,
      showAnswer: true,
      showResult: true,
    },
  },
  {
    id: "4",
    quizName: "TypeScript Advanced",
    createdBy: 1,
    courseId: "typescript-pro",
    coverTitle: "TypeScript Mastery Test",
    description:
      "Advanced TypeScript concepts including generics, type guards, decorators, and advanced type manipulation.",
    coverImage:
      "https://images.unsplash.com/photo-1581276879432-15e50529f34b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    totalDuration: 2400,
    totalPoints: 200,
    questionsCount: 20,
    createdAt: "2023-08-12T16:20:00Z",
    accessibility: {
      review: true,
      countdown: true,
      countdownTransition: true,
      countDown: 10,
      showAnswer: true,
      showResult: true,
    },
  },
  {
    id: "5",
    quizName: "Node.js Backend",
    createdBy: 2,
    courseId: "nodejs-fundamentals",
    coverTitle: "Server-Side JavaScript",
    description:
      "Test your knowledge of Node.js, Express, REST APIs, and server-side JavaScript development.",
    coverImage:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    totalDuration: 1500,
    totalPoints: 120,
    questionsCount: 12,
    createdAt: "2023-09-18T11:10:00Z",
    accessibility: {
      review: true,
      countdown: true,
      countdownTransition: false,
      countDown: 5,
      showAnswer: false,
      showResult: true,
    },
  },
  {
    id: "6",
    quizName: "Database Design",
    createdBy: 3,
    courseId: "db-design-101",
    coverTitle: "SQL and NoSQL Concepts",
    description:
      "A quiz covering database design principles, normalization, SQL queries, and NoSQL concepts.",
    coverImage:
      "https://images.unsplash.com/photo-1543946607-1e3566af6a1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    totalDuration: 2100,
    totalPoints: 180,
    questionsCount: 18,
    createdAt: "2023-10-22T13:25:00Z",
    accessibility: {
      review: false,
      countdown: true,
      countdownTransition: true,
      countDown: 7,
      showAnswer: true,
      showResult: true,
    },
  },
]

const QuizList: React.FC<{ id: string }> = ({ id }) => {
  const queryClient = useQueryClient()

  const {
    data: quizzes,
    isLoading,
    error,
  } = useQuery<Quiz[]>({
    queryKey: ["quizzes"],
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return dummyQuizzes
    },

    initialData: dummyQuizzes,
  })

  const deleteQuizMutation = useMutation({
    mutationFn: async (id: string) => {
      // Simulate API call
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
            Loading quizzes...
          </Typography>
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Error loading quizzes: {(error as Error).message}
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
          Course Quizzes
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
            No quizzes yet
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
          <Typography variant="h6" sx={{ mb: 3, color: "text.secondary" }}>
            {quizzes?.length} {quizzes?.length === 1 ? "quiz" : "quizzes"}{" "}
            available
          </Typography>

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
                  {quiz.coverImage && (
                    <Box sx={{ height: 160, overflow: "hidden" }}>
                      <Image
                        src={quiz.coverImage}
                        alt={quiz.coverTitle}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        width={400}
                        height={300}
                      />
                    </Box>
                  )}
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h6" component="h2" gutterBottom noWrap>
                      {quiz.quizName}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {quiz.coverTitle}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ mb: 2, height: 40, overflow: "hidden" }}
                    >
                      {quiz.description.length > 100
                        ? `${quiz.description.substring(0, 100)}...`
                        : quiz.description}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          mr: 1,
                          bgcolor: "primary.main",
                        }}
                      >
                        <PersonIcon sx={{ fontSize: 16 }} />
                      </Avatar>
                      <Typography variant="caption">
                        Instructor ID: {quiz.createdBy}
                      </Typography>
                    </Box>

                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
                    >
                      <Chip
                        icon={<AccessTimeIcon />}
                        label={formatDuration(quiz.totalDuration)}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                      <Chip
                        icon={<EmojiEventsIcon />}
                        label={`${quiz.totalPoints} pts`}
                        size="small"
                        variant="outlined"
                        color="secondary"
                      />
                      <Chip
                        label={`${quiz.questionsCount} Qs`}
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
                        Created {formatDate(quiz.createdAt)}
                      </Typography>
                      <Chip
                        label={quiz.courseId}
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
                    <Button
                      size="small"
                      variant="contained"
                      sx={{ borderRadius: 2 }}
                    >
                      Start
                    </Button>
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
