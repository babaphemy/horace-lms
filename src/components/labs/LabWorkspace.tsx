"use client"

import {
  createSubmissionId,
  getLabCheckpoints,
  getLabSubmissionsKey,
  getLabWorkspaceKey,
  LabSubmission,
} from "@/utils/labs"
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded"
import MarkUnreadChatAltRoundedIcon from "@mui/icons-material/MarkUnreadChatAltRounded"
import SaveRoundedIcon from "@mui/icons-material/SaveRounded"
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

interface LabWorkspaceProps {
  courseId: string
  lessonId: string
  lessonTitle: string
  userId: string
}

interface WorkspaceState {
  notes: string
  artifactUrl: string
  lastSavedAt: string | null
}

const initialState: WorkspaceState = {
  notes: "",
  artifactUrl: "",
  lastSavedAt: null,
}

const LabWorkspace = ({
  courseId,
  lessonId,
  lessonTitle,
  userId,
}: LabWorkspaceProps) => {
  const [workspace, setWorkspace] = useState<WorkspaceState>(initialState)
  const [submitted, setSubmitted] = useState<LabSubmission | null>(null)
  const [loaded, setLoaded] = useState(false)

  const workspaceKey = useMemo(
    () => getLabWorkspaceKey(courseId, lessonId),
    [courseId, lessonId]
  )
  const submissionsKey = useMemo(() => getLabSubmissionsKey(userId), [userId])
  const checkpoints = useMemo(
    () => getLabCheckpoints(lessonTitle),
    [lessonTitle]
  )

  const checkpointResults = useMemo(
    () =>
      checkpoints.map((checkpoint) => {
        const notes = workspace.notes.toLowerCase()
        const artifact = workspace.artifactUrl.trim()
        const combined = `${notes} ${artifact.toLowerCase()}`
        const passed =
          (checkpoint.minimumLength
            ? workspace.notes.trim().length >= checkpoint.minimumLength
            : true) &&
          (checkpoint.keyword
            ? combined.includes(checkpoint.keyword) ||
              (checkpoint.id === "artifact" && artifact.length > 0)
            : true)

        return { ...checkpoint, passed }
      }),
    [checkpoints, workspace]
  )

  const passedCount = checkpointResults.filter((item) => item.passed).length
  const progress = Math.round((passedCount / checkpoints.length) * 100)
  const canSubmit = progress === 100 && workspace.artifactUrl.trim().length > 0

  useEffect(() => {
    const savedWorkspace = window.localStorage.getItem(workspaceKey)
    if (savedWorkspace) {
      setWorkspace(JSON.parse(savedWorkspace) as WorkspaceState)
    }
    setLoaded(true)
  }, [workspaceKey])

  useEffect(() => {
    if (!loaded) return

    const timer = window.setTimeout(() => {
      const nextWorkspace = {
        notes: workspace.notes,
        artifactUrl: workspace.artifactUrl,
        lastSavedAt: new Date().toISOString(),
      }
      window.localStorage.setItem(workspaceKey, JSON.stringify(nextWorkspace))
      setWorkspace(nextWorkspace)
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [loaded, workspace.notes, workspace.artifactUrl, workspaceKey])

  const handleSubmit = () => {
    const nextSubmission: LabSubmission = {
      id: createSubmissionId(courseId, lessonId),
      courseId,
      lessonId,
      lessonTitle,
      artifactUrl: workspace.artifactUrl.trim(),
      notes: workspace.notes.trim(),
      status: "Reviewed",
      outcome: "Pass",
      public: true,
      submittedAt: new Date().toISOString(),
      skills: ["Project execution", "Testing", "Documentation"],
    }

    const existing = window.localStorage.getItem(submissionsKey)
    const submissions = existing
      ? (JSON.parse(existing) as LabSubmission[])
      : []
    window.localStorage.setItem(
      submissionsKey,
      JSON.stringify([nextSubmission, ...submissions])
    )
    setSubmitted(nextSubmission)
  }

  return (
    <Box sx={{ bgcolor: "#f6fafb", minHeight: "100vh" }}>
      <Box sx={{ bgcolor: "#062d3a", color: "white", py: { xs: 5, md: 7 } }}>
        <Container maxWidth="lg">
          <Typography
            component="p"
            sx={{
              color: "#74e4ef",
              fontWeight: 800,
              textTransform: "uppercase",
            }}
          >
            Hands-on lab workspace
          </Typography>
          <Typography
            component="h1"
            sx={{
              mt: 1,
              fontSize: { xs: 36, md: 56 },
              lineHeight: 1,
              fontWeight: 900,
            }}
          >
            {lessonTitle}
          </Typography>
          <Typography sx={{ mt: 2, color: "rgba(255,255,255,0.82)" }}>
            Work is saved in this browser and can be resumed from the same lab
            link.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        {submitted && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Lab submitted and marked Reviewed / Pass for this MVP. It is now
            available on your portfolio page.
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
                  Lab Notes And Build Log
                </Typography>
                <Typography color="text.secondary">
                  Capture your plan, decisions, tests, and revision notes.
                </Typography>
              </Box>
              <Chip
                icon={<SaveRoundedIcon />}
                label={
                  workspace.lastSavedAt
                    ? `Autosaved ${new Date(
                        workspace.lastSavedAt
                      ).toLocaleTimeString()}`
                    : "Autosave ready"
                }
                variant="outlined"
              />
            </Stack>

            <TextField
              fullWidth
              multiline
              minRows={14}
              value={workspace.notes}
              onChange={(event) =>
                setWorkspace((current) => ({
                  ...current,
                  notes: event.target.value,
                }))
              }
              placeholder="Write your implementation plan, checkpoint notes, test results, and changes here..."
            />

            <TextField
              fullWidth
              sx={{ mt: 3 }}
              value={workspace.artifactUrl}
              onChange={(event) =>
                setWorkspace((current) => ({
                  ...current,
                  artifactUrl: event.target.value,
                }))
              }
              label="Final artifact link"
              placeholder="https://github.com/you/project or in-platform artifact URL"
            />

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mt: 3 }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<AssignmentTurnedInRoundedIcon />}
                disabled={!canSubmit}
                onClick={handleSubmit}
              >
                Submit Project
              </Button>
              <Button
                component={Link}
                href={`/portfolio?userId=${encodeURIComponent(
                  userId || "guest"
                )}`}
                size="large"
              >
                View Portfolio
              </Button>
              <Button
                component={Link}
                href={`/mentorship/ask?trackId=${encodeURIComponent(
                  courseId
                )}&lessonId=${encodeURIComponent(
                  lessonId
                )}&title=${encodeURIComponent(
                  lessonTitle
                )}&userId=${encodeURIComponent(userId || "guest")}`}
                size="large"
                startIcon={<MarkUnreadChatAltRoundedIcon />}
              >
                Ask Mentor
              </Button>
            </Stack>
          </Box>

          <Box
            sx={{
              bgcolor: "white",
              border: "1px solid #dce7eb",
              borderRadius: 2,
              p: 3,
              width: { xs: "100%", md: 380 },
            }}
          >
            <Typography variant="h6" fontWeight={900}>
              Checkpoints
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
              Complete each checkpoint before submitting.
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 8, borderRadius: 1, mb: 2 }}
            />
            <Typography fontWeight={800} sx={{ mb: 2 }}>
              {passedCount}/{checkpoints.length} complete
            </Typography>
            <Stack spacing={2}>
              {checkpointResults.map((checkpoint) => (
                <Box
                  key={checkpoint.id}
                  sx={{
                    border: "1px solid #e1e8ec",
                    borderRadius: 2,
                    p: 2,
                    bgcolor: checkpoint.passed ? "#f1fbf4" : "#fff",
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    {checkpoint.passed ? (
                      <CheckCircleRoundedIcon color="success" />
                    ) : (
                      <ErrorOutlineRoundedIcon color="warning" />
                    )}
                    <Box>
                      <Typography fontWeight={900}>
                        {checkpoint.label}
                      </Typography>
                      {!checkpoint.passed && (
                        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                          {checkpoint.hint}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </Box>
              ))}
            </Stack>
            <Divider sx={{ my: 3 }} />
            <Typography variant="body2" color="text.secondary">
              Submission status path: Submitted, In Review, Reviewed. This MVP
              marks passing submissions as Reviewed / Pass locally until the
              mentor review API is added.
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

export default LabWorkspace
