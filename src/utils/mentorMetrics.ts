import {
  parseWatSlot,
  type MentorshipBooking,
  type MentorshipQuestion,
} from "@/utils/mentorship"
import type { LabSubmission } from "@/utils/labs"

export const mentorQueueThresholdKey = "horace.mentorship.queue-threshold"

export function validQueueThreshold(value: number) {
  return Number.isInteger(value) && value >= 0 && value <= 10000
}

export function watWeekStart(now = Date.now()) {
  const day = new Date(now + 3600000)
  day.setUTCHours(0, 0, 0, 0)
  day.setUTCDate(day.getUTCDate() - ((day.getUTCDay() + 6) % 7))
  return day.toISOString().slice(0, 10)
}

export function getMentorMetrics(
  mentors: { id: string; name: string }[],
  bookings: MentorshipBooking[],
  questions: MentorshipQuestion[],
  submissions: LabSubmission[],
  week: string,
  threshold: number
) {
  const start = Date.parse(`${week}T00:00:00+01:00`)
  const end = start + 7 * 86400000
  const uniqueMentors = [
    ...new Map(mentors.map((mentor) => [mentor.id, mentor])).values(),
  ]
  const pending = submissions.filter(
    (submission) => submission.status !== "Reviewed"
  )
  const rows = uniqueMentors.map((mentor) => {
    const sessions = bookings.filter((booking) => {
      const date = parseWatSlot(booking.slot)?.getTime()
      return (
        booking.mentorId === mentor.id &&
        date !== undefined &&
        date >= start &&
        date < end
      )
    })
    const booked = sessions.filter((session) =>
      ["Booked", "Rescheduled", "Completed"].includes(session.status)
    ).length
    const completed = sessions.filter(
      (session) => session.status === "Completed"
    ).length
    const openQuestions = questions.filter(
      (question) =>
        question.mentorId === mentor.id && question.status === "Open"
    ).length
    const reviews = pending.filter(
      (submission) => submission.assignedMentorId === mentor.id
    ).length
    return {
      ...mentor,
      booked,
      completed,
      openQuestions,
      reviews,
      overloaded: openQuestions > threshold || reviews > threshold,
    }
  })
  const ids = new Set(uniqueMentors.map((mentor) => mentor.id))
  return {
    rows,
    unassignedReviews: pending.filter(
      (submission) =>
        !submission.assignedMentorId || !ids.has(submission.assignedMentorId)
    ).length,
  }
}
