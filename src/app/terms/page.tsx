import { Box, Container, Typography } from "@mui/material"
import Link from "next/link"
import { generateMetadata } from "../metadata"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
export const metadata = generateMetadata({
  title: "Horace Learning Management Solution | Terms and Conditions",
  description:
    "Horace Online Courses. STEM focused online courses for all ages",
})
const Page = () => {
  return (
    <Box>
      <Header />
      <Container>
        <Typography variant="h1" align="center" gutterBottom>
          Terms and Conditions
        </Typography>
        <Typography variant="h4" gutterBottom>
          1. Our Services
        </Typography>
        <Typography variant="body1" mb={4}>
          Horace Learning provides online software services consisting of a
          learning management system (LMS), student information system (SIS) and
          website hosting to schools and other educational institutions as a
          software-as-a-service platform. This may include access to online
          courses, portals for assessments, enrollments, schedules and records,
          communication tools, and other modules (collectively Services).
        </Typography>
        <Typography variant="h4" gutterBottom>
          2. Acceptable Use
        </Typography>
        <Typography variant="body1" mb={4}>
          You must use the Services for authorized educational purposes only,
          follow applicable laws, our LMS Content Guidelines and SIS Use
          Policies. Accounts require school-issued IDs and those under 18
          require parental consent. Unauthorized commercial use or solicitation
          is prohibited.
        </Typography>
        <Typography variant="h4" gutterBottom>
          3. User Content
        </Typography>
        <Typography variant="body1" mb={4}>
          User-contributed content to the LMS or SIS remains your intellectual
          property but may be archived or used internally for continued account
          access if you withdraw it or close your account.
        </Typography>
        <Typography variant="h4" gutterBottom>
          4. Copyright
        </Typography>
        <Typography variant="body1" mb={4}>
          The Services including their architecture and contents are Horace
          Learning intellectual property. Unauthorized use including
          reproduction or public display may infringe copyright law. Exceptions
          for fair use apply under statutory rights.
        </Typography>
        <Typography variant="h4" gutterBottom>
          5. Disclaimers
        </Typography>
        <Typography variant="body1" mb={4}>
          All information is provided AS IS. Horace Learning disclaims implied
          warranties of fitness or completeness. Statutory consumer rights
          remain unaffected.
        </Typography>
        <Typography variant="h4" gutterBottom>
          6. Limitation of Liability
        </Typography>
        <Typography variant="body1" mb={4}>
          Horace Learning shall not be liable for any incidental, consequential
          or indirect damages arising from use of Services. Total liability is
          limited to the fees incurred in the prior contract year under any
          Commercial Customer Agreements. This does not exclude statutory
          damages.
        </Typography>
        <Typography variant="h4" gutterBottom>
          7. Changes to Terms
        </Typography>
        <Typography variant="body1" mb={4}>
          Horace Learning may modify the Terms occasionally and continued
          subsequent use will indicate acceptance of updated terms. We will
          notify you of material changes by posting on our website or messaging
          through the Services. Active changes will not affect any then-current
          usage.
        </Typography>
        <Typography variant="body1" mb={8}>
          Please
          <Link href={"/contact"}>
            <b>contact us</b>
          </Link>
          for any concerns regarding the above. We are committed to providing a
          secure, ethical and legally compliant learning platform.
        </Typography>
      </Container>
      <Footer />
    </Box>
  )
}

export default Page
