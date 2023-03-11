import { Box, Container, Typography } from '@mui/material';
import React from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

const ContactUs = () => {
  return (
    <Box>
      <Header />
      <Container>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 'bold', my: 1 }}>
            Contact Us
          </Typography>
          <Typography variant="body1">
            Our Friendly Customer Service Team would to hear from you.
          </Typography>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default ContactUs;
