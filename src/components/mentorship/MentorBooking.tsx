"use client"

import {
  buildCalendarHref,
  createMentorshipId,
  getMentor,
  getMentorshipBookingsKey,
  MentorshipBooking,
  MentorshipFormat,
} from "@/utils/mentorship"
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded"
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import Link from "next/link"
import { useMemo, useState } from "react"

interface MentorBookingProps {
  trackId?: string
  mentorId?: string
  userId: string
}

const MentorBooking = ({ trackId, mentorId, userId }: MentorBookingProps) => {
  const { track, mentor } = useMemo(
    () => getMentor(trackId, mentorId),
    [trackId, mentorId]
  )
  const [learnerName, setLearnerName] = useState("")
  const [learnerEmail, setLearnerEmail] = useState("")
  const [format, setFormat] = useState<MentorshipFormat>("1:1")
  const [slot, setSlot] = useState(mentor?.openSlots[0] || "")
  const [booking, setBooking] = useState<MentorshipBooking | null>(null)

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

  const canBook = learnerName.trim() && learnerEmail.trim() && slot

  const handleBooking = () => {
    const nextBooking: MentorshipBooking = {
      id: createMentorshipId("booking"),
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

    const key = getMentorshipBookingsKey(userId)
    const existing = window.localStorage.getItem(key)
    const bookings = existing
      ? (JSON.parse(existing) as MentorshipBooking[])
      : []
    window.localStorage.setItem(key, JSON.stringify([nextBooking, ...bookings]))
    setBooking(nextBooking)
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
              {mentor.openSlots.map((item) => (
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
              session once backend scheduling is connected.
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

export default MentorBooking
