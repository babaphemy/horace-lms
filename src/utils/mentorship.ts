import { getSkillTrack, skillTracks } from "@/data/skillTracks"

export type MentorshipFormat = "1:1" | "Group"
export type MentorshipQuestionStatus = "Open" | "Answered"

export interface MentorshipBooking {
  id: string
  trackId: string
  trackTitle: string
  mentorId: string
  mentorName: string
  learnerName: string
  learnerEmail: string
  slot: string
  format: MentorshipFormat
  status: "Booked"
  createdAt: string
}

export interface MentorshipQuestion {
  id: string
  trackId: string
  trackTitle: string
  mentorId: string
  mentorName: string
  lessonId: string
  lessonTitle: string
  learnerName: string
  question: string
  status: MentorshipQuestionStatus
  createdAt: string
}

export function getMentor(trackId?: string, mentorId?: string) {
  const track =
    getSkillTrack(trackId || "") ||
    skillTracks.find((item) => item.mentors.length > 0)
  const mentor =
    track?.mentors.find((item) => item.id === mentorId) || track?.mentors[0]

  return { track, mentor }
}

export function getMentorshipBookingsKey(userId: string) {
  return `horace.mentorship.bookings.${userId || "guest"}`
}

export function getMentorshipQuestionsKey(userId: string) {
  return `horace.mentorship.questions.${userId || "guest"}`
}

export function getAllMentorshipQuestionsKey() {
  return "horace.mentorship.questions.all"
}

export function createMentorshipId(prefix: string) {
  return `${prefix}-${Date.now()}`
}

export function buildCalendarHref(booking: MentorshipBooking) {
  const details = [
    `Track: ${booking.trackTitle}`,
    `Mentor: ${booking.mentorName}`,
    `Format: ${booking.format}`,
    "Join details will be shared in-platform.",
  ].join("\\n")

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Horace LMS//Mentorship//EN",
    "BEGIN:VEVENT",
    `UID:${booking.id}@horacelearning.local`,
    `SUMMARY:Horace Mentorship: ${booking.trackTitle}`,
    `DESCRIPTION:${details}`,
    `LOCATION:Horace LMS`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\n")

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`
}
