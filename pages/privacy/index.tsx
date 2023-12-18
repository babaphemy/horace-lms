import { Box, Container, List, ListItem, Typography } from '@mui/material';
import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const index = () => {
  return (
    <Box>
      <Header />
      <Container>
        <Typography variant="h3" gutterBottom>
          Privacy Policy
        </Typography>

        <Typography variant="subtitle1" mb={4}>
          Horace Learning ("us", "we", or "our") operates the
          https://www.horacelearning.com website and mobile application
          (hereinafter referred to as the "Service").
        </Typography>

        <Typography variant="h4" gutterBottom>
          Information Collection and Use
        </Typography>

        <Typography variant="body1">
          We collect several types of information for various purposes:
        </Typography>

        <List dense sx={{ mb: 4 }}>
          <ListItem>
            <strong>Personal Data</strong> - Name, email, address etc. when
            using our Service
          </ListItem>
          <ListItem>
            <strong>Usage Data</strong> - Data about how you use our website
            collected via cookies
          </ListItem>
        </List>

        <Typography variant="h4" gutterBottom>
          Use of Data
        </Typography>

        <Typography variant="body1" mb={4}>
          Our usage of collected data includes improving customer service,
          analyzing site traffic, marketing, personalized help and instructions,
          customer support, and detecting security threats.
        </Typography>

        <Typography variant="h4" gutterBottom>
          Retention of Data
        </Typography>

        <Typography variant="body1" mb={4}>
          We will retain your Personal Data only for as long as is necessary for
          the purposes outlined in this Privacy Policy.
        </Typography>

        <Typography variant="body1" mb={8}>
          If you have questions about our Privacy Policy, please contact us at
          info@horacelearning.com
        </Typography>
      </Container>
      <Footer />
    </Box>
  );
};

export default index;
