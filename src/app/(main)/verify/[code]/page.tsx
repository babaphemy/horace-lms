import CertificateVerificationLookup from "@/components/certificate/skills/CertificateVerificationLookup"
import { Box, Container, Divider, Typography } from "@mui/material"

interface VerifyPageProps {
  params: Promise<{ code: string }>
}

const VerifyPage = async ({ params }: VerifyPageProps) => {
  const { code } = await params

  return <VerificationClient code={code} />
}

export default VerifyPage

function VerificationClient({ code }: { code: string }) {
  return (
    <Box sx={{ bgcolor: "#f6fafb", minHeight: "100vh", py: { xs: 5, md: 8 } }}>
      <Container maxWidth="md">
        <Box
          sx={{
            bgcolor: "white",
            border: "1px solid #dce7eb",
            borderRadius: 2,
            p: { xs: 3, md: 5 },
          }}
        >
          <Typography
            component="p"
            sx={{
              color: "#00A9C1",
              fontWeight: 800,
              textTransform: "uppercase",
            }}
          >
            Certificate verification
          </Typography>
          <Typography
            variant="h3"
            component="h1"
            fontWeight={900}
            sx={{ mt: 1 }}
          >
            Verification code
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {code}
          </Typography>
          <Divider sx={{ my: 3 }} />
          <CertificateVerificationLookup code={code} />
        </Box>
      </Container>
    </Box>
  )
}
