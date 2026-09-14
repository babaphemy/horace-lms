"use client"

import {
  getAllMentorshipQuestionsKey,
  MentorshipQuestion,
} from "@/utils/mentorship"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import MarkUnreadChatAltRoundedIcon from "@mui/icons-material/MarkUnreadChatAltRounded"
import {
  Box,
  Button,
  Chip,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { useEffect, useState } from "react"

const MentorQueue = () => {
  const [questions, setQuestions] = useState<MentorshipQuestion[]>([])
  const [responses, setResponses] = useState<Record<string, string>>({})

  useEffect(() => {
    const saved = window.localStorage.getItem(getAllMentorshipQuestionsKey())
    setQuestions(saved ? (JSON.parse(saved) as MentorshipQuestion[]) : [])
  }, [])

  const markAnswered = (questionId: string) => {
    const nextQuestions: MentorshipQuestion[] = questions.map((question) =>
      question.id === questionId
        ? { ...question, status: "Answered" }
        : question
    )
    setQuestions(nextQuestions)
    window.localStorage.setItem(
      getAllMentorshipQuestionsKey(),
      JSON.stringify(nextQuestions)
    )
  }

  return (
    <Box sx={{ bgcolor: "#f6fafb", minHeight: "100vh" }}>
      <Box sx={{ bgcolor: "#062d3a", color: "white", py: { xs: 6, md: 9 } }}>
        <Container maxWidth="lg">
          <Typography
            component="p"
            sx={{
              color: "#74e4ef",
              fontWeight: 800,
              textTransform: "uppercase",
            }}
          >
            Mentor dashboard
          </Typography>
          <Typography
            component="h1"
            sx={{ mt: 1, fontSize: { xs: 40, md: 64 }, fontWeight: 900 }}
          >
            Async Q&A queue.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {questions.length === 0 ? (
          <Box
            sx={{
              bgcolor: "white",
              border: "1px solid #dce7eb",
              borderRadius: 2,
              p: 4,
              textAlign: "center",
            }}
          >
            <MarkUnreadChatAltRoundedIcon
              color="primary"
              sx={{ fontSize: 44 }}
            />
            <Typography variant="h5" fontWeight={900} sx={{ mt: 1 }}>
              No mentor questions yet.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {questions.map((question) => (
              <Box
                key={question.id}
                sx={{
                  bgcolor: "white",
                  border: "1px solid #dce7eb",
                  borderRadius: 2,
                  p: 3,
                }}
              >
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  justifyContent="space-between"
                  sx={{ mb: 2 }}
                >
                  <Box>
                    <Typography variant="h6" fontWeight={900}>
                      {question.lessonTitle}
                    </Typography>
                    <Typography color="text.secondary">
                      {question.trackTitle} / {question.mentorName}
                    </Typography>
                  </Box>
                  <Chip
                    label={question.status}
                    color={
                      question.status === "Answered" ? "success" : "primary"
                    }
                    variant="outlined"
                  />
                </Stack>
                <Typography sx={{ mb: 2 }}>{question.question}</Typography>
                <TextField
                  label="Mentor response"
                  multiline
                  minRows={3}
                  fullWidth
                  value={responses[question.id] || ""}
                  onChange={(event) =>
                    setResponses((current) => ({
                      ...current,
                      [question.id]: event.target.value,
                    }))
                  }
                />
                <Button
                  sx={{ mt: 2 }}
                  variant="contained"
                  startIcon={<CheckCircleRoundedIcon />}
                  disabled={!responses[question.id]?.trim()}
                  onClick={() => markAnswered(question.id)}
                >
                  Mark Answered
                </Button>
              </Box>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  )
}

export default MentorQueue
