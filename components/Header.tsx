import React from 'react';
import {
  Box,
  Container,
  List,
  Link as MuiLink,
  Typography,
  Button,
  IconButton,
  Drawer,
} from '@mui/material';
import Image from 'next/image';
import NextLink from 'next/link';
import logo from '../assets/img/logo.png';
import LanguageIcon from '@mui/icons-material/Language';
import TopBg from './TopBg';
import MenuIcon from '@mui/icons-material/Menu';

const Header = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <TopBg />
      <Box sx={headerStyles.container}>
        <Container maxWidth="lg">
          <Box sx={headerStyles.drawerContainer}>
            <Image
              src={logo}
              alt="logo"
              width={150}
              height={50}
              style={headerStyles.logo}
            />
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setOpen(true)}
            >
              <MenuIcon fontSize="large" />
            </IconButton>
            <Drawer
              anchor="right"
              open={open}
              onClose={() => setOpen(false)}
              PaperProps={{
                sx: headerStyles.paper,
              }}
              variant="temporary"
            >
              <Box>
                <Image
                  src={logo}
                  alt="logo"
                  width={150}
                  height={50}
                  style={headerStyles.logo}
                />
                <List sx={headerStyles.mobileList}>
                  <NextLink href="/" passHref>
                    <MuiLink>Home</MuiLink>
                  </NextLink>
                  <NextLink href="/" passHref>
                    <MuiLink>About</MuiLink>
                  </NextLink>
                  <NextLink href="/" passHref>
                    <MuiLink>Courses</MuiLink>
                  </NextLink>
                  <NextLink href="/" passHref>
                    <MuiLink>Contact</MuiLink>
                  </NextLink>
                </List>
              </Box>
              <Box>
                <Box sx={headerStyles.mobileList}>
                  <Typography variant="body1" sx={headerStyles.language}>
                    English
                  </Typography>
                  <NextLink href="/login" passHref>
                    <MuiLink>Login</MuiLink>
                  </NextLink>
                </Box>
                <NextLink href="/sign-up" passHref>
                  <MuiLink>
                    <Button
                      variant="contained"
                      sx={[
                        headerStyles.authButton,
                        {
                          m: 4,
                        },
                      ]}
                    >
                      Sign Up
                    </Button>
                  </MuiLink>
                </NextLink>
              </Box>
            </Drawer>
          </Box>
          <Box sx={headerStyles.flexHeader}>
            <Box sx={headerStyles.flexHeader}>
              <Image
                src={logo}
                alt="logo"
                width={150}
                height={50}
                style={headerStyles.logo}
              />
              <List sx={headerStyles.flexList}>
                <NextLink href="/" passHref>
                  <MuiLink>Home</MuiLink>
                </NextLink>
                <NextLink href="/" passHref>
                  <MuiLink>About</MuiLink>
                </NextLink>
                <NextLink href="/" passHref>
                  <MuiLink>Courses</MuiLink>
                </NextLink>
                <NextLink href="/" passHref>
                  <MuiLink>Contact</MuiLink>
                </NextLink>
              </List>
            </Box>
            <Box sx={headerStyles.auth}>
              <Typography variant="body1" sx={headerStyles.language}>
                <LanguageIcon />
                English
              </Typography>
              <NextLink href="/login" passHref>
                <MuiLink>Login</MuiLink>
              </NextLink>
              <NextLink href="/sign-up" passHref>
                <MuiLink>
                  <Button variant="contained" sx={headerStyles.authButton}>
                    Sign Up
                  </Button>
                </MuiLink>
              </NextLink>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Header;
const headerStyles = {
  container: {
    marginTop: 1.5,
    marginBottom: 2,
    position: 'relative',
  },
  flexHeader: {
    display: { xs: 'none', sm: 'none', md: 'flex' },
    justifyContent: 'space-between',
    alignItems: 'center',
    px: 0,
  },
  flexList: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    px: 0,

    '& > :not(style)': {
      listStyle: 'none',
      marginRight: 2,
      textDecoration: 'none',
      color: 'black',

      '&:hover': {
        fontWeight: 'bolder',
      },
    },
  },
  logo: {
    marginRight: 5,
    marginTop: '-3px',
    marginLeft: '-10px',
  },
  language: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& > :not(style)': {
      marginRight: 1,
    },
  },
  auth: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontWeight: 'bold',

    '& > :not(style)': {
      marginRight: 2,
      listStyle: 'none',
      textDecoration: 'none',
      color: 'black !important',
    },
  },
  authButton: {
    background: '#00A9C1 !important',
    color: '#fff !important',
    px: 3,
    borderRadius: 10,
    textTransform: 'capitalize',

    '&:hover': {
      background: '#000',
    },
  },
  drawerContainer: {
    display: { xs: 'flex', sm: 'flex', md: 'none' },
    justifyContent: 'space-between',
    alignItems: 'center',
    px: 0,
  },

  mobileList: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    px: 3,
    py: 3,

    '& > *': {
      borderRadius: 1,
      justifyContent: 'flex-start',
      px: 2,
      py: 1,
      my: 1,
      fontSize: '1.2rem',
      textAlign: 'left',
      textTransform: 'none',
      width: '100%',
      backgroundColor: 'transparent !important',
      color: 'black',
      listStyle: 'none',
      textDecoration: 'none',

      '&:hover': {
        backgroundColor: '#8E1512 !important',
        borderRadius: 10,
        color: 'white',
      },
    },
  },

  paper: {
    padding: '20px 0',
    background: '#fff !important',
    color: '#FFFFFF !important',
    width: 280,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex--start',
    justifyContent: 'space-between',
  },
};
