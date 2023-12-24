'use client';
import { Box, Container, Typography } from '@mui/material';

import Image from 'next/image';
import subtract from '../../assets/img/subtract.png';
import woman from '../../assets/img/woman.png';
import SignUpComponent from '../../components/auth/SignUpComponent';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { loginStyles } from '../../styles/loginStyles';
import Head from 'next/head';
import useTag from '../../hooks/useTag';

const SignUp = () => {
  useTag({ pageTitle: 'signup', pagePath: '/sign-up' });

  return (
    <Box>
      <Head>
        <title>New User Signup</title>
        <meta name="description" content="Horace learning, new user signup" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
                  width={'500rem'}
                  height={'750rem'}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                  }}
                />
                <Box sx={loginStyles.glass}>
                  <Typography variant="h5" sx={loginStyles.note}>
                    the best courses you will find here sign up now
                  </Typography>
                  <Image
                    src={woman}
                    alt="woman standing"
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

export default SignUp;
