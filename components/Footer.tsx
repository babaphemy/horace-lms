import React from 'react';
import { Container, Box, Typography, Grid } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={footerStyles.container}>
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          <Grid item sm={12} md={3}>
            <Typography variant="h6" gutterBottom>
              Company Name
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;

const footerStyles = {
  container: {
    marginTop: 5
  }
};
