"use client"

import {
  getLabDefinition,
  LabDefinition,
  PlaygroundToolId,
  ToolResult,
} from "@/data/labs"
import {
  createSubmissionId,
  getAllLabSubmissionsKey,
  getLabCheckpoints,
  getLabPlaygroundKey,
  getLabSubmissionsKey,
  getLabWorkspaceKey,
  LabSubmission,
} from "@/utils/labs"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
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
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material"
import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import ReactMarkdown from "react-markdown"

const PlaygroundTool = dynamic(() => import("./tools/PlaygroundTool"), {
  ssr: false,
  loading: () => <Typography>Loading local tool…</Typography>,
})
interface Props {
  courseId: string
  lessonId: string
  lessonTitle: string
}
interface WorkspaceState {
  notes: string
  artifactUrl: string
  lastSavedAt: string | null
  activeStep: number
}
const initialState: WorkspaceState = {
  notes: "",
  artifactUrl: "",
  lastSavedAt: null,
  activeStep: 0,
}

const fallbackDefinition = (title: string): LabDefinition => ({
  slug: "generic-lab",
  domain: null,
  environment: "browser",
  estimatedMinutes: 45,
  objective: `Complete and document ${title}.`,
  prerequisites: [],
  tools: [],
  steps: getLabCheckpoints(title).map((checkpoint, index) => ({
    id: checkpoint.id,
    title: checkpoint.label,
    instructions: checkpoint.hint,
    evidence: index === 1 ? "file-link" : "note",
  })),
  deliverables: ["Build log", "Final artifact link"],
  rubric: [
    {
      id: "requirements",
      label: "Requirements",
      description: "The artifact addresses the lab scenario.",
    },
    {
      id: "testing",
      label: "Testing",
      description: "Test evidence is documented.",
    },
    {
      id: "documentation",
      label: "Documentation",
      description: "Decisions and outcomes are clear.",
    },
  ],
  skills: ["Project execution", "Testing", "Documentation"],
})

