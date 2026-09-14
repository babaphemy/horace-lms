"use client"

import { skillTracks } from "@/data/skillTracks"
import {
  getLabSubmissionsKey,
  getSkillCertificatesKey,
  LabSubmission,
  SkillCertificate,
} from "@/utils/labs"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import HourglassBottomRoundedIcon from "@mui/icons-material/HourglassBottomRounded"
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded"
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded"
import {
  Alert,
  Box,
  Button,
  Chip,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

interface SkillReadinessProgressProps {
  userId: string
  compact?: boolean
  showHeader?: boolean
}

type CompetencyStatus = "verified" | "in-progress" | "not-started"

function readStoredItems<T>(key: string): T[] {
  if (typeof window === "undefined") return []

  try {
    const saved = window.localStorage.getItem(key)
    return saved ? (JSON.parse(saved) as T[]) : []
  } catch {
    return []
  }
}

function getSubmissionSkills(
  submissions: LabSubmission[],
  outcome: "Pass" | "active"
) {
  return new Set(
    submissions
      .filter((submission) => {
        if (outcome === "Pass") {
          return (
            submission.status === "Reviewed" && submission.outcome === "Pass"
          )
        }

        return !(
          submission.status === "Reviewed" && submission.outcome === "Pass"
        )
      })
      .flatMap((submission) => submission.skills)
  )
}

const SkillReadinessProgress = ({
  userId,
  compact = false,
  showHeader = true,
}: SkillReadinessProgressProps) => {
  const [submissions, setSubmissions] = useState<LabSubmission[]>([])
  const [certificates, setCertificates] = useState<SkillCertificate[]>([])

  useEffect(() => {
    setSubmissions(readStoredItems<LabSubmission>(getLabSubmissionsKey(userId)))
    setCertificates(
      readStoredItems<SkillCertificate>(getSkillCertificatesKey(userId))
    )
  }, [userId])

  const verifiedSkills = useMemo(
    () => getSubmissionSkills(submissions, "Pass"),
    [submissions]
  )
  const activeSkills = useMemo(
    () => getSubmissionSkills(submissions, "active"),
    [submissions]
  )

  const trackProgress = useMemo(
    () =>
      skillTracks.map((track) => {
        const competencies = track.skills.map((skill) => {
          let status: CompetencyStatus = "not-started"

          if (verifiedSkills.has(skill)) {
            status = "verified"
          } else if (activeSkills.has(skill)) {
            status = "in-progress"
          }

          return { skill, status }
        })
        const verifiedCount = competencies.filter(
          (competency) => competency.status === "verified"
        ).length
        const activeCount = competencies.filter(
          (competency) => competency.status === "in-progress"
        ).length
        const completion = Math.round(
          (verifiedCount / Math.max(track.skills.length, 1)) * 100
        )
        const certificate = certificates.find((item) =>
          track.skills.every((skill) => item.skills.includes(skill))
        )

        return {
          ...track,
          competencies,
          verifiedCount,
          activeCount,
          completion,
          certificate,
        }
      }),
    [activeSkills, certificates, verifiedSkills]
  )

  const hasProgress = submissions.length > 0 || certificates.length > 0

  return (
    <Box
      sx={{
        bgcolor: "white",
        border: "1px solid #dce7eb",
        borderRadius: 2,
        p: { xs: 2.5, md: compact ? 3 : 4 },
      }}
    >
      {showHeader && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          gap={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography
              color="#0F5E76"
              fontWeight={900}
              sx={{ textTransform: "uppercase" }}
            >
              Job-readiness progress
            </Typography>
            <Typography variant={compact ? "h5" : "h4"} fontWeight={900}>
              Skills demonstrated vs. still needed.
            </Typography>
          </Box>
          <Button
            component={Link}
            href={`/certificate/skills?userId=${encodeURIComponent(userId)}`}
            variant="outlined"
            startIcon={<WorkspacePremiumRoundedIcon />}
          >
            Certificates
          </Button>
        </Stack>
      )}

      {!hasProgress && (
        <Alert severity="info" sx={{ mb: 3 }}>
          No lab progress found yet. Passed project reviews will automatically
          mark matching competencies as verified.
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: compact ? "1fr" : "repeat(2, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        {trackProgress.map((track) => (
          <Box
            key={track.id}
            sx={{
              border: "1px solid #dce7eb",
              borderRadius: 2,
              p: 2.5,
              bgcolor: "#fbfdfe",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              gap={1}
            >
              <Box>
                <Typography fontWeight={900}>{track.title}</Typography>
                <Typography color="text.secondary" variant="body2">
                  {track.targetRole}
                </Typography>
              </Box>
              <Chip
                label={`${track.completion}% ready`}
                color={track.completion === 100 ? "success" : "primary"}
                variant={track.completion === 0 ? "outlined" : "filled"}
              />
            </Stack>

            <LinearProgress
              variant="determinate"
              value={track.completion}
              sx={{ my: 2, height: 8, borderRadius: 4 }}
            />

            <Stack spacing={1.25}>
              {track.competencies.map((competency) => {
                const isVerified = competency.status === "verified"
                const isActive = competency.status === "in-progress"

                return (
                  <Stack
                    key={competency.skill}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{
                      color: isVerified
                        ? "success.main"
                        : isActive
                          ? "warning.main"
                          : "text.secondary",
                    }}
                  >
                    {isVerified ? (
                      <CheckCircleRoundedIcon fontSize="small" />
                    ) : isActive ? (
                      <HourglassBottomRoundedIcon fontSize="small" />
                    ) : (
                      <RadioButtonUncheckedRoundedIcon fontSize="small" />
                    )}
                    <Typography color="text.primary" variant="body2">
                      {competency.skill}
                    </Typography>
                    <Typography variant="caption">
                      {isVerified
                        ? "Verified"
                        : isActive
                          ? "In review"
                          : "Needed"}
                    </Typography>
                  </Stack>
                )
              })}
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              sx={{ mt: 2 }}
            >
              <Button
                component={Link}
                href={`/course/${track.id}`}
                size="small"
                variant="outlined"
              >
                View Track
              </Button>
              {track.certificate && (
                <Button
                  component={Link}
                  href={`/verify/${track.certificate.verificationCode}`}
                  size="small"
                  variant="contained"
                >
                  Verify Certificate
                </Button>
              )}
            </Stack>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default SkillReadinessProgress
