"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
  FormControlLabel,
  Switch,
} from "@mui/material"
import { useMutation, useQuery } from "react-query"
import { CertificateData, EnrollmentStatus } from "@/types/types"
import { useSession } from "next-auth/react"
import { fetchCourse } from "@/app/api/rest"

interface CertificateGeneratorProps {
  open: boolean
  onClose: () => void
  onCertificateGenerated: (_certificate: CertificateData) => void
  courseId: string
  courseName: string
}

const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({
  open,
  onClose,
  onCertificateGenerated,
  courseId,
  courseName,
}) => {
  const { data: session } = useSession()
  const [includeScore, setIncludeScore] = useState<boolean>(false)
  const [finalScore, setFinalScore] = useState<number>(0)
  const [courseDuration, setCourseDuration] = useState<string>("Self-paced")
  const userId = session?.user?.id
  const {
    data: enrollmentStatus,
    isLoading: enrollmentLoading,
    error: enrollmentError,
  } = useQuery<EnrollmentStatus>({
    queryFn: () => fetchCourse(courseId, userId),
    queryKey: ["enrollment-status", courseId],

    enabled: open && !!courseId && !!userId,
  })

  const generateCertificateMutation = useMutation(
    async (certificateData: Partial<CertificateData>) => {
      const response = await fetch("/api/certificates/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(certificateData),
      })

      if (!response.ok) {
        throw new Error("Failed to generate certificate")
      }

      return response.json()
    },
    {
      onSuccess: (data: CertificateData) => {
        onCertificateGenerated(data)
        onClose()
      },
    }
  )

  const handleGenerate = () => {
    generateCertificateMutation.mutate({
      courseId,
      courseName,
      finalScore: includeScore ? finalScore : undefined,
      courseDuration,
    })
  }

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setIncludeScore(false)
      setFinalScore(0)
      setCourseDuration("Self-paced")
    }
  }, [open])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Generate Completion Certificate</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {enrollmentLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress />
            </Box>
          ) : enrollmentError ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to verify enrollment. Please try again.
            </Alert>
          ) : !enrollmentStatus?.isEnrolled ? (
            <Alert severity="warning" sx={{ mb: 2 }}>
              You are not enrolled in this course. Please enroll to generate a
              certificate.
            </Alert>
          ) : !enrollmentStatus?.isCompleted ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              You haven&apos;t completed this course yet. Complete the course to
              generate a certificate.
            </Alert>
          ) : (
            <>
              <Typography variant="body1" gutterBottom>
                Generate a certificate for{" "}
                <strong>{session?.user?.name}</strong> completing{" "}
                <strong>{courseName}</strong>.
              </Typography>

              <TextField
                fullWidth
                label="Course Duration"
                value={courseDuration}
                onChange={(e) => setCourseDuration(e.target.value)}
                margin="normal"
                helperText="e.g., '12 Weeks', 'Self-paced', '40 Hours'"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={includeScore}
                    onChange={(e) => setIncludeScore(e.target.checked)}
                  />
                }
                label="Include final score"
                sx={{ mt: 2 }}
              />

              {includeScore && (
                <TextField
                  fullWidth
                  label="Final Score (%)"
                  type="number"
                  value={finalScore}
                  onChange={(e) => setFinalScore(Number(e.target.value))}
                  inputProps={{ min: 0, max: 100 }}
                  margin="normal"
                />
              )}

              {generateCertificateMutation.isError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Failed to generate certificate. Please try again.
                </Alert>
              )}
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleGenerate}
          variant="contained"
          disabled={
            generateCertificateMutation.isLoading ||
            enrollmentLoading ||
            !enrollmentStatus?.isEnrolled ||
            !enrollmentStatus?.isCompleted
          }
        >
          {generateCertificateMutation.isLoading ? (
            <CircularProgress size={24} />
          ) : (
            "Generate Certificate"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CertificateGenerator
