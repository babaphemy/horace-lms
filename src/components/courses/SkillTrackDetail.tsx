import Footer from "@/components/Footer"
import { SkillTrack } from "@/data/skillTracks"
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded"
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import GroupRoundedIcon from "@mui/icons-material/GroupRounded"
import {
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

const checkoutPlanByTier: Record<string, string> = {
  "Self-Paced Labs": "self-paced-labs",
  "Mentored Track": "mentored-track",
  "Team Upskilling": "team-upskilling",
}

const SkillTrackDetail = ({ track }: { track: SkillTrack }) => {
  const checkoutPlan = checkoutPlanByTier[track.tier] || "mentored-track"
  const checkoutHref = `/checkout?plan=${checkoutPlan}&locale=US`
  const totalHours = track.modules.reduce((sum, item) => sum + item.hours, 0)

  return (
    <Box sx={{ bgcolor: "#f6fafb" }}>
      <Box
        component="section"
        sx={{ bgcolor: "#062d3a", color: "white", py: 7 }}
      >
        <Container maxWidth="lg">
          <Button
            component={Link}
            href="/courses"
            startIcon={<ArrowBackRoundedIcon />}
            sx={{ color: "white", mb: 3 }}
          >
            Back to tracks
          </Button>
          <Grid container spacing={5} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                <Chip label={track.domain} />
                <Chip label={track.level} variant="outlined" color="primary" />
                <Chip label={track.duration} variant="outlined" />
              </Stack>
              <Typography
                component="h1"
                sx={{
                  mt: 2,
                  fontSize: { xs: 40, md: 60 },
                  lineHeight: 1,
                  fontWeight: 900,
                }}
              >
                {track.title}
              </Typography>
              <Typography
                sx={{ mt: 3, color: "rgba(255,255,255,.84)", fontSize: 20 }}
              >
                {track.outcome}
              </Typography>
              <Button
                component={Link}
                href={checkoutHref}
                variant="contained"
                size="large"
                sx={{ mt: 4 }}
              >
                Enroll In Track
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Image
                src={track.thumbnail}
                alt={`${track.title} thumbnail`}
                width={720}
                height={520}
                priority
                style={{ width: "100%", height: "auto", borderRadius: 12 }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 7 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h4" fontWeight={900} sx={{ mb: 2 }}>
              Curriculum And Labs
            </Typography>
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
                  <Typography color="primary" fontWeight={900}>
                    Module {index + 1} / {module.hours} hours
                  </Typography>
                  <Typography variant="h5" fontWeight={900} sx={{ mt: 1 }}>
                    {module.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    {module.objective}
                  </Typography>
                  <Typography fontWeight={800} sx={{ mt: 1 }}>
                    Lab/project: {module.lab}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                bgcolor: "white",
                border: "1px solid #dce7eb",
                borderRadius: 2,
                p: 3,
              }}
            >
              <Typography variant="h4" fontWeight={900}>
                {track.price}
              </Typography>
              <Typography color="text.secondary">{track.tier}</Typography>
              <Divider sx={{ my: 3 }} />
              <Stack spacing={2}>
                <Typography>
                  <AccessTimeRoundedIcon fontSize="small" /> {track.duration} /{" "}
                  {totalHours} lab hours
                </Typography>
                <Typography>
                  <GroupRoundedIcon fontSize="small" />{" "}
                  {track.mentorship ? "Mentorship included" : "Self-paced"}
                </Typography>
                {track.prerequisites.map((item) => (
                  <Typography key={item}>
                    <CheckCircleRoundedIcon color="success" fontSize="small" />{" "}
                    {item}
                  </Typography>
                ))}
              </Stack>
              <Button
                component={Link}
                href={checkoutHref}
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 3 }}
              >
                Start This Track
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  )
}

export default SkillTrackDetail
