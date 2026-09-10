import Footer from "@/components/Footer"
import { getSkillTrack, skillTracks } from "@/data/skillTracks"
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded"
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import GroupRoundedIcon from "@mui/icons-material/GroupRounded"
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded"
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded"
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import React from "react"

interface TrackDetailProps {
  params: Promise<{ cid: string }>
}

const checkoutPlanByTier: Record<string, string> = {
  "Self-Paced Labs": "self-paced-labs",
  "Mentored Track": "mentored-track",
  "Team Upskilling": "team-upskilling",
}

export async function generateStaticParams() {
  return skillTracks.map((track) => ({ cid: track.id }))
}

export async function generateMetadata({ params }: TrackDetailProps) {
  const { cid } = await params
  const track = getSkillTrack(cid)

  if (!track) {
    return {
      title: "Skill Track Not Found | Horace LMS",
    }
  }

  return {
    title: `${track.title} | Horace LMS`,
    description: track.outcome,
  }
}

const TrackDetail = async ({ params }: TrackDetailProps) => {
  const { cid } = await params
  const track = getSkillTrack(cid)

  if (!track) {
    notFound()
  }

  const totalHours = track.modules.reduce(
    (sum, module) => sum + module.hours,
    0
  )
  const checkoutPlan = checkoutPlanByTier[track.tier] || "mentored-track"
  const checkoutHref = `/checkout?plan=${checkoutPlan}&locale=US`

  return (
    <Box sx={{ bgcolor: "#f6fafb" }}>
      <Box
        component="section"
        sx={{
          bgcolor: "#062d3a",
          color: "white",
          py: { xs: 5, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Button
            component={Link}
            href="/courses"
            startIcon={<ArrowBackRoundedIcon />}
            sx={{ color: "rgba(255,255,255,0.82)", mb: 3 }}
          >
            Back to tracks
          </Button>
          <Grid container spacing={5} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
                <Chip label={track.domain} />
                <Chip label={track.level} variant="outlined" color="primary" />
                <Chip label={track.duration} variant="outlined" />
              </Stack>
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: 40, md: 64 },
                  lineHeight: 1,
                  fontWeight: 900,
                }}
              >
                {track.title}
              </Typography>
              <Typography
                sx={{
                  mt: 3,
                  color: "rgba(255,255,255,0.84)",
                  fontSize: { xs: 18, md: 22 },
                }}
              >
                {track.outcome}
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mt: 4 }}
              >
                <Button
                  component={Link}
                  href={checkoutHref}
                  variant="contained"
                  size="large"
                  sx={{ bgcolor: "#00A9C1", "&:hover": { bgcolor: "#078fa3" } }}
                >
                  Enroll In Track
                </Button>
                <Button
                  href="#preview-lab"
                  variant="outlined"
                  size="large"
                  startIcon={<PlayCircleRoundedIcon />}
                  sx={{ color: "white", borderColor: "rgba(255,255,255,0.64)" }}
                >
                  Preview Lab
                </Button>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.22)",
                }}
              >
                <Image
                  src={track.thumbnail}
                  alt={`${track.title} thumbnail`}
                  width={720}
                  height={520}
                  style={{ width: "100%", height: "auto", display: "block" }}
                  priority
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Section title="Curriculum And Labs">
              <Stack spacing={2}>
                {track.modules.map((module, index) => (
                  <Box
                    key={module.title}
                    sx={{
                      bgcolor: "white",
                      border: "1px solid #dce7eb",
                      borderRadius: 2,
                      p: 3,
                    }}
                  >
                    <Typography color="#00A9C1" fontWeight={900}>
                      Module {index + 1} / {module.hours} hours
                    </Typography>
                    <Typography variant="h5" fontWeight={900} sx={{ mt: 1 }}>
                      {module.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                      Objective: {module.objective}
                    </Typography>
                    <Typography sx={{ mt: 1 }} fontWeight={800}>
                      Lab/project: {module.lab}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Section>

            <Section title="Learner Outcomes">
              <Grid container spacing={2}>
                {track.outcomes.map((outcome) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={outcome.label}>
                    <Box
                      sx={{
                        bgcolor: "white",
                        border: "1px solid #dce7eb",
                        borderRadius: 2,
                        p: 3,
                        height: "100%",
                      }}
                    >
                      <Typography variant="h6" fontWeight={900}>
                        {outcome.label}
                      </Typography>
                      <Typography color="text.secondary" sx={{ mt: 1 }}>
                        {outcome.detail}
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Typography fontWeight={800}>
                        Proof: {outcome.proof}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Section>

            <Section title="Available Mentors">
              {track.mentors.length > 0 ? (
                <Grid container spacing={2}>
                  {track.mentors.map((mentor) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={mentor.name}>
                      <Box
                        sx={{
                          bgcolor: "white",
                          border: "1px solid #dce7eb",
                          borderRadius: 2,
                          p: 3,
                          height: "100%",
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar
                            src={mentor.photo}
                            alt={mentor.name}
                            sx={{ width: 56, height: 56 }}
                          />
                          <Box>
                            <Typography variant="h6" fontWeight={900}>
                              {mentor.name}
                            </Typography>
                            <Typography color="text.secondary">
                              {mentor.expertise}
                            </Typography>
                          </Box>
                        </Stack>
                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                          {mentor.bio}
                        </Typography>
                        <Stack
                          direction="row"
                          gap={1}
                          flexWrap="wrap"
                          sx={{ mt: 2 }}
                        >
                          {mentor.tags.map((tag) => (
                            <Chip key={tag} label={tag} size="small" />
                          ))}
                        </Stack>
                        <Typography sx={{ mt: 2 }} fontWeight={800}>
                          Response: {mentor.responseTime} / Rating:{" "}
                          {mentor.rating.toFixed(1)}
                        </Typography>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={1}
                          sx={{ mt: 2 }}
                        >
                          <Button
                            component={Link}
                            href={`/mentorship/book?trackId=${track.id}&mentorId=${mentor.id}`}
                            variant="contained"
                            size="small"
                          >
                            Book Session
                          </Button>
                          <Button
                            component={Link}
                            href={`/mentorship/ask?trackId=${track.id}&mentorId=${mentor.id}`}
                            variant="outlined"
                            size="small"
                          >
                            Ask Mentor
                          </Button>
                        </Stack>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box
                  sx={{
                    bgcolor: "white",
                    border: "1px solid #dce7eb",
                    borderRadius: 2,
                    p: 3,
                  }}
                >
                  <Typography color="text.secondary">
                    This track is currently self-paced. Learners receive
                    automated checkpoint feedback and portfolio guidance.
                  </Typography>
                </Box>
              )}
            </Section>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                bgcolor: "white",
                border: "1px solid #dce7eb",
                borderRadius: 2,
                p: 3,
                position: { md: "sticky" },
                top: { md: 24 },
              }}
            >
              <Typography variant="h4" fontWeight={900}>
                {track.price}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                {track.tier}
              </Typography>
              <Stack spacing={2}>
                <Fact
                  icon={<WorkspacePremiumRoundedIcon color="primary" />}
                  label="Target role"
                  value={track.targetRole}
                />
                <Fact
                  icon={<AccessTimeRoundedIcon color="primary" />}
                  label="Track workload"
                  value={`${track.duration} / ${totalHours} lab hours`}
                />
                <Fact
                  icon={<GroupRoundedIcon color="primary" />}
                  label="Mentorship"
                  value={track.mentorship ? "Included" : "Self-paced"}
                />
              </Stack>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" fontWeight={900}>
                Skills demonstrated
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2 }}>
                {track.skills.map((skill) => (
                  <Chip key={skill} label={skill} />
                ))}
              </Stack>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" fontWeight={900}>
                Prerequisites
              </Typography>
              <Stack spacing={1.5} sx={{ mt: 2 }}>
                {track.prerequisites.map((item) => (
                  <Stack key={item} direction="row" spacing={1}>
                    <CheckCircleRoundedIcon color="success" fontSize="small" />
                    <Typography>{item}</Typography>
                  </Stack>
                ))}
              </Stack>
              <Button
                component={Link}
                href={checkoutHref}
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 3, py: 1.2 }}
              >
                Start This Track
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Box
          id="preview-lab"
          sx={{
            bgcolor: "#062d3a",
            color: "white",
            borderRadius: 2,
            p: { xs: 3, md: 5 },
            mt: 6,
          }}
        >
          <Typography color="#74e4ef" fontWeight={900}>
            Free preview lab
          </Typography>
          <Typography variant="h3" fontWeight={900} sx={{ mt: 1 }}>
            {track.previewLab.title}
          </Typography>
          <Typography
            sx={{ mt: 2, color: "rgba(255,255,255,0.82)", maxWidth: 760 }}
          >
            {track.previewLab.description}
          </Typography>
          <Typography sx={{ mt: 2 }} fontWeight={800}>
            Estimated time: {track.previewLab.estimate}
          </Typography>
        </Box>
      </Container>
      <Footer />
    </Box>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h4" component="h2" fontWeight={900} sx={{ mb: 2 }}>
        {title}
      </Typography>
      {children}
    </Box>
  )
}

function Fact({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
      {icon}
      <Box>
        <Typography color="text.secondary">{label}</Typography>
        <Typography fontWeight={800}>{value}</Typography>
      </Box>
    </Stack>
  )
}

export default TrackDetail
