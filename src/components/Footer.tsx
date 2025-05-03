import React from "react"
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
} from "@mui/material"
import Image from "next/image"
import Link from "next/link"

type SocialProps = {
  name: string
  link: string
  icon: string
}

const Footer = () => {
  return (
    <Box component="footer" sx={footerStyles.container}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Image
              src="/img/logo.webp"
              alt="Horace LMS Logo"
              width={150}
              height={50}
            />
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
            <Box mt={2}>
              {socials.map((social: SocialProps) => (
                <IconButton
                  key={social.name}
                  href={social.link}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={social.name}
                >
                  <Image
                    src={`/img/${social.icon}`}
                    alt={`${social.name} icon`}
                    width={30}
                    height={30}
                    style={footerStyles.socialLogo}
                  />
                </IconButton>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Navigation
            </Typography>
            <List sx={footerStyles.noLeftPadding}>
              {[
                { label: "Home", href: "/" },
                { label: "About", href: "/about" },
                { label: "Courses", href: "/courses" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <ListItem key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Support
            </Typography>
            <List sx={footerStyles.noLeftPadding}>
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
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              Newsletter
            </Typography>
            <Box sx={footerStyles.newsletter}>
              <Typography variant="body2">
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
        <Typography variant="body2" sx={footerStyles.center}>
          Powered by Horace | All Rights Reserved © {new Date().getFullYear()}
        </Typography>
      </Container>
    </Box>
  )
}

export default Footer

const footerStyles = {
  container: {
    marginTop: 16,
    backgroundColor: "#f5f5f5",
    padding: "3rem 0",
  },
  socialLogo: {
    aspectRatio: 1,
    width: 30,
  },
  rounded: {
    borderRadius: 10,
    "& .MuiOutlinedInput-root": {
      borderRadius: 10,
    },
  },
  noLeftPadding: {
    "& > :not(style)": { paddingLeft: 0, cursor: "pointer" },
  },
  center: { textAlign: "center", py: 2 },
  divider: {
    background: "#1A055F",
    height: "3px",
    marginTop: "2rem",
    marginBottom: "1.5rem",
  },
  section: {
    "& > :not(style)": {
      marginTop: "0.5rem",
    },
  },
  newsletter: {
    "& > :not(style)": {
      marginTop: "0.75rem",
    },
  },
  newsButton: {
    background: "#00A9C1 !important",
    color: "#fff",
    px: 3,
    textTransform: "capitalize",
    "&:hover": {
      background: "#000",
    },
  },
}

const socials: SocialProps[] = [
  {
    name: "Facebook",
    link: "https://www.facebook.com/horacelms",
    icon: "facebook.webp",
  },
  {
    name: "Twitter",
    link: "https://www.twitter.com/essloffice",
    icon: "twitter.webp",
  },
  {
    name: "Instagram",
    link: "https://www.instagram.com/",
    icon: "instagram.webp",
  },
  {
    name: "LinkedIn",
    link: "https://www.linkedin.com/company/10654256/",
    icon: "linkedin.webp",
  },
]
