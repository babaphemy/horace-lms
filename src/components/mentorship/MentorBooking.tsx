"use client"

import {
  buildCalendarHref,
  createMentorshipId,
  getAllMentorshipBookingsKey,
  getMentor,
  getMentorshipBookingsKey,
  MentorshipBooking,
  MentorshipFormat,
  notifyLearner,
  canChangeMentorshipBooking,
  isFutureMentorshipSlot,
} from "@/utils/mentorship"
import { skillTracks } from "@/data/skillTracks"
import { useSession } from "next-auth/react"
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded"
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded"
import EditCalendarRoundedIcon from "@mui/icons-material/EditCalendarRounded"
import VideoCameraFrontRoundedIcon from "@mui/icons-material/VideoCameraFrontRounded"
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

interface MentorBookingProps {
  trackId?: string
  mentorId?: string
  userId: string
}

const MentorBooking = ({
  trackId,
  mentorId,
  userId: requestedUserId,
}: MentorBookingProps) => {
  const { data: session } = useSession()
  const userId = session?.user?.id || requestedUserId
  const { track, mentor } = useMemo(
    () => getMentor(trackId, mentorId),
    [trackId, mentorId]
  )
  const [learnerName, setLearnerName] = useState("")
  const [learnerEmail, setLearnerEmail] = useState("")
  const [format, setFormat] = useState<MentorshipFormat>("1:1")
  const [slot, setSlot] = useState(mentor?.openSlots[0] || "")
  const [booking, setBooking] = useState<MentorshipBooking | null>(null)
  const [userBookings, setUserBookings] = useState<MentorshipBooking[]>([])

  // Modal dialog state for rescheduling / cancellation
  const [rescheduleTarget, setRescheduleTarget] =
    useState<MentorshipBooking | null>(null)
  const [rescheduleSlot, setRescheduleSlot] = useState("")
  const [cancelTarget, setCancelTarget] = useState<MentorshipBooking | null>(
    null
  )
  const [cancelReason, setCancelReason] = useState("")

  useEffect(() => {
    if (typeof window === "undefined") return
    const key = getMentorshipBookingsKey(userId)
    const existing = window.localStorage.getItem(key)
    try {
      const parsed = existing ? JSON.parse(existing) : []
      setUserBookings(Array.isArray(parsed) ? parsed : [])
    } catch {
      setUserBookings([])
    }
  }, [userId])

  const rescheduleMentor = skillTracks
    .find((item) => item.id === rescheduleTarget?.trackId)
    ?.mentors.find((item) => item.id === rescheduleTarget?.mentorId)
  const rescheduleSlots = (rescheduleMentor?.openSlots || []).filter(
    isFutureMentorshipSlotNow
  )

  if (!track || !mentor) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" fontWeight={900}>
          Mentor unavailable
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Choose a mentored skill track to book a session.
        </Typography>
      </Container>
    )
  }

  const canBook =
    learnerName.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(learnerEmail.trim()) &&
    mentor.openSlots.includes(slot) &&
    isFutureMentorshipSlot(slot)

  const handleBooking = () => {
    if (!canBook) return
    const bookingId = createMentorshipId("booking")
    const nextBooking: MentorshipBooking = {
      id: bookingId,
      userId,
      trackId: track.id,
      trackTitle: track.title,
      mentorId: mentor.id,
      mentorName: mentor.name,
      learnerName: learnerName.trim(),
      learnerEmail: learnerEmail.trim(),
      slot,
      format,
      status: "Booked",
      createdAt: new Date().toISOString(),
    }

    // Save to user storage
    const key = getMentorshipBookingsKey(userId)
    const existing = window.localStorage.getItem(key)
    const bookings = existing
      ? (JSON.parse(existing) as MentorshipBooking[])
      : []
    const updatedUserBookings = [nextBooking, ...bookings]
    window.localStorage.setItem(key, JSON.stringify(updatedUserBookings))
    setUserBookings(updatedUserBookings)

    // Save to all bookings storage
    const allKey = getAllMentorshipBookingsKey()
    const allExisting = window.localStorage.getItem(allKey)
    const allBookings = allExisting
      ? (JSON.parse(allExisting) as MentorshipBooking[])
      : []
    window.localStorage.setItem(
      allKey,
      JSON.stringify([nextBooking, ...allBookings])
    )

    // Send confirmation notification to learner
    notifyLearner(
      userId,
      `Mentorship session confirmed with ${mentor.name} for ${slot} (${format}).`
    )

    setBooking(nextBooking)
  }

  const handleCancelBooking = () => {
    if (!cancelTarget || !canChangeMentorshipBooking(cancelTarget)) return
    const reason = cancelReason.trim() || "Learner requested cancellation."

    const updateList = (list: MentorshipBooking[]) =>
      list.map((b) =>
        b.id === cancelTarget.id
          ? {
              ...b,
              status: "Cancelled" as const,
              cancellationReason: reason,
            }
          : b
      )

    // Update user bookings
    const userKey = getMentorshipBookingsKey(userId)
    const updatedUser = updateList(userBookings)
    window.localStorage.setItem(userKey, JSON.stringify(updatedUser))
    setUserBookings(updatedUser)

    // Update global bookings
    const allKey = getAllMentorshipBookingsKey()
    const allExisting = window.localStorage.getItem(allKey)
    if (allExisting) {
      window.localStorage.setItem(
        allKey,
        JSON.stringify(updateList(JSON.parse(allExisting)))
      )
    }

    notifyLearner(
      userId,
      `Your mentorship session with ${cancelTarget.mentorName} on ${cancelTarget.slot} was cancelled.`
    )

    setCancelTarget(null)
    setBooking(null)
    setCancelReason("")
  }

  const handleRescheduleBooking = () => {
    if (
      !rescheduleTarget ||
      !canChangeMentorshipBooking(rescheduleTarget) ||
      !rescheduleSlots.includes(rescheduleSlot) ||
      !isFutureMentorshipSlot(rescheduleSlot)
    )
      return

    const updateList = (list: MentorshipBooking[]) =>
      list.map((b) =>
        b.id === rescheduleTarget.id
          ? {
              ...b,
              status: "Rescheduled" as const,
              rescheduledSlot: rescheduleSlot,
              slot: rescheduleSlot,
            }
          : b
      )

    // Update user bookings
    const userKey = getMentorshipBookingsKey(userId)
    const updatedUser = updateList(userBookings)
    window.localStorage.setItem(userKey, JSON.stringify(updatedUser))
    setUserBookings(updatedUser)

    // Update global bookings
    const allKey = getAllMentorshipBookingsKey()
    const allExisting = window.localStorage.getItem(allKey)
    if (allExisting) {
      window.localStorage.setItem(
        allKey,
        JSON.stringify(updateList(JSON.parse(allExisting)))
      )
    }

    notifyLearner(
      userId,
      `Your mentorship session with ${rescheduleTarget.mentorName} was rescheduled to ${rescheduleSlot}.`
    )

    setRescheduleTarget(null)
    setBooking(null)
    setRescheduleSlot("")
  }

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
            Mentorship booking
          </Typography>
          <Typography
            component="h1"
            sx={{
              mt: 1,
              fontSize: { xs: 40, md: 64 },
              lineHeight: 1,
              fontWeight: 900,
              maxWidth: 780,
            }}
          >
            Book time with {mentor.name}.
          </Typography>
          <Typography sx={{ mt: 2, color: "rgba(255,255,255,0.82)" }}>
            {track.title} / {mentor.expertise}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {booking && (
          <Alert
            severity="success"
            icon={<CheckCircleRoundedIcon />}
            sx={{ mb: 3 }}
          >
            Session booked for {booking.slot}. A calendar file is ready below.
          </Alert>
        )}

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          alignItems="flex-start"
        >
          <Box
            sx={{
              bgcolor: "white",
              border: "1px solid #dce7eb",
              borderRadius: 2,
              p: 3,
              flex: 1,
              width: "100%",
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Avatar
                src={mentor.photo}
                alt={mentor.name}
                sx={{ width: 72, height: 72 }}
              />
              <Box>
                <Typography variant="h5" fontWeight={900}>
                  {mentor.name}
                </Typography>
                <Typography color="text.secondary">{mentor.bio}</Typography>
                <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 1 }}>
                  {mentor.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" />
                  ))}
                </Stack>
              </Box>
            </Stack>

            <Typography variant="h6" fontWeight={900} sx={{ mb: 1 }}>
              Choose a session format
            </Typography>
            <FormControl sx={{ mb: 3 }}>
              <RadioGroup
                row
                value={format}
                onChange={(event) =>
                  setFormat(event.target.value as MentorshipFormat)
                }
              >
                <FormControlLabel value="1:1" control={<Radio />} label="1:1" />
                <FormControlLabel
                  value="Group"
                  control={<Radio />}
                  label="Group"
                />
              </RadioGroup>
            </FormControl>

            <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>
              Open time slots
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1.5} sx={{ mb: 3 }}>
              {mentor.openSlots
                .filter(isFutureMentorshipSlotNow)
                .map((item) => (
                  <Button
                    key={item}
                    variant={slot === item ? "contained" : "outlined"}
                    startIcon={<CalendarMonthRoundedIcon />}
                    onClick={() => setSlot(item)}
                  >
                    {item}
                  </Button>
                ))}
            </Stack>

            {!mentor.openSlots.some(isFutureMentorshipSlotNow) && (
              <Alert severity="info" sx={{ mb: 2 }}>
                No upcoming slots are available for this mentor.
              </Alert>
            )}

            <Stack spacing={2}>
              <TextField
                label="Learner name"
                value={learnerName}
                onChange={(event) => setLearnerName(event.target.value)}
                fullWidth
              />
              <TextField
                label="Learner email"
                value={learnerEmail}
                onChange={(event) => setLearnerEmail(event.target.value)}
                fullWidth
              />
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mt: 3 }}
            >
              <Button
                variant="contained"
                size="large"
                disabled={!canBook}
                startIcon={<GroupsRoundedIcon />}
                onClick={handleBooking}
              >
                Book Session
              </Button>
              {booking && (
                <Button
                  href={buildCalendarHref(booking)}
                  download="horace-mentorship.ics"
                  variant="outlined"
                  size="large"
                >
                  Download Calendar Invite
                </Button>
              )}
              <Button
                component={Link}
                href={`/course/${track.id}`}
                size="large"
              >
                Back To Track
              </Button>
            </Stack>
          </Box>

          <Box
            sx={{
              bgcolor: "white",
              border: "1px solid #dce7eb",
              borderRadius: 2,
              p: 3,
              width: { xs: "100%", md: 360 },
            }}
          >
            <Typography variant="h6" fontWeight={900}>
              Mentor signal
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Average response: {mentor.responseTime}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Rating: {mentor.rating.toFixed(1)}/5
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Learners can cancel or reschedule up to 12 hours before the
              session.
            </Typography>
          </Box>
        </Stack>

        {userBookings.length > 0 && (
          <Box sx={{ mt: 5 }}>
            <Typography variant="h5" fontWeight={900} sx={{ mb: 2 }}>
              Your Booked Sessions ({userBookings.length})
            </Typography>
            <Stack spacing={2}>
              {userBookings.map((b) => (
                <Box
                  key={b.id}
                  sx={{
                    bgcolor: "white",
                    border: "1px solid #dce7eb",
                    borderRadius: 2,
                    p: 3,
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={2}
                  >
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="h6" fontWeight={800}>
                          {b.trackTitle}
                        </Typography>
                        <Chip
                          label={b.status}
                          size="small"
                          color={
                            b.status === "Booked"
                              ? "success"
                              : b.status === "Rescheduled"
                                ? "info"
                                : "default"
                          }
                        />
                        <Chip
                          label={b.format}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        Mentor: <strong>{b.mentorName}</strong> &bull; Scheduled
                        Slot: <strong>{b.slot}</strong>
                      </Typography>
                      {b.cancellationReason && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ display: "block", mt: 0.5 }}
                        >
                          Cancellation reason: {b.cancellationReason}
                        </Typography>
                      )}
                    </Box>

                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {(b.status === "Booked" ||
                        b.status === "Rescheduled") && (
                        <>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<EditCalendarRoundedIcon />}
                            disabled={!canChangeMentorshipBooking(b)}
                            onClick={() => {
                              setRescheduleTarget(b)
                              setRescheduleSlot("")
                            }}
                          >
                            Reschedule
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            variant="outlined"
                            startIcon={<EventBusyRoundedIcon />}
                            disabled={!canChangeMentorshipBooking(b)}
                            onClick={() => {
                              setCancelTarget(b)
                              setCancelReason("")
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            disabled={!b.meetingUrl}
                            startIcon={<VideoCameraFrontRoundedIcon />}
                            component="a"
                            href={b.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Join Room
                          </Button>
                        </>
                      )}
                      <Button
                        size="small"
                        disabled={b.status === "Cancelled"}
                        href={buildCalendarHref(b)}
                        download="horace-session.ics"
                      >
                        Calendar (.ics)
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {/* Reschedule Dialog */}
        <Dialog
          open={!!rescheduleTarget}
          onClose={() => setRescheduleTarget(null)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle fontWeight={800}>
            Reschedule Mentorship Session
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Choose a new available slot with {rescheduleTarget?.mentorName}:
            </Typography>
            <Stack spacing={1}>
              {rescheduleSlots.map((s) => (
                <Button
                  key={s}
                  variant={rescheduleSlot === s ? "contained" : "outlined"}
                  onClick={() => setRescheduleSlot(s)}
                  fullWidth
                >
                  {s}
                </Button>
              ))}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setRescheduleTarget(null)}>
              Never Mind
            </Button>
            <Button
              variant="contained"
              disabled={
                !rescheduleSlot ||
                !rescheduleTarget ||
                !canChangeMentorshipBooking(rescheduleTarget)
              }
              onClick={handleRescheduleBooking}
            >
              Confirm Reschedule
            </Button>
          </DialogActions>
        </Dialog>

        {/* Cancel Dialog */}
        <Dialog
          open={!!cancelTarget}
          onClose={() => setCancelTarget(null)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle fontWeight={800}>Cancel Mentorship Session</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Are you sure you want to cancel the session scheduled for{" "}
              {cancelTarget?.slot}?
            </Typography>
            <TextField
              label="Reason for cancellation (optional)"
              fullWidth
              multiline
              rows={2}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g., Conflict with work schedule"
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setCancelTarget(null)}>Keep Session</Button>
            <Button
              color="error"
              variant="contained"
              disabled={
                !cancelTarget || !canChangeMentorshipBooking(cancelTarget)
              }
              onClick={handleCancelBooking}
            >
              Confirm Cancellation
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}

export default MentorBooking

function isFutureMentorshipSlotNow(slot: string) {
  return isFutureMentorshipSlot(slot)
}
