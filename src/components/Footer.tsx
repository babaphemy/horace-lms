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
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded"
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
        <Grid container spacing={{ xs: 4, md: 6 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Image
              src="/img/logo.webp"
              alt="Horace LMS Logo"
              width={132}
              height={50}
            />
            <Box sx={footerStyles.section}>
              <Typography variant="body2" sx={footerStyles.mutedText}>
                Horace helps learners build practical skills through guided
                tracks, hands-on labs, mentor feedback, and portfolio-ready
                projects.
              </Typography>
            </Box>
            <Box sx={footerStyles.socials}>
              {socials.map((social: SocialProps) => (
                <IconButton
                  key={social.name}
                  href={social.link}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={social.name}
                  sx={footerStyles.socialButton}
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

          {footerGroups.map((group) => (
            <Grid size={{ xs: 12, sm: 6, md: 2 }} key={group.title}>
              <Typography variant="subtitle1" sx={footerStyles.heading}>
                {group.title}
              </Typography>
              <List sx={footerStyles.noLeftPadding}>
                {group.links.map((item) => (
                  <ListItem key={item.href}>
                    <Link href={item.href} style={footerStyles.link}>
                      {item.label}
                    </Link>
                  </ListItem>
                ))}
              </List>
            </Grid>
          ))}

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle1" sx={footerStyles.heading}>
              Stay In The Loop
            </Typography>
            <Box sx={footerStyles.newsletter}>
              <Typography variant="body2" sx={footerStyles.mutedText}>
                Get practical lab updates, new track announcements, and mentor
                session openings.
              </Typography>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                size="small"
                sx={footerStyles.emailField}
              />
              <Button
                variant="contained"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={footerStyles.newsButton}
              >
                Subscribe
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={footerStyles.divider} />
        <Typography variant="body2" sx={footerStyles.center}>
          Powered by Horace. All rights reserved © {new Date().getFullYear()}.
        </Typography>
      </Container>
    </Box>
  )
}

export default Footer

const footerStyles = {
  container: {
    marginTop: 0,
    backgroundColor: "#061f2a",
    color: "#ffffff",
    padding: { xs: "3rem 0", md: "4rem 0 2.5rem" },
  },
  socialLogo: {
    aspectRatio: 1,
    width: 22,
  },
  socials: {
    display: "flex",
    gap: 1,
    mt: 2.5,
  },
  socialButton: {
    bgcolor: "rgba(255,255,255,0.08)",
    borderRadius: 1,
    "&:hover": {
      bgcolor: "rgba(255,255,255,0.16)",
    },
  },
  noLeftPadding: {
    pt: 0.5,
    "& > :not(style)": {
      paddingLeft: 0,
      py: 0.5,
      cursor: "pointer",
    },
  },
  heading: {
    color: "#ffffff",
    fontWeight: 800,
    mb: 1,
  },
  link: {
    color: "rgba(255,255,255,0.72)",
    textDecoration: "none",
    fontSize: "0.925rem",
  },
  mutedText: {
    color: "rgba(255,255,255,0.72)",
    lineHeight: 1.7,
  },
  center: { textAlign: "center", py: 2, color: "rgba(255,255,255,0.64)" },
  divider: {
    borderColor: "rgba(255,255,255,0.16)",
    marginTop: "3rem",
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
  emailField: {
    "& .MuiInputBase-root": {
      bgcolor: "#ffffff",
      borderRadius: 1,
    },
  },
  newsButton: {
    bgcolor: "#00A9C1",
    color: "#fff",
    px: 3,
    py: 1,
    borderRadius: 1,
    textTransform: "none",
    fontWeight: 800,
    "&:hover": {
      bgcolor: "#078fa3",
    },
  },
}

const footerGroups = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "Skill Tracks", href: "/courses" },
      { label: "Preview Labs", href: "/courses#preview-labs" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
  {
    title: "Proof",
    links: [
      { label: "Portfolio", href: "/portfolio" },
      { label: "Project Reviews", href: "/mentor/submissions" },
      { label: "Skill Certificates", href: "/certificate/skills" },
      { label: "Team Upskilling", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Send Feedback", href: "/contact" },
      { label: "Terms Of Use", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
]

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
