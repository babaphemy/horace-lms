import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import boy from '../../assets/img/boy.png';
import { useRouter } from 'next/router';

const Hero = () => {
  const router = useRouter();
  return (
    <Box sx={heroStyles.container}>
      <Box sx={heroStyles.left}>
        <Typography variant="h2" mb={'20px'}>
          Grow Your{' '}
          <Typography component="span" variant="h2" color={'#FF6854'}>
            Skills
          </Typography>{' '}
          <br />
          Unlock Your Potential
        </Typography>
        <Typography variant="body2" mb={'20px'}>
          Transform Your Career with Horace: Gain Job-Ready Skills through Our
          Immersive Courses and Hands-On Labs.
        </Typography>
        <Button
          variant="contained"
          sx={heroStyles.button}
          onClick={() => router.push('/login')}
        >
          Get Started
        </Button>
      </Box>
      <Box sx={heroStyles.right}>
        <Image src={boy} alt="hero" width={400} height={400} />
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
