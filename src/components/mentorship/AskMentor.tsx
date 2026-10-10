"use client"

import {
  createMentorshipId,
  getAllMentorshipQuestionsKey,
  getMentor,
  getMentorshipQuestionsKey,
  MentorshipQuestion,
} from "@/utils/mentorship"
import MarkUnreadChatAltRoundedIcon from "@mui/icons-material/MarkUnreadChatAltRounded"
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import Link from "next/link"
import { useMemo, useState } from "react"

interface AskMentorProps {
  trackId?: string
  mentorId?: string
  lessonId?: string
  lessonTitle?: string
  userId: string
}

const AskMentor = ({
  trackId,
  mentorId,
  lessonId,
  lessonTitle,
  userId,
}: AskMentorProps) => {
  const { track, mentor } = useMemo(
    () => getMentor(trackId, mentorId),
    [trackId, mentorId]
  )
  const [learnerName, setLearnerName] = useState("")
  const [question, setQuestion] = useState("")
  const [submitted, setSubmitted] = useState<MentorshipQuestion | null>(null)

  if (!track || !mentor) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" fontWeight={900}>
          Mentor unavailable
        </Typography>
      </Container>
    )
  }

  const contextLesson = lessonTitle || "General track question"
  const canSubmit = learnerName.trim() && question.trim().length >= 20

  const handleSubmit = () => {
    const nextQuestion: MentorshipQuestion = {
      id: createMentorshipId("question"),
      trackId: track.id,
      trackTitle: track.title,
      mentorId: mentor.id,
      mentorName: mentor.name,
      lessonId: lessonId || "general",
      lessonTitle: contextLesson,
      learnerName: learnerName.trim(),
      question: question.trim(),
      status: "Open",
      createdAt: new Date().toISOString(),
    }

    const userKey = getMentorshipQuestionsKey(userId)
    const userExisting = window.localStorage.getItem(userKey)
    const userQuestions = userExisting
      ? (JSON.parse(userExisting) as MentorshipQuestion[])
      : []
    window.localStorage.setItem(
      userKey,
      JSON.stringify([nextQuestion, ...userQuestions])
    )

    const allKey = getAllMentorshipQuestionsKey()
    const allExisting = window.localStorage.getItem(allKey)
    const allQuestions = allExisting
      ? (JSON.parse(allExisting) as MentorshipQuestion[])
      : []
    window.localStorage.setItem(
      allKey,
      JSON.stringify([nextQuestion, ...allQuestions])
    )

    setSubmitted(nextQuestion)
    setQuestion("")
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
            Async mentor Q&A
          </Typography>
          <Typography
            component="h1"
            sx={{
              mt: 1,
              fontSize: { xs: 40, md: 64 },
              lineHeight: 1,
              fontWeight: 900,
              maxWidth: 780,
            }}
          >
            Ask {mentor.name} about your current work.
          </Typography>
          <Typography sx={{ mt: 2, color: "rgba(255,255,255,0.82)" }}>
            {track.title} / {contextLesson}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        {submitted && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Your question is in the mentor queue with track and lesson context.
          </Alert>
        )}

        <Box
          sx={{
            bgcolor: "white",
            border: "1px solid #dce7eb",
            borderRadius: 2,
            p: 3,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Avatar src={mentor.photo} alt={mentor.name} />
            <Box>
              <Typography variant="h6" fontWeight={900}>
                {mentor.name}
              </Typography>
              <Typography color="text.secondary">
                {mentor.responseTime}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 3 }}>
            <Chip label={track.title} />
            <Chip label={contextLesson} variant="outlined" />
          </Stack>

          <Stack spacing={2}>
            <TextField
              label="Your name"
              value={learnerName}
              onChange={(event) => setLearnerName(event.target.value)}
              fullWidth
            />
            <TextField
              label="Question for your mentor"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              multiline
              minRows={8}
              fullWidth
              placeholder="Describe what you tried, what you expected, and where you are stuck."
            />
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ mt: 3 }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<MarkUnreadChatAltRoundedIcon />}
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              Send To Mentor
            </Button>
            <Button component={Link} href="/mentor/queue" size="large">
              View Mentor Queue
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}

export default AskMentor
