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

function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
}

function formatIcsDate(date: Date) {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z")
}

function parseWatSlot(slot: string) {
  const match = slot.match(
    /^([A-Za-z]+) (\d{1,2}), (\d{4}), (\d{1,2}):(\d{2}) (AM|PM) WAT$/
  )

  if (!match) return null

  const [, monthName, day, year, hour, minute, period] = match
  const month = new Date(`${monthName} 1, ${year}`).getMonth()

  if (Number.isNaN(month)) return null

  const rawHour = Number(hour)
  const normalizedHour =
    period === "PM" ? (rawHour % 12) + 12 : rawHour === 12 ? 0 : rawHour

  return new Date(
    Date.UTC(
      Number(year),
      month,
      Number(day),
      normalizedHour - 1,
      Number(minute)
    )
  )
}

export function buildCalendarHref(booking: MentorshipBooking) {
  const startDate =
    parseWatSlot(booking.slot) ||
    new Date(Date.parse(booking.createdAt) || Date.now())
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000)
  const details = [
    `Track: ${booking.trackTitle}`,
    `Mentor: ${booking.mentorName}`,
    `Slot: ${booking.slot}`,
    `Format: ${booking.format}`,
    "Join details will be shared in-platform.",
  ].join("\n")

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Horace LMS//Mentorship//EN",
    "BEGIN:VEVENT",
    `UID:${booking.id}@horacelearning.local`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(startDate)}`,
    `DTEND:${formatIcsDate(endDate)}`,
    `SUMMARY:${escapeIcsText(`Horace Mentorship: ${booking.trackTitle}`)}`,
    `DESCRIPTION:${escapeIcsText(details)}`,
    `LOCATION:${escapeIcsText("Horace LMS")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\n")

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`
}
