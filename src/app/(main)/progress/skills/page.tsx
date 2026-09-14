import SkillReadinessProgress from "@/components/skills/SkillReadinessProgress"
import { Box, Container, Typography } from "@mui/material"

interface PageProps {
  searchParams: Promise<{
    userId?: string
  }>
}

const Page = async ({ searchParams }: PageProps) => {
  const params = await searchParams
  const userId = params.userId || "guest"

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
            Competency checklist
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
            Track your job-readiness progress.
          </Typography>
          <Typography sx={{ mt: 2, color: "rgba(255,255,255,0.82)" }}>
            Each track shows verified skills, active reviews, and competencies
            still needed for a stronger portfolio.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <SkillReadinessProgress userId={userId} showHeader={false} />
      </Container>
    </Box>
  )
}

export default Page
