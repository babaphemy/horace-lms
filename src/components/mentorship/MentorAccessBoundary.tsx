"use client"

import { useSession } from "next-auth/react"
import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Stack,
} from "@mui/material"
import Link from "next/link"
import { LmsAuthorization } from "@/utils/lmsAuthorization"

export default function MentorAccessBoundary({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const authorization = new LmsAuthorization(session?.user)
  if (status === "loading")
    return (
      <Container sx={{ py: 6 }}>
        <CircularProgress aria-label="Checking mentor access" />
      </Container>
    )
  if (!authorization.canAccessMentorRoutes())
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">
          Mentor or administrator access is required.
        </Alert>
      </Container>
    )
  // Existing screens read global localStorage queues. Never mount these for
  // mentors until verified server-side track assignments/scoped APIs are wired.
  if (!authorization.isAdmin())
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Stack spacing={2}>
          <Alert severity="warning">
            Assigned-track access is not connected yet. Learner records are
            unavailable in this workspace.
          </Alert>
          <Button component={Link} href="/">
            Back to home
          </Button>
        </Stack>
      </Container>
    )
  return children
}
