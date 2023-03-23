import { Box, Container, Typography } from '@mui/material';
import React from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

const confirmed = () => {
  return (
    <Container>
      <Header />
      <Container>
        <Box my={'25vh'}>
          <Typography variant="h1">
            Thank you for confirming your email!
          </Typography>
        </Box>
      </Container>
      <Footer />
    </Container>
  );
};

export default confirmed;
