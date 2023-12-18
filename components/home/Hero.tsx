import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';
import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { Appcontext } from '../../context/AppContext';

const Hero = () => {
  const router = useRouter();
  const { user } = useContext(Appcontext);
  return (
    <Box sx={heroStyles.container}>
      <Box sx={heroStyles.left}>
        <Typography variant="h1" mb={'20px'}>
          Grow Your{' '}
          <Typography component="span" variant="h2" color={'#FF6854'}>
            Skills
          </Typography>{' '}
          <br />
          Unlock Your Potential
        </Typography>
        <Typography variant="h5" mb={'20px'}>
          Transform Your Career with Horace: Gain Job-Ready Skills through Our
          Immersive Courses and Hands-On Labs.
        </Typography>
        <Button
          variant="contained"
          sx={heroStyles.button}
          onClick={() =>
            !user ? router.push('/login') : router.push('/courses')
          }
        >
          Get Started
        </Button>
      </Box>
      <Box sx={heroStyles.right}>
        <Image src={'/img/boy.png'} alt="hero" width={400} height={400} />
      </Box>
    </Box>
  );
};

export default Hero;

export const heroStyles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    my: '50px',
  },
  button: {
    backgroundColor: '#FF6854 !important',
    color: '#fff',
    px: 3,
    borderRadius: 10,
    textTransform: 'capitalize',
    mb: '20px',
  },
  left: {
    maxWidth: '600px',
  },
  right: {
    display: { xs: 'none', sm: 'block' },
    maxWidth: '500px',
  },
};
