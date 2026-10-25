"use client"

import { skillTracks } from "@/data/skillTracks"
import { getAllLabSubmissionsKey, LabSubmission } from "@/utils/labs"
import {
  buildCalendarHref,
  getAllMentorshipBookingsKey,
  getAllMentorshipQuestionsKey,
  MentorshipBooking,
  MentorshipQuestion,
  changeBooking,
  getAvailableMentorSlots,
  canChangeMentorshipBooking,
  parseWatSlot,
} from "@/utils/mentorship"
import AssignmentLateRoundedIcon from "@mui/icons-material/AssignmentLateRounded"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import EditCalendarRoundedIcon from "@mui/icons-material/EditCalendarRounded"
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded"
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded"
import MarkUnreadChatAltRoundedIcon from "@mui/icons-material/MarkUnreadChatAltRounded"
import VideoCameraFrontRoundedIcon from "@mui/icons-material/VideoCameraFrontRounded"
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material"
import Link from "next/link"
import { notifyError } from "@/utils/notification"
import React, { useEffect, useState } from "react"

const MentorOps = () => {
  const [tab, setTab] = useState(0)
  const [bookings, setBookings] = useState<MentorshipBooking[]>([])
  const [questions, setQuestions] = useState<MentorshipQuestion[]>([])
  const [submissions, setSubmissions] = useState<LabSubmission[]>([])

  // Modal dialog states
  const [rescheduleTarget, setRescheduleTarget] =
    useState<MentorshipBooking | null>(null)
  const [rescheduleSlot, setRescheduleSlot] = useState("")
  const [cancelTarget, setCancelTarget] = useState<MentorshipBooking | null>(
    null
  )
  const [cancelReason, setCancelReason] = useState("")
  const [meetingUrls, setMeetingUrls] = useState<Record<string, string>>({})

  const loadData = () => {
    if (typeof window === "undefined") return

    // Bookings
    const savedBookings = window.localStorage.getItem(
      getAllMentorshipBookingsKey()
    )
    setBookings(
      savedBookings ? (JSON.parse(savedBookings) as MentorshipBooking[]) : []
    )

    // Questions
    const savedQuestions = window.localStorage.getItem(
      getAllMentorshipQuestionsKey()
    )
    setQuestions(
      savedQuestions ? (JSON.parse(savedQuestions) as MentorshipQuestion[]) : []
    )

    // Submissions
    const savedSubmissions = window.localStorage.getItem(
      getAllLabSubmissionsKey()
    )
    setSubmissions(
      savedSubmissions ? (JSON.parse(savedSubmissions) as LabSubmission[]) : []
    )
  }

  useEffect(() => {
    loadData()
    window.addEventListener("storage", loadData)
    window.addEventListener("focus", loadData)
    window.addEventListener("mentorship-updated", loadData)
    return () => {
      window.removeEventListener("storage", loadData)
      window.removeEventListener("focus", loadData)
      window.removeEventListener("mentorship-updated", loadData)
    }
  }, [])

  const pendingSubmissions = submissions.filter((s) => s.status !== "Reviewed")
  const openQuestions = questions.filter((q) => q.status !== "Answered")
  const activeBookings = bookings.filter(
    (b) => b.status === "Booked" || b.status === "Rescheduled"
  )

  const allMentors = skillTracks.flatMap((t) => t.mentors)

  const applyBookingAction = async (
    id: string,
    action: Parameters<typeof changeBooking>[1]
  ) => {
    try {
      await changeBooking(id, action)
      loadData()
      return true
    } catch (error) {
      notifyError(
        error instanceof Error ? error.message : "Booking update failed."
      )
      return false
    }
  }
  const handleCancelBooking = async () => {
    if (
      cancelTarget &&
      (await applyBookingAction(cancelTarget.id, {
        type: "cancel",
        reason: cancelReason.trim() || "Cancelled by Mentor Operations",
      }))
    ) {
      setCancelTarget(null)
      setCancelReason("")
    }
  }
  const handleRescheduleBooking = async () => {
    if (
      rescheduleTarget &&
      (await applyBookingAction(rescheduleTarget.id, {
        type: "reschedule",
        slot: rescheduleSlot,
      }))
    ) {
      setRescheduleTarget(null)
      setRescheduleSlot("")
    }
  }

  // Find open slots for the targeted mentor
  const targetMentor = rescheduleTarget
    ? allMentors.find((m) => m.id === rescheduleTarget.mentorId)
    : null

  const availableSlots = getAvailableMentorSlots(
    targetMentor || undefined,
    bookings,
    rescheduleTarget?.id
  )

  return (
    <Box sx={{ bgcolor: "#f6fafb", minHeight: "100vh" }}>
      <Alert severity="warning">
        Demo operations: only bookings and questions saved in this browser are
        available. Changes do not notify users on other devices.
      </Alert>
      <Box sx={{ bgcolor: "#062d3a", color: "white", py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Typography
            component="p"
            sx={{
              color: "#74e4ef",
              fontWeight: 800,
              textTransform: "uppercase",
            }}
          >
            Operations & Quality Control
          </Typography>
          <Typography
            component="h1"
            sx={{ mt: 1, fontSize: { xs: 36, md: 56 }, fontWeight: 900 }}
          >
            Mentor Ops Dashboard
          </Typography>
          <Typography
            sx={{ mt: 1.5, color: "rgba(255,255,255,0.84)", maxWidth: 720 }}
          >
            Centralized queue monitoring across scheduled 1:1 sessions, lab
            artifact reviews, and learner async inquiries.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        {/* Metric Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ border: "1px solid #dce7eb", borderRadius: 2 }}>
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <AssignmentLateRoundedIcon
                    color="warning"
                    sx={{ fontSize: 32 }}
                  />
                  <Box>
                    <Typography variant="h4" fontWeight={900}>
                      {pendingSubmissions.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending Reviews
                    </Typography>
                  </Box>
                </Stack>
                <Button
                  component={Link}
                  href="/mentor/submissions"
                  size="small"
                  sx={{ mt: 2 }}
                >
                  Go to Reviews &rarr;
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ border: "1px solid #dce7eb", borderRadius: 2 }}>
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <MarkUnreadChatAltRoundedIcon
                    color="primary"
                    sx={{ fontSize: 32 }}
                  />
                  <Box>
                    <Typography variant="h4" fontWeight={900}>
                      {openQuestions.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Open Questions
                    </Typography>
                  </Box>
                </Stack>
                <Button
                  component={Link}
                  href="/mentor/queue"
                  size="small"
                  sx={{ mt: 2 }}
                >
                  Go to Q&A Queue &rarr;
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ border: "1px solid #dce7eb", borderRadius: 2 }}>
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <GroupsRoundedIcon color="success" sx={{ fontSize: 32 }} />
                  <Box>
                    <Typography variant="h4" fontWeight={900}>
                      {activeBookings.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Scheduled Sessions
                    </Typography>
                  </Box>
                </Stack>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 2.5 }}
                >
                  {bookings.filter((b) => b.status === "Cancelled").length}{" "}
                  cancelled
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ border: "1px solid #dce7eb", borderRadius: 2 }}>
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CheckCircleRoundedIcon color="info" sx={{ fontSize: 32 }} />
                  <Box>
                    <Typography variant="h4" fontWeight={900}>
                      {
                        submissions.filter((s) => s.status === "Reviewed")
                          .length
                      }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed Reviews
                    </Typography>
                  </Box>
                </Stack>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 2.5 }}
                >
                  {questions.filter((q) => q.status === "Answered").length}{" "}
                  inquiries answered
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tab Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={tab}
            onChange={(_, val) => setTab(val)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label={`Booked Sessions (${bookings.length})`} />
            <Tab label={`Lab Review Queue (${pendingSubmissions.length})`} />
            <Tab label={`Async Inquiries (${openQuestions.length})`} />
            <Tab label={`Mentor Roster (${allMentors.length})`} />
          </Tabs>
        </Box>

        {/* Tab 0: Booked Sessions */}
        {tab === 0 && (
          <Box>
            {bookings.length === 0 ? (
              <Box
                sx={{
                  bgcolor: "white",
                  p: 4,
                  borderRadius: 2,
                  textAlign: "center",
                  border: "1px solid #dce7eb",
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  No mentorship sessions have been booked yet.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {bookings.map((booking) => (
                  <Box
                    key={booking.id}
                    sx={{
                      bgcolor: "white",
                      border: "1px solid #dce7eb",
                      borderRadius: 2,
                      p: 3,
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", md: "center" }}
                      spacing={2}
                    >
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="h6" fontWeight={800}>
                            {booking.trackTitle}
                          </Typography>
                          <Chip
                            label={booking.status}
                            size="small"
                            color={
                              booking.status === "Booked"
                                ? "success"
                                : booking.status === "Rescheduled"
                                  ? "info"
                                  : "default"
                            }
                          />
                          <Chip
                            label={booking.format}
                            size="small"
                            variant="outlined"
                          />
                        </Stack>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          Learner: <strong>{booking.learnerName}</strong> (
                          {booking.learnerEmail}) &bull; Mentor:{" "}
                          <strong>{booking.mentorName}</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          Scheduled Slot: <strong>{booking.slot}</strong>
                        </Typography>
                        {(booking.status === "Booked" ||
                          booking.status === "Rescheduled") && (
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1}
                            mt={2}
                          >
                            <TextField
                              size="small"
                              label="HTTPS meeting URL"
                              value={
                                meetingUrls[booking.id] ??
                                booking.meetingUrl ??
                                ""
                              }
                              onChange={(event) =>
                                setMeetingUrls((current) => ({
                                  ...current,
                                  [booking.id]: event.target.value,
                                }))
                              }
                            />
                            <Button
                              onClick={() =>
                                applyBookingAction(booking.id, {
                                  type: "meeting",
                                  url:
                                    meetingUrls[booking.id] ??
                                    booking.meetingUrl ??
                                    "",
                                })
                              }
                            >
                              Save meeting link
                            </Button>
                            <Button
                              disabled={
                                !parseWatSlot(booking.slot) ||
                                parseWatSlot(booking.slot)!.getTime() +
                                  3600000 >
                                  Date.now()
                              }
                              onClick={() =>
                                applyBookingAction(booking.id, {
                                  type: "complete",
                                })
                              }
                            >
                              Mark completed
                            </Button>
                          </Stack>
                        )}
                        {booking.cancellationReason && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ display: "block", mt: 0.5 }}
                          >
                            Cancellation reason: {booking.cancellationReason}
                          </Typography>
                        )}
                      </Box>

                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {(booking.status === "Booked" ||
                          booking.status === "Rescheduled") && (
                          <>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<EditCalendarRoundedIcon />}
                              disabled={!canChangeMentorshipBooking(booking)}
                              onClick={() => {
                                setRescheduleTarget(booking)
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
                              disabled={!canChangeMentorshipBooking(booking)}
                              onClick={() => {
                                setCancelTarget(booking)
                                setCancelReason("")
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<VideoCameraFrontRoundedIcon />}
                              component="a"
                              href={booking.meetingUrl}
                              disabled={!booking.meetingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Launch Room
                            </Button>
                          </>
                        )}
                        <Button
                          size="small"
                          disabled={booking.status === "Cancelled"}
                          href={buildCalendarHref(booking)}
                          download="horace-mentorship.ics"
                        >
                          .ics Invite
                        </Button>
                      </Stack>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        )}

        {/* Tab 1: Lab Submissions */}
        {tab === 1 && (
          <Box>
            {pendingSubmissions.length === 0 ? (
              <Box
                sx={{
                  bgcolor: "white",
                  p: 4,
                  borderRadius: 2,
                  textAlign: "center",
                  border: "1px solid #dce7eb",
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  No submissions currently waiting for review. All caught up!
                </Typography>
                <Button
                  component={Link}
                  href="/mentor/submissions"
                  sx={{ mt: 2 }}
                  variant="outlined"
                >
                  View Submissions Archive
                </Button>
              </Box>
            ) : (
              <Stack spacing={2}>
                {pendingSubmissions.map((sub) => (
                  <Box
                    key={sub.id}
                    sx={{
                      bgcolor: "white",
                      border: "1px solid #dce7eb",
                      borderRadius: 2,
                      p: 3,
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography variant="h6" fontWeight={800}>
                          {sub.lessonTitle}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Track / Course: {sub.courseId} &bull; Learner:{" "}
                          {sub.userId} &bull; Submitted:{" "}
                          {new Date(sub.submittedAt).toLocaleDateString()}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mt: 0.5 }}
                        >
                          Due Date: {new Date(sub.dueAt).toLocaleDateString()}{" "}
                          &bull; Skills: {sub.skills.join(", ")}
                        </Typography>
                      </Box>
                      <Button
                        component={Link}
                        href="/mentor/submissions"
                        variant="contained"
                        size="small"
                      >
                        Grade with Rubric
                      </Button>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        )}

        {/* Tab 2: Async Inquiries */}
        {tab === 2 && (
          <Box>
            {openQuestions.length === 0 ? (
              <Box
                sx={{
                  bgcolor: "white",
                  p: 4,
                  borderRadius: 2,
                  textAlign: "center",
                  border: "1px solid #dce7eb",
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  No open inquiries in queue.
                </Typography>
                <Button
                  component={Link}
                  href="/mentor/queue"
                  sx={{ mt: 2 }}
                  variant="outlined"
                >
                  View Full Q&A History
                </Button>
              </Box>
            ) : (
              <Stack spacing={2}>
                {openQuestions.map((q) => (
                  <Box
                    key={q.id}
                    sx={{
                      bgcolor: "white",
                      border: "1px solid #dce7eb",
                      borderRadius: 2,
                      p: 3,
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      sx={{ mb: 1.5 }}
                    >
                      <Box>
                        <Typography variant="h6" fontWeight={800}>
                          {q.lessonTitle}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {q.trackTitle} &bull; Learner: {q.learnerName} &bull;
                          Assigned Mentor: {q.mentorName}
                        </Typography>
                      </Box>
                      <Button
                        component={Link}
                        href="/mentor/queue"
                        variant="contained"
                        size="small"
                      >
                        Answer In Queue
                      </Button>
                    </Stack>
                    <Typography
                      variant="body2"
                      sx={{ bgcolor: "#f8fafb", p: 2, borderRadius: 1 }}
                    >
                      {q.question}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        )}

        {/* Tab 3: Mentor Roster */}
        {tab === 3 && (
          <Grid container spacing={3}>
            {allMentors.map((m) => (
              <Grid key={m.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Box
                  sx={{
                    bgcolor: "white",
                    border: "1px solid #dce7eb",
                    borderRadius: 2,
                    p: 3,
                    height: "100%",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    <Avatar
                      src={m.photo}
                      alt={m.name}
                      sx={{ width: 56, height: 56 }}
                    />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={800}>
                        {m.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {m.expertise}
                      </Typography>
                    </Box>
                  </Stack>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {m.bio}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block" }}
                  >
                    Response SLA: <strong>{m.responseTime}</strong> &bull;
                    Rating: <strong>{m.rating.toFixed(1)}/5</strong>
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 0.5 }}
                  >
                    Open slots:{" "}
                    <strong>
                      {getAvailableMentorSlots(m, bookings).length} available
                    </strong>
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Reschedule Dialog */}
        <Dialog
          open={!!rescheduleTarget}
          onClose={() => setRescheduleTarget(null)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle fontWeight={800}>Ops: Reschedule Session</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Select a new open slot for learner {rescheduleTarget?.learnerName}{" "}
              with {rescheduleTarget?.mentorName}:
            </Typography>
            <Stack spacing={1}>
              {availableSlots.length > 0 ? (
                availableSlots.map((s) => (
                  <Button
                    key={s}
                    variant={rescheduleSlot === s ? "contained" : "outlined"}
                    onClick={() => setRescheduleSlot(s)}
                    fullWidth
                  >
                    {s}
                  </Button>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No available slots.
                </Typography>
              )}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setRescheduleTarget(null)}>Cancel</Button>
            <Button
              variant="contained"
              disabled={
                !availableSlots.includes(rescheduleSlot) ||
                !rescheduleTarget ||
                !canChangeMentorshipBooking(rescheduleTarget)
              }
              onClick={handleRescheduleBooking}
            >
              Update Schedule
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
          <DialogTitle fontWeight={800}>Ops: Cancel Session</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Cancel session for {cancelTarget?.learnerName} (
              {cancelTarget?.slot})?
            </Typography>
            <TextField
              label="Cancellation reason"
              fullWidth
              multiline
              rows={2}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Mentor emergency reschedule / schedule conflict"
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setCancelTarget(null)}>Keep Session</Button>
            <Button
              color="error"
              variant="contained"
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

export default MentorOps
