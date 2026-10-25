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
  return `${prefix}-${crypto.randomUUID()}`
}

type Mentor = (typeof skillTracks)[number]["mentors"][number]

export function getAvailableMentorSlots(
  mentor: Mentor | undefined,
  bookings: MentorshipBooking[] = [],
  excludeId?: string,
  now = Date.now()
) {
  if (!mentor) return []
  const slots: string[] = []
  const today = new Date(now + 3600000)
  for (let offset = 0; offset < 14; offset++) {
    const day = new Date(
      Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate() + offset
      )
    )
    for (const availability of mentor.weeklyAvailability) {
      if (day.getUTCDay() !== availability.weekday) continue
      const start = new Date(
        day.getTime() +
          (availability.hour - 1) * 3600000 +
          availability.minute * 60000
      )
      if (start.getTime() <= now + 12 * 3600000) continue
      const slot = `${day.toLocaleString("en-US", { month: "long", timeZone: "UTC" })} ${day.getUTCDate()}, ${day.getUTCFullYear()}, ${availability.hour % 12 || 12}:${String(availability.minute).padStart(2, "0")} ${availability.hour >= 12 ? "PM" : "AM"} WAT`
      if (
        !bookings.some(
          (booking) =>
            booking.id !== excludeId &&
            booking.mentorId === mentor.id &&
            (booking.status === "Booked" || booking.status === "Rescheduled") &&
            parseWatSlot(booking.slot)?.getTime() === start.getTime()
        )
      )
        slots.push(slot)
    }
  }
  return slots.sort(
    (a, b) => parseWatSlot(a)!.getTime() - parseWatSlot(b)!.getTime()
  )
}

export function readMentorshipItems<T>(key: string): T[] {
  const value = JSON.parse(localStorage.getItem(key) || "[]")
  if (!Array.isArray(value))
    throw new Error("Stored mentorship data is invalid.")
  return value
}

function bookingMentor(booking: MentorshipBooking) {
  return skillTracks
    .find((track) => track.id === booking.trackId)
    ?.mentors.find((mentor) => mentor.id === booking.mentorId)
}

export async function answerMentorshipQuestion(id: string, answer: string) {
  return withBookingLock(() => {
    if (!answer.trim()) throw new Error("An answer is required.")
    const key = getAllMentorshipQuestionsKey()
    const all = readMentorshipItems<MentorshipQuestion>(key)
    const current = all.find((question) => question.id === id)
    if (!current) throw new Error("Question not found.")
    const updated: MentorshipQuestion = {
      ...current,
      answer: answer.trim(),
      status: "Answered",
      answeredAt: new Date().toISOString(),
    }
    if (current.userId) {
      const userKey = getMentorshipQuestionsKey(current.userId)
      const user = readMentorshipItems<MentorshipQuestion>(userKey)
      localStorage.setItem(
        userKey,
        JSON.stringify([
          updated,
          ...user.filter((question) => question.id !== id),
        ])
      )
    }
    const next = all.map((question) =>
      question.id === id ? updated : question
    )
    localStorage.setItem(key, JSON.stringify(next))
    if (current.userId)
      notifyLearner(
        current.userId,
        `Your mentor ${current.mentorName} replied to your question on "${current.lessonTitle}".`
      )
    window.dispatchEvent(new Event("mentorship-updated"))
    return next
  })
}

function persistBooking(booking: MentorshipBooking, all: MentorshipBooking[]) {
  const userKey = getMentorshipBookingsKey(booking.userId)
  const user = readMentorshipItems<MentorshipBooking>(userKey)
  localStorage.setItem(
    getAllMentorshipBookingsKey(),
    JSON.stringify([booking, ...all.filter((item) => item.id !== booking.id)])
  )
  localStorage.setItem(
    userKey,
    JSON.stringify([booking, ...user.filter((item) => item.id !== booking.id)])
  )
  window.dispatchEvent(new Event("mentorship-updated"))
}

async function withBookingLock<T>(action: () => T): Promise<T> {
  if (!navigator.locks)
    throw new Error("Booking requires a browser with Web Locks support.")
  return navigator.locks.request("horace-mentorship-bookings", action)
}

export async function createBooking(booking: MentorshipBooking) {
  return withBookingLock(() => {
    const all = readMentorshipItems<MentorshipBooking>(
      getAllMentorshipBookingsKey()
    )
    if (
      !getAvailableMentorSlots(bookingMentor(booking), all).includes(
        booking.slot
      )
    )
      throw new Error("This slot is no longer available. Choose another slot.")
    persistBooking(booking, all)
    return booking
  })
}

type BookingAction =
  | { type: "cancel"; reason: string }
  | { type: "reschedule"; slot: string }
  | { type: "meeting"; url: string }
  | { type: "complete" }

export async function changeBooking(
  id: string,
  action: BookingAction,
  learnerId?: string
) {
  return withBookingLock(() => {
    const all = readMentorshipItems<MentorshipBooking>(
      getAllMentorshipBookingsKey()
    )
    const current = all.find((booking) => booking.id === id)
    if (!current || (learnerId && current.userId !== learnerId))
      throw new Error("Booking not found.")
    if (action.type === "cancel" || action.type === "reschedule") {
      if (!canChangeMentorshipBooking(current))
        throw new Error(
          "Changes require an active booking at least 12 hours before the session."
        )
    }
    let next = { ...current }
    if (action.type === "cancel")
      next = { ...next, status: "Cancelled", cancellationReason: action.reason }
    if (action.type === "reschedule") {
      if (
        !getAvailableMentorSlots(bookingMentor(current), all, id).includes(
          action.slot
        )
      )
        throw new Error("This slot is not available for this mentor.")
      next = {
        ...next,
        status: "Rescheduled",
        slot: action.slot,
        rescheduledSlot: action.slot,
      }
    }
    if (action.type === "meeting") {
      if (learnerId || !["Booked", "Rescheduled"].includes(current.status))
        throw new Error("Only active sessions can receive meeting links.")
      const url = new URL(action.url)
      if (url.protocol !== "https:" || url.username || url.password)
        throw new Error("Enter a valid HTTPS meeting URL.")
      next.meetingUrl = url.href
    }
    if (action.type === "complete") {
      const start = parseWatSlot(current.slot)
      if (
        learnerId ||
        !start ||
        start.getTime() + 3600000 > Date.now() ||
        !["Booked", "Rescheduled"].includes(current.status)
      )
        throw new Error("Only an ended active session can be marked completed.")
      next.status = "Completed"
    }
    persistBooking(next, all)
    notifyLearner(
      next.userId,
      `Mentorship session with ${next.mentorName}: ${next.status}, ${next.slot}.`
    )
    return next
  })
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
