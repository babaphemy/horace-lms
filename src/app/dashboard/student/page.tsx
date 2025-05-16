"use client"
import EnhancedProfile from "@/components/user/EnhancedProfile"
import EnhancedTimeline from "@/components/user/EnhancedTimeline"
import QuickStats from "@/components/user/QuickStats"
import { Home, School } from "@mui/icons-material"
import { Box, Breadcrumbs, Button, Grid, Typography } from "@mui/material"
import { useSession } from "next-auth/react"
import Link from "next/link"

export default function Students() {
  const { data: session } = useSession()

  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome, {session?.user?.firstname || "Student"}
          </Typography>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <Home sx={{ mr: 0.5 }} fontSize="inherit" />
              Dashboard
            </Link>
            <Typography
              color="text.primary"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <School sx={{ mr: 0.5 }} fontSize="inherit" />
              Home
            </Typography>
          </Breadcrumbs>
        </Box>
        <Box>
          <Link href={"/student/lms"}>
            <Button variant="contained" color="primary" sx={{ mr: 2 }}>
              My Courses
            </Button>
          </Link>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8, lg: 5 }}>
          <EnhancedProfile />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <EnhancedTimeline />
        </Grid>
        <Grid size={{ xs: 12, md: 8, lg: 4 }}>
          <QuickStats />
        </Grid>
      </Grid>
    </Box>
  )
}
