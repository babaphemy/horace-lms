"use client"

import { getAllSkillCertificatesKey, SkillCertificate } from "@/utils/labs"
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded"
import { Box, Chip, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"

const CertificateVerificationLookup = ({ code }: { code: string }) => {
  const [certificate, setCertificate] = useState<SkillCertificate | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const saved = window.localStorage.getItem(getAllSkillCertificatesKey())
    const certificates = saved ? (JSON.parse(saved) as SkillCertificate[]) : []
    setCertificate(
      certificates.find(
        (item) => item.verificationCode === code.toUpperCase()
      ) || null
    )
    setLoaded(true)
  }, [code])

  if (!loaded) {
    return (
      <Typography color="text.secondary">Checking certificate...</Typography>
    )
  }

  if (!certificate) {
    return (
      <Typography color="text.secondary">
        No local certificate found for this code. Backend-backed verification
        will make this lookup available across devices.
      </Typography>
    )
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="center">
        <QrCode2RoundedIcon color="primary" sx={{ fontSize: 48 }} />
        <Box>
          <Typography variant="h5" fontWeight={900}>
            Valid certificate
          </Typography>
          <Typography color="text.secondary">
            Issued to {certificate.learnerName} on{" "}
            {new Date(certificate.issuedAt).toLocaleDateString()}
          </Typography>
        </Box>
      </Stack>
      <Typography fontWeight={900}>{certificate.trackTitle}</Typography>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {certificate.skills.map((skill) => (
          <Chip key={skill} label={skill} />
        ))}
      </Stack>
    </Stack>
  )
}

export default CertificateVerificationLookup
