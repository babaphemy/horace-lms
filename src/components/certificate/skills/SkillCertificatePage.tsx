"use client"

import {
  createSkillCertificateId,
  createVerificationCode,
  getAllSkillCertificatesKey,
  getLabSubmissionsKey,
  getSkillCertificatesKey,
  LabSubmission,
  SkillCertificate,
} from "@/utils/labs"
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded"
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded"
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

interface SkillCertificatePageProps {
  userId: string
}

const SkillCertificatePage = ({ userId }: SkillCertificatePageProps) => {
  const [learnerName, setLearnerName] = useState("")
  const [submissions, setSubmissions] = useState<LabSubmission[]>([])
  const [certificates, setCertificates] = useState<SkillCertificate[]>([])
  const [issuedCertificate, setIssuedCertificate] =
    useState<SkillCertificate | null>(null)

  const submissionsKey = getLabSubmissionsKey(userId)
  const certificatesKey = getSkillCertificatesKey(userId)

  useEffect(() => {
    const savedSubmissions = window.localStorage.getItem(submissionsKey)
    setSubmissions(
      savedSubmissions ? (JSON.parse(savedSubmissions) as LabSubmission[]) : []
    )

    const savedCertificates = window.localStorage.getItem(certificatesKey)
    setCertificates(
      savedCertificates
        ? (JSON.parse(savedCertificates) as SkillCertificate[])
        : []
    )
  }, [certificatesKey, submissionsKey])

  const passedSubmissions = useMemo(
    () =>
      submissions.filter(
        (submission) =>
          submission.status === "Reviewed" && submission.outcome === "Pass"
      ),
    [submissions]
  )

  const demonstratedSkills = useMemo(
    () =>
      Array.from(
        new Set(passedSubmissions.flatMap((submission) => submission.skills))
      ),
    [passedSubmissions]
  )

  const canIssue = learnerName.trim() && passedSubmissions.length > 0

  const issueCertificate = () => {
    const certificateId = createSkillCertificateId(userId)
    const certificate: SkillCertificate = {
      id: certificateId,
      certificateId,
      verificationCode: createVerificationCode(certificateId),
      learnerName: learnerName.trim(),
      userId,
      trackTitle: "Verified Hands-On Skill Track",
      issuedAt: new Date().toISOString(),
      projectIds: passedSubmissions.map((submission) => submission.id),
      projects: passedSubmissions.map((submission) => ({
        title: submission.lessonTitle,
        artifactUrl: submission.artifactUrl,
      })),
      skills: demonstratedSkills,
      competencies: demonstratedSkills.map((skill) => `${skill}: verified`),
    }

    const nextCertificates = [certificate, ...certificates]
    setCertificates(nextCertificates)
    window.localStorage.setItem(
      certificatesKey,
      JSON.stringify(nextCertificates)
    )

    const allKey = getAllSkillCertificatesKey()
    const savedAll = window.localStorage.getItem(allKey)
    const allCertificates = savedAll
      ? (JSON.parse(savedAll) as SkillCertificate[])
      : []
    window.localStorage.setItem(
      allKey,
      JSON.stringify([certificate, ...allCertificates])
    )
    setIssuedCertificate(certificate)
  }

  const certificateToShow = issuedCertificate || certificates[0]

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
            Skill-verified certificate
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
            Issue a certificate backed by passed projects.
          </Typography>
          <Typography sx={{ mt: 2, color: "rgba(255,255,255,0.82)" }}>
            Certificates are available only after at least one lab project has
            been reviewed and marked Pass.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {passedSubmissions.length === 0 && (
          <Alert severity="info" sx={{ mb: 3 }}>
            No passed projects found yet. Submit a lab, then have a mentor mark
            it Pass before issuing a certificate.
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
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <WorkspacePremiumRoundedIcon color="primary" />
              <Typography variant="h5" fontWeight={900}>
                Certificate Eligibility
              </Typography>
            </Stack>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {passedSubmissions.length} passed project
              {passedSubmissions.length === 1 ? "" : "s"} found for this
              learner.
            </Typography>

            <Stack spacing={2}>
              <TextField
                label="Learner name"
                value={learnerName}
                onChange={(event) => setLearnerName(event.target.value)}
                fullWidth
              />
              <Box>
                <Typography fontWeight={900} sx={{ mb: 1 }}>
                  Verified Skills
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {demonstratedSkills.length > 0 ? (
                    demonstratedSkills.map((skill) => (
                      <Chip key={skill} label={skill} />
                    ))
                  ) : (
                    <Chip label="No verified skills yet" variant="outlined" />
                  )}
                </Stack>
              </Box>
            </Stack>

            <Button
              variant="contained"
              size="large"
              sx={{ mt: 3 }}
              disabled={!canIssue}
              onClick={issueCertificate}
            >
              Issue Certificate
            </Button>
          </Box>

          <Box
            sx={{
              bgcolor: "white",
              border: "1px solid #dce7eb",
              borderRadius: 2,
              p: 3,
              width: { xs: "100%", md: 420 },
            }}
          >
            <Typography variant="h5" fontWeight={900}>
              Certificate Preview
            </Typography>
            <Divider sx={{ my: 2 }} />

            {certificateToShow ? (
              <Box
                sx={{
                  border: "2px solid #0F5E76",
                  borderRadius: 2,
                  p: 3,
                  bgcolor: "#fff",
                }}
              >
                <Typography
                  color="#0F5E76"
                  fontWeight={900}
                  textAlign="center"
                  sx={{ textTransform: "uppercase" }}
                >
                  Horace Skill Certificate
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight={900}
                  textAlign="center"
                  sx={{ my: 2 }}
                >
                  {certificateToShow.learnerName}
                </Typography>
                <Typography color="text.secondary" textAlign="center">
                  demonstrated verified competency through reviewed hands-on
                  projects.
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1} sx={{ my: 3 }}>
                  {certificateToShow.skills.map((skill) => (
                    <Chip key={skill} label={skill} size="small" />
                  ))}
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 86,
                      height: 86,
                      border: "1px solid #dce7eb",
                      borderRadius: 1,
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <QrCode2RoundedIcon sx={{ fontSize: 58 }} />
                  </Box>
                  <Box>
                    <Typography fontWeight={900}>
                      {certificateToShow.certificateId}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      Verify: /verify/{certificateToShow.verificationCode}
                    </Typography>
                  </Box>
                </Stack>
                <Button
                  component={Link}
                  href={`/verify/${certificateToShow.verificationCode}`}
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 3 }}
                >
                  Open Verification Page
                </Button>
              </Box>
            ) : (
              <Typography color="text.secondary">
                Certificate preview appears after issuing.
              </Typography>
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

export default SkillCertificatePage
