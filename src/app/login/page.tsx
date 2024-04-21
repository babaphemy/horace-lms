"use client";
import { Box, Container, Typography } from "@mui/material";
import Image from "next/image";
import subtract from "@/assets/img/subtract.webp";
import man from "@/assets/img/man.webp";
import useTag from "@/hooks/useTag";
import Header from "@/components/Header";
import { loginStyles } from "@/styles/loginStyles";
import LoginComponent from "@/components/auth/LoginComponent";
import Footer from "@/components/Footer";
// export const metadata = generateMetadata({
//   title: "Horace Learning Management Solution | Horace Courses",
//   description:
//     "Horace Online Courses. STEM focused online courses for all ages. Members login",
// });
const Login = () => {
  useTag({ pageTitle: "login", pagePath: "/login" });
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
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: "450rem",
                    height: "550rem",
                  }}
                />
                <Box sx={loginStyles.glass}>
                  <Typography variant="h5" sx={loginStyles.note}>
                    the best courses you will find here login to get started
                  </Typography>
                  <Image
                    src={man}
                    alt="man holding a laptop"
                    style={{
                      width: "420rem",
                      height: "400rem",
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
