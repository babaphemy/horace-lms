import Footer from "@/components/Footer"
import { SkillTrack } from "@/data/skillTracks"
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded"
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import GroupRoundedIcon from "@mui/icons-material/GroupRounded"
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded"
import MarkUnreadChatAltRoundedIcon from "@mui/icons-material/MarkUnreadChatAltRounded"
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
            <Box
              component="section"
              aria-labelledby="track-mentors"
              sx={{ mt: 5 }}
            >
              <Typography
                id="track-mentors"
                component="h2"
                variant="h5"
                fontWeight={900}
                sx={{ mb: 2 }}
              >
                Available mentors
              </Typography>
              {track.mentors.length === 0 ? (
                <Typography color="text.secondary">
                  This track is self-paced. No mentors are currently assigned.
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {track.mentors.map((mentor) => {
                    const params = new URLSearchParams({
                      trackId: track.id,
                      mentorId: mentor.id,
                    })
                    return (
                      <Grid key={mentor.id} size={{ xs: 12, sm: 6 }}>
                        <Box
                          sx={{
                            border: "1px solid #dce7eb",
                            borderRadius: 2,
                            bgcolor: "white",
                            p: 2.5,
                            height: "100%",
                            overflowWrap: "anywhere",
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                          >
                            <Avatar
                              src={mentor.photo}
                              alt={mentor.name}
                              sx={{ width: 56, height: 56 }}
                            />
                            <Typography
                              component="h3"
                              variant="h6"
                              fontWeight={800}
                            >
                              {mentor.name}
                            </Typography>
                          </Stack>
                          <Typography fontWeight={700} sx={{ mt: 2 }}>
                            {mentor.expertise}
                          </Typography>
                          <Typography color="text.secondary" sx={{ mt: 1 }}>
                            {mentor.bio}
                          </Typography>
                          <Stack
                            direction="row"
                            flexWrap="wrap"
                            gap={1}
                            sx={{ my: 2 }}
                          >
                            {mentor.tags.map((tag) => (
                              <Chip key={tag} label={tag} size="small" />
                            ))}
                          </Stack>
                          <Typography variant="body2">
                            Response target: {mentor.responseTime}
                          </Typography>
                          <Stack spacing={1} sx={{ mt: 2 }}>
                            <Button
                              component={Link}
                              href={`/mentorship/book?${params}`}
                              variant="contained"
                              startIcon={<CalendarMonthRoundedIcon />}
                              disabled={mentor.openSlots.length === 0}
                            >
                              View availability
                            </Button>
                            <Button
                              component={Link}
                              href={`/mentorship/ask?${params}`}
                              variant="outlined"
                              startIcon={<MarkUnreadChatAltRoundedIcon />}
                            >
                              Ask mentor
                            </Button>
                          </Stack>
                        </Box>
                      </Grid>
                    )
                  })}
                </Grid>
              )}
            </Box>
            <Box
              component="section"
              aria-labelledby="track-outcomes"
              sx={{ mt: 5 }}
            >
              <Typography
                id="track-outcomes"
                component="h2"
                variant="h5"
                fontWeight={900}
                sx={{ mb: 2 }}
              >
                What you will achieve
              </Typography>
              <Grid container spacing={2}>
                {track.outcomes.map((item) => (
                  <Grid key={item.label} size={{ xs: 12, sm: 6 }}>
                    <Box
                      sx={{
                        border: "1px solid #dce7eb",
                        borderRadius: 2,
                        p: 2.5,
                        bgcolor: "white",
                        height: "100%",
                      }}
                    >
                      <Typography variant="h6" fontWeight={800}>
                        {item.label}
                      </Typography>
                      <Typography color="text.secondary" sx={{ mt: 1 }}>
                        {item.detail}
                      </Typography>
                      <Typography
                        color="primary"
                        fontWeight={800}
                        sx={{ mt: 2 }}
                      >
                        {item.proof}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Box
              id="preview-lab"
              component="section"
              aria-labelledby="preview-lab-title"
              sx={{
                bgcolor: "#062d3a",
                color: "white",
                borderRadius: 2,
                p: { xs: 3, md: 4 },
                mt: 5,
              }}
            >
              <Typography color="#74e4ef" fontWeight={900}>
                Free preview lab
              </Typography>
              <Typography
                id="preview-lab-title"
                variant="h4"
                fontWeight={900}
                sx={{ mt: 1 }}
              >
                {track.previewLab.title}
              </Typography>
              <Typography
                sx={{ mt: 1.5, color: "rgba(255,255,255,0.82)", maxWidth: 760 }}
              >
                {track.previewLab.description}
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", sm: "center" }}
                sx={{ mt: 3 }}
              >
                <Typography fontWeight={800}>
                  Estimated time: {track.previewLab.estimate}
                </Typography>
                <Button
                  component={Link}
                  href={`/course/lab?courseId=${track.id}&lessonId=preview-lab&title=${encodeURIComponent(
                    track.previewLab.title
                  )}`}
                  variant="contained"
                  sx={{
                    bgcolor: "#00c48c",
                    "&:hover": { bgcolor: "#00a877" },
                  }}
                >
                  Try preview lab now
                </Button>
              </Stack>
            </Box>
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
              <Typography
                component="h2"
                variant="subtitle1"
                fontWeight={800}
                sx={{ mt: 3 }}
              >
                Target role
              </Typography>
              <Typography>{track.targetRole}</Typography>
              <Typography
                component="h2"
                variant="subtitle1"
                fontWeight={800}
                sx={{ mt: 2 }}
              >
                Skills covered
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
                {track.skills.map((skill) => (
                  <Chip key={skill} label={skill} size="small" />
                ))}
              </Stack>
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
