import MentorBooking from "@/components/mentorship/MentorBooking"

interface BookMentorPageProps {
  searchParams: Promise<{
    trackId?: string
    mentorId?: string
    userId?: string
  }>
}

const BookMentorPage = async ({ searchParams }: BookMentorPageProps) => {
  const params = await searchParams

  return (
    <MentorBooking
      trackId={params.trackId}
      mentorId={params.mentorId}
      userId={params.userId || "guest"}
    />
  )
}

export default BookMentorPage
