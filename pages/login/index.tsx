import { Box, Container, Typography } from '@mui/material';
import Image from 'next/image';
import man from '../../assets/img/man.webp';
import subtract from '../../assets/img/subtract.webp';
import LoginComponent from '../../components/auth/LoginComponent';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { loginStyles } from '../../styles/loginStyles';
import Head from 'next/head';
import React from 'react';
import useTag from '../../hooks/useTag';

const Login = () => {
  useTag({ pageTitle: 'login', pagePath: '/login' });
  return (
    <Box component={'div'} id="login-component">
      <Head>
        <title>Horace User Login</title>
        <meta name="description" content="Horace learning, members login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
                  width={'450rem'}
                  height={'550rem'}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                  }}
                />
                <Box sx={loginStyles.glass}>
                  <Typography variant="h5" sx={loginStyles.note}>
                    the best courses you will find here login to get started
                  </Typography>
                  <Image
                    src={man}
                    alt="man holding a laptop"
                    width={'420rem'}
                    height={'400rem'}
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
