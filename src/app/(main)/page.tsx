import ContactLms from "@/components/lms/ContactLms"
import HeaderBanner from "@/components/lms/Headerbanner"
import SchoolLogos from "@/components/lms/SchoolLogos"
import FeatureList from "@/components/lms/feature/FeatureList"
import FeaturedCourses from "@/components/lms/FeaturedCourses"
import Pricing from "@/components/lms/pricing/Pricing"
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
        <FeaturedCourses />
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
