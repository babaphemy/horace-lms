import LabWorkspace from "@/components/labs/LabWorkspace"
import { Box, Container, Typography } from "@mui/material"

interface LabPageProps {
  searchParams: Promise<{
    courseId?: string
    lessonId?: string
    title?: string
    userId?: string
  }>
}

const LabPage = async ({ searchParams }: LabPageProps) => {
  const params = await searchParams
  const courseId = params.courseId || "preview-track"
  const lessonId = params.lessonId || "preview-lab"
  const lessonTitle = params.title
    ? decodeURIComponent(params.title)
    : "Hands-on Lab"

  if (!courseId || !lessonId) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#f6fafb", py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight={900}>
            Lab unavailable
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            A course and lesson are required to launch a lab workspace.
          </Typography>
        </Container>
      </Box>
    )
  }

  return (
    <LabWorkspace
      courseId={courseId}
      lessonId={lessonId}
      lessonTitle={lessonTitle}
      userId={params.userId || "guest"}
    />
  )
}

export default LabPage
