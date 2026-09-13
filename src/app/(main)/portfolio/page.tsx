"use client"

import Footer from "@/components/Footer"
import { getLabSubmissionsKey, LabSubmission } from "@/utils/labs"
import PublicRoundedIcon from "@mui/icons-material/PublicRounded"
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded"
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded"
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from "@mui/material"
import Link from "next/link"
import { useEffect, useState } from "react"

const PortfolioPage = () => {
  const [submissions, setSubmissions] = useState<LabSubmission[]>([])
  const [userId, setUserId] = useState("guest")
  const submissionsKey = getLabSubmissionsKey(userId)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setUserId(params.get("userId") || "guest")
  }, [])

  useEffect(() => {
    const saved = window.localStorage.getItem(submissionsKey)
    setSubmissions(saved ? (JSON.parse(saved) as LabSubmission[]) : [])
  }, [submissionsKey])

  const updateVisibility = (submissionId: string, isPublic: boolean) => {
    const nextSubmissions = submissions.map((submission) =>
      submission.id === submissionId
        ? { ...submission, public: isPublic }
        : submission
    )
    setSubmissions(nextSubmissions)
    window.localStorage.setItem(submissionsKey, JSON.stringify(nextSubmissions))
  }

  const passedProjects = submissions.filter(
    (submission) =>
      submission.status === "Reviewed" && submission.outcome === "Pass"
  )
  const activeSubmissions = submissions.filter(
    (submission) =>
      submission.status !== "Reviewed" || submission.outcome !== "Pass"
  )

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
            Shareable portfolio
          </Typography>
          <Typography
            component="h1"
            sx={{
              mt: 1,
              fontSize: { xs: 40, md: 64 },
              lineHeight: 1,
              fontWeight: 900,
            }}
          >
            Verified projects from hands-on labs.
          </Typography>
          <Typography sx={{ mt: 2, color: "rgba(255,255,255,0.82)" }}>
            Passed lab submissions appear here with skill tags, descriptions,
            and artifact links.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {passedProjects.length === 0 ? (
          <Box
            sx={{
              bgcolor: "white",
              border: "1px solid #dce7eb",
              borderRadius: 2,
              p: { xs: 3, md: 5 },
              textAlign: "center",
            }}
          >
            <Typography variant="h5" fontWeight={900}>
              No passed projects yet.
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
              Submit a lab that passes all checkpoints to start your portfolio.
            </Typography>
            <Button component={Link} href="/courses" variant="contained">
              Browse Skill Tracks
            </Button>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                bgcolor: "#062d3a",
                color: "white",
                borderRadius: 2,
                p: 3,
                mb: 3,
                display: "flex",
                gap: 2,
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Box>
                <Typography variant="h5" fontWeight={900}>
                  Ready for a skill-verified certificate
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.78)", mt: 0.5 }}>
                  Certificates list the specific skills demonstrated by passed
                  projects.
                </Typography>
              </Box>
              <Button
                component={Link}
                href={`/certificate/skills?userId=${encodeURIComponent(
                  userId || "guest"
                )}`}
                variant="contained"
                startIcon={<WorkspacePremiumRoundedIcon />}
                sx={{ bgcolor: "#00A9C1", "&:hover": { bgcolor: "#078fa3" } }}
              >
                Issue Certificate
              </Button>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, minmax(0, 1fr))",
                },
                gap: 3,
              }}
            >
              {passedProjects.map((project) => (
                <Box
                  key={project.id}
                  sx={{
                    bgcolor: "white",
                    border: "1px solid #dce7eb",
                    borderRadius: 2,
                    p: 3,
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 2 }}
                  >
                    <Chip
                      icon={
                        project.public ? (
                          <PublicRoundedIcon />
                        ) : (
                          <VisibilityOffRoundedIcon />
                        )
                      }
                      label={project.public ? "Public" : "Private"}
                      color={project.public ? "success" : "default"}
                      variant="outlined"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={project.public}
                          onChange={(event) =>
                            updateVisibility(project.id, event.target.checked)
                          }
                        />
                      }
                      label=""
                    />
                  </Stack>
                  <Typography variant="h5" fontWeight={900}>
                    {project.lessonTitle}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    {project.notes.slice(0, 180)}
                    {project.notes.length > 180 ? "..." : ""}
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1} sx={{ my: 2 }}>
                    {project.skills.map((skill) => (
                      <Chip key={skill} label={skill} size="small" />
                    ))}
                  </Stack>
                  <Button
                    href={project.artifactUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                  >
                    Open Artifact
                  </Button>
                  <Typography
                    display="block"
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                  >
                    Reviewed / Pass on{" "}
                    {new Date(project.submittedAt).toLocaleDateString()}
                  </Typography>
                </Box>
              ))}
            </Box>
          </>
        )}

        {activeSubmissions.length > 0 && (
          <Box
            sx={{
              bgcolor: "white",
              border: "1px solid #dce7eb",
              borderRadius: 2,
              p: 3,
              mt: 4,
            }}
          >
            <Typography variant="h5" fontWeight={900}>
              Lab Submission Status
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={2}>
              {activeSubmissions.map((submission) => (
                <Stack
                  key={submission.id}
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                >
                  <Box>
                    <Typography fontWeight={900}>
                      {submission.lessonTitle}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      Submitted{" "}
                      {new Date(submission.submittedAt).toLocaleDateString()} /
                      Due {new Date(submission.dueAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Chip
                    label={
                      submission.outcome
                        ? `${submission.status}: ${submission.outcome}`
                        : submission.status
                    }
                    color={
                      submission.outcome === "Revise" ? "warning" : "primary"
                    }
                    variant="outlined"
                  />
                </Stack>
              ))}
            </Stack>
          </Box>
        )}
      </Container>
      <Footer />
    </Box>
  )
}

export default PortfolioPage
