"use client"
import { Box, Container, Typography } from "@mui/material"
import Image from "next/image"
import subtract from "@/assets/img/subtract.webp"
import man from "@/assets/img/man.webp"
import useTag from "@/hooks/useTag"
import Header from "@/components/Header"
import { loginStyles } from "@/styles/loginStyles"
import ForgotPasswordComponent from "@/components/auth/ForgotPasswordComponent"
import Footer from "@/components/Footer"
import { Suspense } from "react"

const Login = () => {
  useTag({ pageTitle: "login", pagePath: "/login" })
  return (
    <Suspense>
      <Box component={"div"} id="login-component">
        <Header />
        <Box sx={loginStyles.body}>
          <Container maxWidth="lg">
            <Box sx={loginStyles.center}>
              <Box sx={loginStyles.box}>
                <ForgotPasswordComponent />
                <Box sx={loginStyles.subtract}>
                  <Image
                    src={subtract}
                    alt="logo"
                    width={0}
                    height={0}
                    sizes="100%"
                    style={{ width: "27rem", height: "35rem" }}
                  />
                  <Box sx={loginStyles.glass}>
                    <Typography variant="h5" sx={loginStyles.note}>
                      Smart Learning. Limitless Growth.
                    </Typography>
                    <Image
                      src={man}
                      alt="man holding a laptop"
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
    </Suspense>
  )
}

export default Login
