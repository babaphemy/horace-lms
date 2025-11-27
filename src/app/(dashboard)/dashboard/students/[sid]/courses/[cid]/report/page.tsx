"use client"

import React from "react"
import { Container, Box, Button, Typography } from "@mui/material"
import { ArrowBack } from "@mui/icons-material"
import Link from "next/link"
import { useParams } from "next/navigation"
import { StudentCourseReport } from "@/components/courses/author/StudentCourseReport"

const StudentReportPage: React.FC = () => {
  const params = useParams()
  const { sid, cid } = params

  if (!sid || !cid) {
    return <div>Loading...</div>
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          component={Link}
          href={`/dashboard/courses/${cid}/detail`}
          sx={{ mb: 2 }}
        >
          Back to Course
        </Button>
        <Typography variant="h4" gutterBottom>
          Student Progress Report
        </Typography>
      </Box>

      <StudentCourseReport studentId={sid as string} courseId={cid as string} />
    </Container>
  )
}

export default StudentReportPage
