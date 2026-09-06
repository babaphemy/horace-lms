import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded"
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded"
import { Box, Button, Container, Stack, Typography } from "@mui/material"
import Link from "next/link"

const HeaderBanner = () => (
  <Box
    component="section"
    sx={{
      minHeight: { xs: 620, md: 680 },
      color: "white",
      backgroundImage:
        "linear-gradient(90deg, rgba(5, 35, 45, 0.92) 0%, rgba(6, 45, 58, 0.76) 46%, rgba(6, 45, 58, 0.18) 100%), url(/img/lms-banner.png)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      alignItems: "center",
    }}
  >
    <Container maxWidth="lg">
      <Box sx={{ maxWidth: 760, py: { xs: 8, md: 12 } }}>
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
          Hands-on learning for practical careers
        </Typography>
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: 42, md: 72 },
            lineHeight: 1,
            fontWeight: 900,
            maxWidth: 720,
          }}
        >
          Build job-ready skills through guided labs and mentorship.
        </Typography>
        <Typography
          sx={{
            mt: 3,
            color: "rgba(255,255,255,0.86)",
            fontSize: { xs: 18, md: 22 },
            maxWidth: 620,
          }}
        >
          Horace helps learners move from lessons to proof: practical skill
          tracks, checkpoint feedback, reviewed projects, and a portfolio they
          can share.
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mt: 4, maxWidth: { xs: 320, sm: "none" } }}
        >
          <Button
            component={Link}
            href="/courses"
            variant="contained"
            size="large"
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{
              bgcolor: "#00A9C1",
              "&:hover": { bgcolor: "#078fa3" },
              py: 1.4,
            }}
          >
            Browse Skill Tracks
          </Button>
          <Button
            component={Link}
            href="/courses#preview-labs"
            variant="outlined"
            size="large"
            startIcon={<PlayCircleRoundedIcon />}
            sx={{
              color: "white",
              borderColor: "rgba(255,255,255,0.72)",
              py: 1.4,
              "&:hover": {
                borderColor: "white",
                bgcolor: "rgba(255,255,255,0.08)",
              },
            }}
          >
            Preview A Lab
          </Button>
        </Stack>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: 2,
            mt: 7,
            maxWidth: 720,
          }}
        >
          {[
            ["4", "job-role skill tracks"],
            ["16", "portfolio labs mapped"],
            ["24h", "mentor response target"],
          ].map(([value, label]) => (
            <Box
              key={label}
              sx={{
                borderTop: "1px solid rgba(255,255,255,0.32)",
                pt: 2,
              }}
            >
              <Typography variant="h3" fontWeight={900}>
                {value}
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.76)" }}>
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  </Box>
)
export default HeaderBanner
