import MentorAccessBoundary from "@/components/mentorship/MentorAccessBoundary"

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MentorAccessBoundary>{children}</MentorAccessBoundary>
}
