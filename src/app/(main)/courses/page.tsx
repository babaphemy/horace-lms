"use client"

import Footer from "@/components/Footer"
import {
  domains,
  durations,
  levels,
  skillTracks,
  SkillDomain,
  SkillLevel,
  TrackDuration,
} from "@/data/skillTracks"
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded"
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded"
import GroupRoundedIcon from "@mui/icons-material/GroupRounded"
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded"
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material"
import Link from "next/link"
import { useMemo, useState } from "react"

type FilterValue<T extends string> = "All" | T

export type FilterItem = {
  label: string
  value: string
}

const Courses = () => {
  const [domain, setDomain] = useState<FilterValue<SkillDomain>>("All")
  const [level, setLevel] = useState<FilterValue<SkillLevel>>("All")
  const [duration, setDuration] = useState<FilterValue<TrackDuration>>("All")
  const [mentorship, setMentorship] = useState<
    "All" | "Included" | "Self-paced"
  >("All")

  const filteredTracks = useMemo(
    () =>
      skillTracks.filter((track) => {
        const matchesDomain = domain === "All" || track.domain === domain
        const matchesLevel = level === "All" || track.level === level
        const matchesDuration =
          duration === "All" || track.duration === duration
        const matchesMentorship =
          mentorship === "All" ||
          (mentorship === "Included" && track.mentorship) ||
          (mentorship === "Self-paced" && !track.mentorship)

        return (
          matchesDomain && matchesLevel && matchesDuration && matchesMentorship
        )
      }),
    [domain, level, duration, mentorship]
  )

  return (
    <Box sx={{ bgcolor: "#f6fafb" }}>
      <Box
        component="section"
        sx={{
          bgcolor: "#062d3a",
          color: "white",
          py: { xs: 8, md: 11 },
        }}
      >
        <Container maxWidth="lg">
          <Typography
            component="p"
            sx={{
              color: "#74e4ef",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: 0,
              mb: 2,
            }}
          >
            Skill track catalog
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 40, md: 64 },
              lineHeight: 1,
              fontWeight: 900,
              maxWidth: 780,
            }}
          >
            Browse practical tracks by role, level, duration, and mentorship.
          </Typography>
          <Typography
            sx={{
              mt: 3,
              color: "rgba(255,255,255,0.82)",
              fontSize: { xs: 18, md: 22 },
              maxWidth: 720,
            }}
          >
            See the outcome, labs, prerequisites, and portfolio proof before you
            enroll.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
        <Box
          sx={{
            bgcolor: "white",
            border: "1px solid #dce7eb",
            borderRadius: 2,
            p: { xs: 2, md: 3 },
            mb: 4,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <FilterAltRoundedIcon color="primary" />
            <Typography variant="h6" fontWeight={800}>
              Filter tracks
            </Typography>
          </Stack>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Domain</InputLabel>
                <Select
                  value={domain}
                  label="Domain"
                  onChange={(event) =>
                    setDomain(event.target.value as FilterValue<SkillDomain>)
                  }
                >
                  <MenuItem value="All">All domains</MenuItem>
                  {domains.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Level</InputLabel>
                <Select
                  value={level}
                  label="Level"
                  onChange={(event) =>
                    setLevel(event.target.value as FilterValue<SkillLevel>)
                  }
                >
                  <MenuItem value="All">All levels</MenuItem>
                  {levels.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Duration</InputLabel>
                <Select
                  value={duration}
                  label="Duration"
                  onChange={(event) =>
                    setDuration(
                      event.target.value as FilterValue<TrackDuration>
                    )
                  }
                >
                  <MenuItem value="All">All durations</MenuItem>
                  {durations.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Mentorship</InputLabel>
                <Select
                  value={mentorship}
                  label="Mentorship"
                  onChange={(event) =>
                    setMentorship(
                      event.target.value as "All" | "Included" | "Self-paced"
                    )
                  }
                >
                  <MenuItem value="All">All tracks</MenuItem>
                  <MenuItem value="Included">Mentorship included</MenuItem>
                  <MenuItem value="Self-paced">Self-paced</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={3}>
          {filteredTracks.map((track) => (
            <Grid size={{ xs: 12, md: 6 }} key={track.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 2,
                  border: "1px solid #dce7eb",
                  boxShadow: "none",
                  overflow: "hidden",
                }}
              >
                <CardMedia
                  component="img"
                  height="220"
                  image={track.thumbnail}
                  alt={`${track.title} thumbnail`}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    <Chip label={track.domain} size="small" />
                    <Chip label={track.level} size="small" variant="outlined" />
                    {track.mentorship && (
                      <Chip
                        label="Mentorship"
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    )}
                  </Stack>
                  <Box>
                    <Typography variant="h4" component="h2" fontWeight={900}>
                      {track.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                      {track.outcome}
                    </Typography>
                  </Box>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    color="text.secondary"
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <AccessTimeRoundedIcon fontSize="small" />
                      <Typography>{track.duration}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <WorkspacePremiumRoundedIcon fontSize="small" />
                      <Typography>{track.targetRole}</Typography>
                    </Stack>
                  </Stack>
                  <Box sx={{ mt: "auto" }}>
                    <Typography variant="h5" color="#0F5E76" fontWeight={900}>
                      {track.price}
                      <Typography
                        component="span"
                        color="text.secondary"
                        sx={{ ml: 1 }}
                      >
                        {track.tier}
                      </Typography>
                    </Typography>
                    <Button
                      component={Link}
                      href={`/course/${track.id}`}
                      variant="contained"
                      fullWidth
                      sx={{ mt: 2, py: 1.2 }}
                    >
                      View Track Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box id="preview-labs" sx={{ mt: 7 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <GroupRoundedIcon color="primary" />
            <Typography variant="h4" component="h2" fontWeight={900}>
              Preview labs
            </Typography>
          </Stack>
          <Grid container spacing={2}>
            {skillTracks.map((track) => (
              <Grid size={{ xs: 12, md: 6 }} key={track.previewLab.title}>
                <Box
                  sx={{
                    bgcolor: "white",
                    border: "1px solid #dce7eb",
                    borderRadius: 2,
                    p: 3,
                    height: "100%",
                  }}
                >
                  <Typography color="#00A9C1" fontWeight={800}>
                    {track.title}
                  </Typography>
                  <Typography variant="h6" fontWeight={900} sx={{ mt: 1 }}>
                    {track.previewLab.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    {track.previewLab.description}
                  </Typography>
                  <Typography sx={{ mt: 2 }} fontWeight={800}>
                    Estimate: {track.previewLab.estimate}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      <Footer />
    </Box>
  )
}

export default Courses
