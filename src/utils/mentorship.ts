import { getSkillTrack, skillTracks } from "@/data/skillTracks"
import { getLabNotificationsKey } from "@/utils/labs"

export type MentorshipFormat = "1:1" | "Group"
export type MentorshipQuestionStatus = "Open" | "Answered"
export type MentorshipStatus =
  | "Booked"
  | "Cancelled"
  | "Rescheduled"
  | "Completed"

export interface MentorshipBooking {
  id: string
  userId: string
  trackId: string
  trackTitle: string
  mentorId: string
  mentorName: string
  learnerName: string
  learnerEmail: string
  slot: string
  format: MentorshipFormat
  status: MentorshipStatus
  createdAt: string
  cancellationReason?: string
  rescheduledSlot?: string
  meetingUrl?: string
  notes?: string
}

export interface MentorshipQuestion {
  id: string
  userId?: string
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
  answer?: string
  answeredAt?: string
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

export function getAllMentorshipBookingsKey() {
  return "horace.mentorship.bookings.all"
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

export function notifyLearner(userId: string, message: string) {
  if (typeof window === "undefined") return
  try {
    const key = getLabNotificationsKey(userId || "guest")
    const saved = window.localStorage.getItem(key)
    const existing = saved ? (JSON.parse(saved) as string[]) : []
    window.localStorage.setItem(key, JSON.stringify([message, ...existing]))
  } catch {
    // Ignore storage errors in non-browser context
  }
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

export function parseWatSlot(slot: string) {
  const match = slot.match(
    /^([A-Za-z]+) (\d{1,2}), (\d{4}), (\d{1,2}):(\d{2}) (AM|PM) WAT$/
  )

  if (!match) return null

  const [, monthName, day, year, hour, minute, period] = match
  const month = new Date(`${monthName} 1, ${year}`).getMonth()

  if (Number.isNaN(month)) return null

  const rawHour = Number(hour)
  if (
    rawHour < 1 ||
    rawHour > 12 ||
    Number(minute) > 59 ||
    Number(day) < 1 ||
    Number(day) > new Date(Date.UTC(Number(year), month + 1, 0)).getUTCDate()
  )
    return null
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

export function isFutureMentorshipSlot(slot: string, now = Date.now()) {
  const date = parseWatSlot(slot)
  return date !== null && date.getTime() > now
}

export function canChangeMentorshipBooking(
  booking: MentorshipBooking,
  cutoffHours = 12,
  now = Date.now()
) {
  const date = parseWatSlot(booking.slot)
  return (
    (booking.status === "Booked" || booking.status === "Rescheduled") &&
    date !== null &&
    date.getTime() - now >= cutoffHours * 60 * 60 * 1000
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
