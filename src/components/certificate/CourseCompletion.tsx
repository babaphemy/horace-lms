"use client"

import React, { useState } from "react"
import { Button, Box, Typography, Alert } from "@mui/material"

import { CertificateData } from "@/types/types"
import CertificateGenerator from "./CertificateGenerator"
import CertificateDisplay from "./CertificateDisplay"

const CourseCompletion: React.FC<{ id: string }> = ({ id }) => {
  const [showGenerator, setShowGenerator] = useState(false)
  const [showCertificate, setShowCertificate] = useState(false)
  const [certificate, setCertificate] = useState<CertificateData | null>(null)

  const handleCertificateGenerated = (cert: CertificateData) => {
    setCertificate(cert)
    setShowCertificate(true)
  }

  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        my: "4rem",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Course Completed!
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        Congratulations on completing the course! You can now generate your
        certificate of completion.
      </Typography>

      <Alert severity="success" sx={{ mb: 3 }}>
        You have successfully completed this course and are eligible for a
        certificate.
      </Alert>

      <Button
        variant="contained"
        size="large"
        onClick={() => setShowGenerator(true)}
      >
        Get Certificate
      </Button>

      <CertificateGenerator
        open={showGenerator}
        onClose={() => setShowGenerator(false)}
        onCertificateGenerated={handleCertificateGenerated}
        courseId={id}
        courseName="Advanced Web Development"
      />

      {certificate && (
        <CertificateDisplay
          certificate={certificate}
          open={showCertificate}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </Box>
  )
}

export default CourseCompletion
