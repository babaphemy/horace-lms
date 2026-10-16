"use client"

import {
  getAllMentorshipQuestionsKey,
  getMentorshipQuestionsKey,
  MentorshipQuestion,
  notifyLearner,
} from "@/utils/mentorship"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import MarkUnreadChatAltRoundedIcon from "@mui/icons-material/MarkUnreadChatAltRounded"
import {
  Box,
  Button,
  Chip,
  Container,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material"
import { useEffect, useState } from "react"

const MentorQueue = () => {
  const [questions, setQuestions] = useState<MentorshipQuestion[]>([])
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [filter, setFilter] = useState<"All" | "Open" | "Answered">("All")

  useEffect(() => {
    const saved = window.localStorage.getItem(getAllMentorshipQuestionsKey())
    const list = saved ? (JSON.parse(saved) as MentorshipQuestion[]) : []
    setQuestions(list)
    const initialResponses: Record<string, string> = {}
    list.forEach((q) => {
      if (q.answer) {
        initialResponses[q.id] = q.answer
      }
    })
    setResponses(initialResponses)
  }, [])

  const markAnswered = (questionId: string) => {
    const responseText = responses[questionId]?.trim()
    if (!responseText) return

    const target = questions.find((q) => q.id === questionId)

    const nextQuestions: MentorshipQuestion[] = questions.map((question) =>
      question.id === questionId
        ? {
            ...question,
            status: "Answered",
            answer: responseText,
            answeredAt: new Date().toISOString(),
          }
        : question
    )
    setQuestions(nextQuestions)
    window.localStorage.setItem(
      getAllMentorshipQuestionsKey(),
      JSON.stringify(nextQuestions)
    )

    if (target?.userId) {
      const userKey = getMentorshipQuestionsKey(target.userId)
      const userSaved = window.localStorage.getItem(userKey)
      const userQuestions = userSaved
        ? (JSON.parse(userSaved) as MentorshipQuestion[])
        : []
      const updatedUserQuestions = userQuestions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              status: "Answered" as const,
              answer: responseText,
              answeredAt: new Date().toISOString(),
            }
          : q
      )
      window.localStorage.setItem(userKey, JSON.stringify(updatedUserQuestions))

      notifyLearner(
        target.userId,
        `Your mentor ${target.mentorName} replied to your question on "${target.lessonTitle}".`
      )
    }
  }

  const filteredQuestions = questions.filter((q) => {
    if (filter === "Open") return q.status !== "Answered"
    if (filter === "Answered") return q.status === "Answered"
    return true
  })

  const openCount = questions.filter((q) => q.status !== "Answered").length

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
          <Typography sx={{ mt: 1.5, color: "rgba(255,255,255,0.82)" }}>
            {openCount} question{openCount === 1 ? "" : "s"} awaiting mentor
            response.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ mb: 3 }}>
          <Tabs
            value={filter}
            onChange={(_, val) => setFilter(val)}
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label={`All (${questions.length})`} value="All" />
            <Tab label={`Open (${openCount})`} value="Open" />
            <Tab
              label={`Answered (${questions.length - openCount})`}
              value="Answered"
            />
          </Tabs>
        </Box>

        {filteredQuestions.length === 0 ? (
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
              {filter === "Open"
                ? "No open questions! All caught up."
                : "No questions in this filter."}
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2.5}>
            {filteredQuestions.map((question) => (
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
                      {question.trackTitle} &bull; Learner:{" "}
                      {question.learnerName} &bull; Mentor:{" "}
                      {question.mentorName}
                    </Typography>
                  </Box>
                  <Chip
                    label={question.status}
                    color={
                      question.status === "Answered" ? "success" : "warning"
                    }
                    variant={
                      question.status === "Answered" ? "filled" : "outlined"
                    }
                  />
                </Stack>
                <Typography
                  sx={{ mb: 2, bgcolor: "#f8fafb", p: 2, borderRadius: 1.5 }}
                >
                  {question.question}
                </Typography>

                {question.answer && (
                  <Box
                    sx={{
                      mb: 2,
                      p: 2,
                      bgcolor: "#f0fdf4",
                      borderLeft: "4px solid #16a34a",
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight={800}
                      color="#15803d"
                    >
                      Current Preserved Response:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ whiteSpace: "pre-wrap", mt: 0.5 }}
                    >
                      {question.answer}
                    </Typography>
                    {question.answeredAt && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mt: 0.5 }}
                      >
                        Answered:{" "}
                        {new Date(question.answeredAt).toLocaleString()}
                      </Typography>
                    )}
                  </Box>
                )}

                <TextField
                  label={
                    question.status === "Answered"
                      ? "Update answer"
                      : "Mentor response"
                  }
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
                  placeholder="Type clear, actionable guidance with references to rubrics or docs..."
                />
                <Button
                  sx={{ mt: 2 }}
                  variant="contained"
                  startIcon={<CheckCircleRoundedIcon />}
                  disabled={!responses[question.id]?.trim()}
                  onClick={() => markAnswered(question.id)}
                >
                  {question.status === "Answered"
                    ? "Update Response"
                    : "Submit Answer & Notify Learner"}
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
