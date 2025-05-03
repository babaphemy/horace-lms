"use client"
import { Box, Container, Typography } from "@mui/material"

import Image from "next/image"
import useTag from "@/hooks/useTag"
import Header from "@/components/Header"
import woman from "@/assets/img/woman.webp"
import subtract from "@/assets/img/subtract.webp"
import { loginStyles } from "@/styles/loginStyles"
import SignUpComponent from "@/components/auth/SignUpComponent"
import Footer from "@/components/Footer"
const SignupForm = () => {
  useTag({ pageTitle: "signup", pagePath: "/sign-up" })
  return (
    <Box>
      <Header />
      <Box sx={loginStyles.body}>
        <Container maxWidth="lg">
          <Box sx={loginStyles.center}>
            <Box sx={loginStyles.box}>
              <SignUpComponent />
              <Box sx={loginStyles.subtract}>
                <Image
                  src={subtract}
                  alt="logo"
                  width={0}
                  height={0}
                  sizes="100%"
                  style={{ width: "27rem", height: "45rem" }}
                />
                <Box sx={loginStyles.glass}>
                  <Typography variant="h5" sx={loginStyles.note}>
                    Smart Learning. Limitless Growth.
                  </Typography>
                  <Image
                    src={woman}
                    alt="woman standing"
                    width={420}
                    height={400}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  )
}
export default SignupForm
