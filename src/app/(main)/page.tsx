import ContactLms from "@/components/lms/ContactLms"
import HeaderBanner from "@/components/lms/Headerbanner"
import SchoolLogos from "@/components/lms/SchoolLogos"
import FeatureList from "@/components/lms/feature/FeatureList"
import Pricing from "@/components/lms/pricing/Pricing"
import { skillTracks } from "@/data/skillTracks"
import { Box, Button, Container, Stack, Typography } from "@mui/material"
import Link from "next/link"
import { generateMetadata } from "../metadata"
export const metadata = generateMetadata({
  title: "Horace LMS | Hands-On Skill Tracks",
  description:
    "Hands-on skill tracks, practical labs, mentorship, and portfolio-ready projects for job-ready learners.",
})
const Lms = () => {
  return (
    <Box>
      <HeaderBanner />
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          alignItems={{ xs: "stretch", md: "center" }}
          justifyContent="space-between"
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography
              component="p"
              sx={{
                color: "#00A9C1",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 0,
                mb: 1,
              }}
            >
              Featured skill tracks
            </Typography>
            <Typography variant="h3" component="h2" fontWeight={800}>
              Choose a practical path to a job-ready portfolio.
            </Typography>
          </Box>
          <Button
            component={Link}
            href="/courses"
            variant="outlined"
            size="large"
            sx={{ alignSelf: { xs: "flex-start", md: "center" } }}
          >
            Browse All Tracks
          </Button>
        </Stack>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(4, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          {skillTracks.map((track) => (
            <Box
              key={track.id}
              component={Link}
              href={`/course/${track.id}`}
              sx={{
                color: "inherit",
                textDecoration: "none",
                border: "1px solid #d8e3e8",
                borderRadius: 2,
                overflow: "hidden",
                minHeight: 360,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "border-color 160ms ease, transform 160ms ease",
                "&:hover": {
                  borderColor: "#00A9C1",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Box
                component="img"
                src={track.thumbnail}
                alt={`${track.title} preview`}
                sx={{
                  width: "100%",
                  height: 150,
                  objectFit: "cover",
                  display: "block",
                  bgcolor: "#eef5f6",
                }}
              />
              <Box sx={{ p: 2, flex: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {track.domain} / {track.level}
                </Typography>
                <Typography variant="h6" fontWeight={800} sx={{ mt: 1 }}>
                  {track.title}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  {track.outcome}
                </Typography>
              </Box>
              <Typography color="#0F5E76" fontWeight={800} sx={{ p: 2, pt: 0 }}>
                {track.duration} / {track.price}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
      <Box>
        <FeatureList />
        <Pricing />
        <SchoolLogos />
        <ContactLms />
      </Box>
    </Box>
  )
}
export default Lms
