"use client"

import {
  getAllLabSubmissionsKey,
  getLabNotificationsKey,
  getLabRubric,
  getLabSubmissionsKey,
  LabReviewOutcome,
  LabSubmission,
} from "@/utils/labs"
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import RateReviewRoundedIcon from "@mui/icons-material/RateReviewRounded"
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { useEffect, useMemo, useState } from "react"

const scoreOptions = ["Needs work", "Meets expectations", "Strong"]

const MentorSubmissions = () => {
  const [submissions, setSubmissions] = useState<LabSubmission[]>([])
  const [selectedId, setSelectedId] = useState("")
  const [comments, setComments] = useState("")
  const [scores, setScores] = useState<Record<string, string>>({})
  const [reviewedMessage, setReviewedMessage] = useState("")
  const rubric = useMemo(() => getLabRubric(), [])

  useEffect(() => {
    const saved = window.localStorage.getItem(getAllLabSubmissionsKey())
    const queue = saved ? (JSON.parse(saved) as LabSubmission[]) : []
    const sorted = queue.sort((a, b) => {
      const trackSort = a.courseId.localeCompare(b.courseId)
      if (trackSort !== 0) return trackSort
      return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()
    })
    setSubmissions(sorted)
    setSelectedId(sorted[0]?.id || "")
  }, [])

  const selectedSubmission = submissions.find((item) => item.id === selectedId)
  const pendingCount = submissions.filter(
    (item) => item.status !== "Reviewed"
  ).length

  const saveSubmissionUpdate = (reviewedSubmission: LabSubmission) => {
    const nextQueue = submissions.map((item) =>
      item.id === reviewedSubmission.id ? reviewedSubmission : item
    )
    setSubmissions(nextQueue)
    window.localStorage.setItem(
      getAllLabSubmissionsKey(),
      JSON.stringify(nextQueue)
    )

    const userKey = getLabSubmissionsKey(reviewedSubmission.userId || "guest")
    const savedUserSubmissions = window.localStorage.getItem(userKey)
    const userSubmissions = savedUserSubmissions
      ? (JSON.parse(savedUserSubmissions) as LabSubmission[])
      : []
    const nextUserSubmissions = userSubmissions.map((item) =>
      item.id === reviewedSubmission.id ? reviewedSubmission : item
    )
    window.localStorage.setItem(userKey, JSON.stringify(nextUserSubmissions))
  }

  const startReview = (submission: LabSubmission) => {
    const inReviewSubmission: LabSubmission = {
      ...submission,
      status: "In Review",
    }

    saveSubmissionUpdate(inReviewSubmission)
    setReviewedMessage(`${inReviewSubmission.lessonTitle} moved to In Review.`)
  }

  const updateSubmission = (
    submission: LabSubmission,
    outcome: LabReviewOutcome
  ) => {
    const reviewedSubmission: LabSubmission = {
      ...submission,
      status: "Reviewed",
      outcome,
      public: outcome === "Pass",
      reviewerComments: comments.trim(),
      rubricScores: scores,
      reviewedAt: new Date().toISOString(),
    }

    saveSubmissionUpdate(reviewedSubmission)

    const notificationKey = getLabNotificationsKey(
      reviewedSubmission.userId || "guest"
    )
    const savedNotifications = window.localStorage.getItem(notificationKey)
    const notifications = savedNotifications
      ? (JSON.parse(savedNotifications) as string[])
      : []
    window.localStorage.setItem(
      notificationKey,
      JSON.stringify([
        `${reviewedSubmission.lessonTitle} reviewed: ${outcome}. Email notification queued.`,
        ...notifications,
      ])
    )

    setReviewedMessage(`${reviewedSubmission.lessonTitle} marked ${outcome}.`)
    setComments("")
    setScores({})
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
            Mentor review dashboard
          </Typography>
          <Typography
            component="h1"
            sx={{ mt: 1, fontSize: { xs: 40, md: 64 }, fontWeight: 900 }}
          >
            Lab submissions.
          </Typography>
          <Typography sx={{ mt: 2, color: "rgba(255,255,255,0.82)" }}>
            Pending submissions are sorted by track and due date.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {reviewedMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {reviewedMessage}
          </Alert>
        )}

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          alignItems="flex-start"
        >
          <Box
            sx={{
              bgcolor: "white",
              border: "1px solid #dce7eb",
              borderRadius: 2,
              p: 3,
              width: { xs: "100%", md: 360 },
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <AssignmentTurnedInRoundedIcon color="primary" />
              <Typography variant="h6" fontWeight={900}>
                Queue
              </Typography>
              <Chip label={`${pendingCount} pending`} size="small" />
            </Stack>

            {submissions.length === 0 ? (
              <Typography color="text.secondary">
                No lab submissions yet.
              </Typography>
            ) : (
              <Stack spacing={1.5}>
                {submissions.map((submission) => (
                  <Button
                    key={submission.id}
                    variant={
                      submission.id === selectedId ? "contained" : "outlined"
                    }
                    onClick={() => setSelectedId(submission.id)}
                    sx={{
                      justifyContent: "flex-start",
                      textAlign: "left",
                      p: 1.5,
                    }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight={900}>
                        {submission.lessonTitle}
                      </Typography>
                      <Typography variant="caption" display="block">
                        {submission.courseId} / Due{" "}
                        {new Date(submission.dueAt).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" display="block">
                        {submission.status}
                      </Typography>
                    </Box>
                  </Button>
                ))}
              </Stack>
            )}
          </Box>

          {selectedSubmission && (
            <Box
              sx={{
                bgcolor: "white",
                border: "1px solid #dce7eb",
                borderRadius: 2,
                p: 3,
                flex: 1,
                width: "100%",
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="space-between"
                sx={{ mb: 2 }}
              >
                <Box>
                  <Typography variant="h5" fontWeight={900}>
                    {selectedSubmission.lessonTitle}
                  </Typography>
                  <Typography color="text.secondary">
                    {selectedSubmission.courseId} / Submitted{" "}
                    {new Date(
                      selectedSubmission.submittedAt
                    ).toLocaleDateString()}
                  </Typography>
                </Box>
                <Chip
                  label={selectedSubmission.status}
                  color={
                    selectedSubmission.status === "Reviewed"
                      ? "success"
                      : "primary"
                  }
                  variant="outlined"
                />
              </Stack>

              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" fontWeight={900}>
                Submission
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {selectedSubmission.notes}
              </Typography>
              <Button
                href={selectedSubmission.artifactUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                sx={{ mt: 2 }}
              >
                Open Artifact
              </Button>

              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" fontWeight={900}>
                Rubric
              </Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                {rubric.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      border: "1px solid #e1e8ec",
                      borderRadius: 2,
                      p: 2,
                    }}
                  >
                    <Typography fontWeight={900}>{item.label}</Typography>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      {item.description}
                    </Typography>
                    <FormControl fullWidth>
                      <InputLabel>Score</InputLabel>
                      <Select
                        label="Score"
                        value={
                          scores[item.id] ||
                          selectedSubmission.rubricScores?.[item.id] ||
                          ""
                        }
                        onChange={(event) =>
                          setScores((current) => ({
                            ...current,
                            [item.id]: event.target.value,
                          }))
                        }
                      >
                        {scoreOptions.map((score) => (
                          <MenuItem key={score} value={score}>
                            {score}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                ))}
              </Stack>

              <TextField
                label="Inline mentor comments"
                value={comments || selectedSubmission.reviewerComments || ""}
                onChange={(event) => setComments(event.target.value)}
                multiline
                minRows={4}
                fullWidth
                sx={{ mt: 3 }}
              />

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mt: 3 }}
              >
                <Button
                  variant="outlined"
                  disabled={selectedSubmission.status !== "Submitted"}
                  onClick={() => startReview(selectedSubmission)}
                >
                  Start Review
                </Button>
                <Button
                  variant="contained"
                  startIcon={<CheckCircleRoundedIcon />}
                  disabled={
                    selectedSubmission.status === "Reviewed" ||
                    selectedSubmission.status === "Submitted"
                  }
                  onClick={() => updateSubmission(selectedSubmission, "Pass")}
                >
                  Pass
                </Button>
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<RateReviewRoundedIcon />}
                  disabled={
                    selectedSubmission.status === "Reviewed" ||
                    selectedSubmission.status === "Submitted"
                  }
                  onClick={() => updateSubmission(selectedSubmission, "Revise")}
                >
                  Request Revision
                </Button>
              </Stack>
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  )
}

export default MentorSubmissions
