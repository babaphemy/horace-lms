import man from "@/assets/img/man.webp"
import subtract from "@/assets/img/subtract.webp"
import LoginComponent from "@/components/auth/LoginComponent"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { loginStyles } from "@/styles/loginStyles"
import { Box, Container, Typography } from "@mui/material"
import Image from "next/image"
import { generateMetadata } from "../metadata"
export const metadata = generateMetadata({
  title: "Horace Learning Management Solution | Horace Courses",
  description:
    "Horace Online Courses. STEM focused online courses for all ages. Members login",
})
const Login = () => {
  return (
    <Box component={"div"} id="login-component">
      <Header />
      <Box sx={loginStyles.body}>
        <Container maxWidth="lg">
          <Box sx={loginStyles.center}>
            <Box sx={loginStyles.box}>
              <LoginComponent />
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
  )
}

export default Login
