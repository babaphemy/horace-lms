import { Box, Container, Typography } from '@mui/material';
import Image from 'next/image';
import man from '../../assets/img/man.png';
import subtract from '../../assets/img/subtract.png';
import LoginComponent from '../../components/auth/Login';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { loginStyles } from '../../styles/loginStyles';

const Login = () => {
  return (
    <Box>
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
