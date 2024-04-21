import React from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  IconButton,
  List,
  ListItem,
  TextField,
  Button,
  Divider,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

type SocialProps = {
  name: string;
  link: string;
  icon: string | any;
};

const Footer = () => {
  return (
    <Box sx={footerStyles.container}>
      <Container maxWidth="lg">
        <Grid
          container
          columnSpacing={{
            xs: 8,
            md: 3,
          }}
        >
          <Grid item sm={12} md={3}>
            <Box sx={{ float: 'left' }}>
              <Image
                src={'/img/logo.webp'}
                alt="logo"
                width={150}
                height={50}
              />
            </Box>

            <Box sx={footerStyles.section}>
              <Typography variant="body2" align="justify">
                At Horace Online Learning, we are passionate about empowering
                individuals to achieve their full potential through education.
              </Typography>
              <Typography variant="body2" align="justify">
                We are dedicated to making high-quality learning accessible to
                all, regardless of their background or location.
              </Typography>
            </Box>
            <Box>
              {socials.map((social: SocialProps) => {
                return (
                  <IconButton
                    key={social.name}
                    href={social.link}
                    target="_blank"
                    rel="noreferer noopener"
                  >
                    <Image
                      src={`/img/${social.icon}`}
                      alt={social.name}
                      width={30}
                      height={30}
                      style={footerStyles.socialLogo}
                    />
                  </IconButton>
                );
              })}
            </Box>
          </Grid>
          <Grid item sm={6} md={3}>
            <Typography variant="h6">Quick Links</Typography>
            <Box>
              <List sx={footerStyles.noLeftPadding}>
                <ListItem>
                  <Link href="/">Home</Link>
                </ListItem>
                <ListItem>
                  <Link href="/about">About</Link>
                </ListItem>
                <ListItem>
                  <Link href="/courses">Courses</Link>
                </ListItem>
                <ListItem>
                  <Link href="/contact">Contact</Link>
                </ListItem>
              </List>
            </Box>
          </Grid>
          <Grid item sm={6} md={3}>
            <Typography variant="h6">Quick Links</Typography>
            <Box>
              <List sx={footerStyles.noLeftPadding}>
                {/* <ListItem>
                  <Link href="/help-center">Help Center</Link>
                </ListItem> */}
                {/* <ListItem>
                  <Link href="/ask-question">Ask Questions</Link>
                </ListItem> */}
                <ListItem>
                  <Link href="/contact">Send Feedback</Link>
                </ListItem>
                <ListItem>
                  <Link href="/terms">Terms of Use</Link>
                </ListItem>
                <ListItem>
                  <Link href="/privacy">Privacy Policy</Link>
                </ListItem>
              </List>
            </Box>
          </Grid>
          <Grid item sm={12} md={3}>
            <Typography variant="h6">Newsletter</Typography>
            <Box sx={footerStyles.newsletter}>
              <Typography variant="body1">
                Subscribe for latest updates
              </Typography>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                sx={footerStyles.rounded}
              />
              <Button
                variant="contained"
                sx={[footerStyles.rounded, footerStyles.newsButton]}
              >
                Subscribe
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={footerStyles.divider} />
        <Typography variant="body1" sx={footerStyles.center}>
          Powered By Horace | All Rights Reserved! &copy;{' '}
          {new Date().getFullYear()}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;

const footerStyles = {
  container: {
    marginTop: 16,
  },
  socialLogo: {
    aspectRatio: 1,
    width: 40,
  },
  rounded: {
    borderRadius: 10,

    '& .MuiOutlinedInput-root': {
      borderRadius: 10,
    },
  },
  noLeftPadding: {
    '& > :not(style)': { paddingLeft: 0, cursor: 'pointer' },
  },
  center: { textAlign: 'center', py: 2 },
  divider: {
    background: '#1A055F',
    height: '3px',
    my: 4,
  },
  section: {
    '& > :not(style)': {
      my: 1,
    },
  },
  newsletter: {
    '& > :not(style)': {
      my: 1,
    },
  },
  newsButton: {
    background: '#00A9C1 !important',
    color: '#fff',
    px: 3,
    textTransform: 'capitalize',

    '&:hover': {
      background: '#000',
    },
  },
};

const socials = [
  {
    name: 'facebook',
    link: 'https://www.facebook.com/horacelms',
    icon: 'facebook.webp',
  },
  {
    name: 'twitter',
    link: 'https://www.twitter.com/essloffice',
    icon: 'twitter.webp',
  },
  {
    name: 'instagram',
    link: 'https://www.instagram.com/',
    icon: 'instagram.webp',
  },
  {
    name: 'linkedin',
    link: 'https://www.linkedin.com/company/10654256/',
    icon: 'linkedin.webp',
  },
];
