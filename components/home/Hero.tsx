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
        <Typography variant="h2">
          Grow Your{' '}
          <Typography component="span" variant="h2" color={'#FF6854'}>
            Skills
          </Typography>{' '}
          <br />
          With Horace Learning
        </Typography>
        <Typography variant="body2">
          At Horace Learning, we are committed to building the best global
          education network, one that connects students, educators and
          professionals from all over the world.
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

const heroStyles = {
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
  },
  left: {
    maxWidth: '600px',
    '& > *': {
      marginBottom: '20px',
    },
  },
  right: {
    maxWidth: '500px',
  },
};
