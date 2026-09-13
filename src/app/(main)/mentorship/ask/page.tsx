import AskMentor from "@/components/mentorship/AskMentor"

interface AskMentorPageProps {
  searchParams: Promise<{
    trackId?: string
    mentorId?: string
    lessonId?: string
    title?: string
    userId?: string
  }>
}

const AskMentorPage = async ({ searchParams }: AskMentorPageProps) => {
  const params = await searchParams

  return (
    <AskMentor
      trackId={params.trackId}
      mentorId={params.mentorId}
      lessonId={params.lessonId}
      lessonTitle={params.title ? decodeURIComponent(params.title) : undefined}
      userId={params.userId || "guest"}
    />
  )
}

export default AskMentorPage