export default function LabWorkspace({
  courseId,
  lessonId,
  lessonTitle,
}: Props) {
  const { data: session, status } = useSession()
  const userId = session?.user?.id || "guest"
  const definition = useMemo(
    () => getLabDefinition(lessonTitle) || fallbackDefinition(lessonTitle),
    [lessonTitle]
  )
  const [workspace, setWorkspace] = useState(initialState)
  const [toolStates, setToolStates] = useState<
    Record<string, Record<string, unknown>>
  >({})
  const [results, setResults] = useState<Record<string, ToolResult>>({})
  const [activeTool, setActiveTool] = useState<PlaygroundToolId | null>(
    definition.tools[0] || null
  )
  const [mobilePane, setMobilePane] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const workspaceKey = getLabWorkspaceKey(courseId, lessonId)

  useEffect(() => {
    const saved = localStorage.getItem(workspaceKey)
    if (saved) setWorkspace({ ...initialState, ...JSON.parse(saved) })
    const states: Record<string, Record<string, unknown>> = {}
    definition.tools.forEach((tool) => {
      const raw = localStorage.getItem(
        getLabPlaygroundKey(courseId, lessonId, tool)
      )
      if (raw) states[tool] = JSON.parse(raw)
    })
    setToolStates(states)
    setLoaded(true)
  }, [courseId, lessonId, workspaceKey, definition.tools])

  useEffect(() => {
    if (!loaded) return
    const timer = window.setTimeout(
      () =>
        localStorage.setItem(
          workspaceKey,
          JSON.stringify({
            ...workspace,
            lastSavedAt: new Date().toISOString(),
          })
        ),
      700
    )
    return () => clearTimeout(timer)
  }, [workspace, workspaceKey, loaded])

  const setToolState = (
    tool: PlaygroundToolId,
    next: Record<string, unknown>
  ) => {
    setToolStates((current) => ({ ...current, [tool]: next }))
    localStorage.setItem(
      getLabPlaygroundKey(courseId, lessonId, tool),
      JSON.stringify(next)
    )
  }
  const completedSteps = definition.steps.filter(
    (step, index) =>
      index < workspace.activeStep ||
      results[step.autoCheck?.tool || ""]?.passed ||
      (step.evidence === "file-link" && !!workspace.artifactUrl)
  ).length
  const progress = Math.round((completedSteps / definition.steps.length) * 100)
  const canSubmit =
    workspace.notes.trim().length >= 20 &&
    workspace.artifactUrl.trim().length > 0 &&
    status !== "loading"

  const submit = () => {
    const now = new Date()
    const due = new Date(now)
    due.setDate(due.getDate() + 7)
    const submission: LabSubmission = {
      id: createSubmissionId(courseId, lessonId),
      userId,
      courseId,
      lessonId,
      lessonTitle,
      artifactUrl: workspace.artifactUrl.trim(),
      notes: workspace.notes.trim(),
      status: "Submitted",
      public: false,
      submittedAt: now.toISOString(),
      dueAt: due.toISOString(),
      skills: definition.skills,
    }
    const key = getLabSubmissionsKey(userId)
    const existing = JSON.parse(
      localStorage.getItem(key) || "[]"
    ) as LabSubmission[]
    localStorage.setItem(key, JSON.stringify([submission, ...existing]))
    const allKey = getAllLabSubmissionsKey()
    const all = JSON.parse(
      localStorage.getItem(allKey) || "[]"
    ) as LabSubmission[]
    localStorage.setItem(allKey, JSON.stringify([submission, ...all]))
    setSubmitted(true)
  }

  const paneSx = (index: number) => ({
    display: { xs: mobilePane === index ? "block" : "none", md: "block" },
    bgcolor: "white",
    border: "1px solid #dce7eb",
    borderRadius: 3,
    p: 2.5,
    minWidth: 0,
  })
  return (
    <Box sx={{ bgcolor: "#f4f8f9", minHeight: "100vh" }}>
      <Box sx={{ bgcolor: "#062d3a", color: "white", py: 4 }}>
        <Container maxWidth="xl">
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            gap={2}
          >
            <Box>
              <Typography
                color="#74e4ef"
                fontWeight={800}
                textTransform="uppercase"
              >
                Hands-on lab
              </Typography>
              <Typography
                component="h1"
                sx={{ fontSize: { xs: 30, md: 45 }, fontWeight: 900 }}
              >
                {lessonTitle}
              </Typography>
              <Typography color="rgba(255,255,255,.75)" mt={1}>
                {definition.objective}
              </Typography>
            </Box>
            <Stack
              direction="row"
              gap={1}
              flexWrap="wrap"
              alignContent="center"
            >
              <Chip
                label={
                  definition.domain
                    ? `Domain ${definition.domain}`
                    : "Capstone / career"
                }
                sx={{ bgcolor: "#dff9f7" }}
              />
              <Chip
                label={definition.environment}
                sx={{ bgcolor: "#dff9f7" }}
              />
              <Chip
                label={`${definition.estimatedMinutes} min`}
                sx={{ bgcolor: "#dff9f7" }}
              />
            </Stack>
          </Stack>
        </Container>
      </Box>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {submitted && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Lab submitted. It is now available to your portfolio and mentor
            review queue.
          </Alert>
        )}
        {(definition.environment === "local-vm" ||
          definition.environment === "hybrid") && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Runs in your lab VM. Use the isolated environment created in{" "}
            <strong>Build a safe cybersecurity lab</strong>; browser tools use
            bundled fixtures only.
          </Alert>
        )}
        <Tabs
          value={mobilePane}
          onChange={(_, value) => setMobilePane(value)}
          sx={{ display: { md: "none" }, mb: 2 }}
          variant="fullWidth"
        >
          <Tab label="Steps" />
          <Tab label="Playground" />
          <Tab label="Checkpoints" />
        </Tabs>
        <Box
          sx={{
            display: { xs: "block", md: "grid" },
            gridTemplateColumns: "280px minmax(0,1fr) 310px",
            gap: 2,
          }}
        >
          <Box sx={paneSx(0)}>
            <Typography variant="h6" fontWeight={900}>
              Steps
            </Typography>
            <Stack mt={2} gap={1}>
              {definition.steps.map((step, index) => (
                <Button
                  key={step.id}
                  onClick={() =>
                    setWorkspace((current) => ({
                      ...current,
                      activeStep: index,
                    }))
                  }
                  variant={
                    workspace.activeStep === index ? "contained" : "text"
                  }
                  color={index < completedSteps ? "success" : "primary"}
                  sx={{ justifyContent: "flex-start", textAlign: "left" }}
                >
                  {index < completedSteps && (
                    <CheckCircleRoundedIcon sx={{ mr: 1 }} fontSize="small" />
                  )}
                  {index + 1}. {step.title}
                </Button>
              ))}
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Typography fontWeight={800}>
              {definition.steps[workspace.activeStep]?.title}
            </Typography>
            <Box sx={{ color: "text.secondary", "& p": { mt: 1 } }}>
              <ReactMarkdown>
                {definition.steps[workspace.activeStep]?.instructions || ""}
              </ReactMarkdown>
            </Box>
          </Box>
          <Box sx={paneSx(1)}>
            <Typography variant="h6" fontWeight={900}>
              Playground
            </Typography>
            {definition.tools.length ? (
              <>
                <Tabs
                  value={activeTool}
                  onChange={(_, value) => setActiveTool(value)}
                  variant="scrollable"
                  sx={{ mb: 2 }}
                >
                  {definition.tools.map((tool) => (
                    <Tab key={tool} value={tool} label={tool} />
                  ))}
                </Tabs>
                {activeTool && (
                  <PlaygroundTool
                    toolId={activeTool}
                    state={toolStates[activeTool] || {}}
                    onChange={(next) => setToolState(activeTool, next)}
                    onResult={(result) =>
                      setResults((current) => ({
                        ...current,
                        [result.tool]: result,
                      }))
                    }
                  />
                )}
              </>
            ) : (
              <Alert severity="info" sx={{ mt: 2 }}>
                This lab uses your local VM or submitted evidence and has no
                browser tool.
              </Alert>
            )}
          </Box>
          <Box sx={paneSx(2)}>
            <Typography variant="h6" fontWeight={900}>
              Checkpoints
            </Typography>
            <LinearProgress
              value={progress}
              variant="determinate"
              sx={{ height: 8, borderRadius: 4, my: 1 }}
            />
            <Typography fontWeight={800}>
              {completedSteps}/{definition.steps.length} complete
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography fontWeight={900}>Deliverables</Typography>
            {definition.deliverables.map((item) => (
              <Typography key={item} color="text.secondary" mt={1}>
                • {item}
              </Typography>
            ))}
            <Divider sx={{ my: 2 }} />
            <Typography fontWeight={900}>Rubric preview</Typography>
            {definition.rubric.map((item) => (
              <Box key={item.id} mt={1}>
                <Typography fontWeight={700}>{item.label}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Box
          sx={{
            bgcolor: "white",
            border: "1px solid #dce7eb",
            borderRadius: 3,
            p: 3,
            mt: 2,
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            gap={2}
          >
            <Box>
              <Typography variant="h6" fontWeight={900}>
                Build log and submission
              </Typography>
              <Typography color="text.secondary">
                Autosaves in this browser. Submitted skills:{" "}
                {definition.skills.join(", ")}.
              </Typography>
            </Box>
            <Chip
              icon={<SaveRoundedIcon />}
              label="Autosave on"
              variant="outlined"
            />
          </Stack>
          <TextField
            fullWidth
            multiline
            minRows={5}
            sx={{ mt: 2 }}
            label="Notes, findings, tests, and decisions"
            value={workspace.notes}
            onChange={(event) =>
              setWorkspace((current) => ({
                ...current,
                notes: event.target.value,
              }))
            }
          />
          <TextField
            fullWidth
            sx={{ mt: 2 }}
            label="Artifact link"
            value={workspace.artifactUrl}
            onChange={(event) =>
              setWorkspace((current) => ({
                ...current,
                artifactUrl: event.target.value,
              }))
            }
          />
          <Stack direction={{ xs: "column", sm: "row" }} gap={1.5} mt={2}>
            <Button variant="contained" disabled={!canSubmit} onClick={submit}>
              Submit lab
            </Button>
            <Button
              component={Link}
              href={`/portfolio?userId=${encodeURIComponent(userId)}`}
            >
              View portfolio
            </Button>
            <Button
              component={Link}
              href={`/mentorship/ask?trackId=${encodeURIComponent(courseId)}&lessonId=${encodeURIComponent(lessonId)}&title=${encodeURIComponent(lessonTitle)}&userId=${encodeURIComponent(userId)}`}
              startIcon={<MarkUnreadChatAltRoundedIcon />}
            >
              Ask mentor
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}
