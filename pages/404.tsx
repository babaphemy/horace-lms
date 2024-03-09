import { Box, Button, Container, Typography } from '@mui/material';
import Image from 'next/image';
import errorImg from '../assets/img/404.webp';
import Footer from '../components/Footer';
import Header from '../components/Header';

const Custom404 = () => {
  return (
    <div>
      <Header />
      <Container maxWidth="lg">
        <Box sx={errorStyles.container}>
          <Box>
            <Image
              src={errorImg}
              width={300}
              height={300}
              style={errorStyles.image}
            />
            <Typography variant="h5" component="p">
              Page not found or under construction
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={errorStyles.button}
              href="/"
            >
              Go back to home page
            </Button>
          </Box>
        </Box>
      </Container>
      <Footer />
    </div>
  );
};

export default Custom404;

const errorStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
    textAlign: 'center',
  },
  image: {
    marginBottom: '1rem',
  },
  button: {
    marginTop: '1rem',
  },
};
