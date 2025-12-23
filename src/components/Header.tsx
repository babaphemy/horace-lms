"use client"
import React, { useContext } from "react"
import {
  Box,
  Container,
  List,
  Typography,
  Button,
  IconButton,
  Drawer,
  Divider,
  MenuItem,
  alpha,
  Menu,
  MenuProps,
  styled,
  Avatar,
} from "@mui/material"
import Image from "next/image"
import NextLink from "next/link"
import LanguageIcon from "@mui/icons-material/Language"
import MenuIcon from "@mui/icons-material/Menu"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import DashboardIcon from "@mui/icons-material/Dashboard"
import Person2Icon from "@mui/icons-material/Person2"
import BookIcon from "@mui/icons-material/Book"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import { AppDpx } from "@/context/AppContext"
import { USER_RESET } from "@/context/Action"
import TopBg from "./TopBg"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Session } from "next-auth"
import { AccessRoles } from "@/utils/util"

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 14,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}))

const getUserInitials = (user: Session["user"]) => {
  if (user?.firstname && user?.lastname) {
    return `${user.firstname.charAt(0)}${user.lastname.charAt(0)}`.toUpperCase()
  }
  if (user?.name) {
    const nameParts = user.name.split(" ")
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase()
    }
    return user.name.charAt(0).toUpperCase()
  }
  if (user?.email) {
    return user.email.charAt(0).toUpperCase()
  }
  return "U"
}

const getUserDisplayName = (user: Session["user"]) => {
  return user?.firstname || user?.name || user?.email?.split("@")[0] || "User"
}

const Header = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user
  const isAdmin = user?.roles?.includes(AccessRoles.ADMIN)
  const isInstructor = user?.roles?.includes(AccessRoles.INSTRUCTOR)
  const [open, setOpen] = React.useState(false)
  const dispatch = useContext(AppDpx)

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const openMenu = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = (path?: string) => {
    if (path) router.push(path)
    setAnchorEl(null)
  }
  const handleLogout = () => {
    dispatch({ type: USER_RESET, payload: null })
    localStorage.removeItem("horaceUser")
    handleClose("/logout")
  }
  return (
    <>
      <TopBg />
      <Box sx={headerStyles.container}>
        <Container maxWidth="lg">
          <Box sx={headerStyles.drawerContainer}>
            <Link href={"/"}>
              <Image
                src={`/img/logo.webp`}
                alt="logo"
                width={150}
                height={50}
                style={headerStyles.logo}
              />
            </Link>
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
                  src={`/img/logo.webp`}
                  alt="logo"
                  width={150}
                  height={50}
                  style={headerStyles.logo}
                />
                <List sx={headerStyles.mobileList}>
                  <NextLink href="/" passHref>
                    Home
                  </NextLink>
                  <NextLink href="/about" passHref>
                    About
                  </NextLink>

                  <NextLink href="/courses" passHref>
                    Courses
                  </NextLink>
                  <NextLink href="/contact" passHref>
                    Contact
                  </NextLink>
                </List>
              </Box>
              <Box>
                <Box sx={headerStyles.mobileList}>
                  <Typography variant="body1" sx={headerStyles.language}>
                    English
                  </Typography>
                  {!user?.id && (
                    <NextLink href="/login" passHref>
                      Login
                    </NextLink>
                  )}
                </Box>
                {!user?.id && (
                  <NextLink href="/sign-up" passHref>
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
                  </NextLink>
                )}
              </Box>
            </Drawer>
          </Box>
          <Box sx={headerStyles.flexHeader}>
            <Box sx={headerStyles.flexHeader}>
              <Link href={"/"}>
                <Image
                  src={`/img/logo.webp`}
                  alt="logo"
                  width={200}
                  height={80}
                  style={headerStyles.logo}
                />
              </Link>
              <List sx={headerStyles.flexList}>
                <NextLink href="/" passHref>
                  Home
                </NextLink>
                <NextLink href="/about" passHref>
                  About
                </NextLink>

                <NextLink href="/courses" passHref>
                  Courses
                </NextLink>
                <NextLink href="/contact" passHref>
                  Contact
                </NextLink>
              </List>
            </Box>
            <Box sx={headerStyles.auth}>
              <Typography variant="body1" sx={headerStyles.language}>
                <LanguageIcon />
                English
              </Typography>
              {!user?.id ? (
                <>
                  <NextLink href="/login" passHref>
                    Login
                  </NextLink>
                  <NextLink href="/sign-up" passHref>
                    <Button variant="contained" sx={headerStyles.authButton}>
                      Sign Up
                    </Button>
                  </NextLink>
                </>
              ) : (
                <>
                  <Button
                    id="native-button"
                    aria-controls={openMenu ? "native-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={openMenu ? "true" : undefined}
                    variant="contained"
                    disableElevation
                    onClick={handleClick}
                    sx={headerStyles.menuButton}
                  >
                    <Box display="flex" alignItems="center">
                      <Avatar
                        src={user?.image || "/img/coffee.png"}
                        alt={getUserDisplayName(user)}
                        sx={headerStyles.avatar}
                      >
                        {!user?.image && getUserInitials(user)}
                      </Avatar>
                      <Typography
                        variant="body2"
                        sx={headerStyles.menuButtonName}
                      >
                        {getUserDisplayName(user)}
                      </Typography>
                    </Box>
                    <KeyboardArrowDownIcon fontSize="small" />
                  </Button>
                  <StyledMenu
                    id="native-menu"
                    MenuListProps={{
                      "aria-labelledby": "native-button",
                    }}
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={() => handleClose()}
                  >
                    {(isAdmin || isInstructor) && (
                      <MenuItem
                        onClick={() => handleClose("/dashboard")}
                        disableRipple
                      >
                        <DashboardIcon />
                        Dashboard
                      </MenuItem>
                    )}
                    <MenuItem
                      onClick={() => handleClose("/dashboard/profile/")}
                      disableRipple
                    >
                      <Person2Icon />
                      Profile
                    </MenuItem>
                    <Divider sx={{ my: 0.5 }} />
                    <MenuItem
                      onClick={() => handleClose(`/courses/${user?.id}`)}
                      disableRipple
                    >
                      <BookIcon />
                      My Courses
                    </MenuItem>

                    <MenuItem
                      onClick={() => {
                        handleLogout()
                      }}
                      disableRipple
                    >
                      <ExitToAppIcon />
                      Logout
                    </MenuItem>
                  </StyledMenu>
                </>
              )}
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  )
}

export default Header

const headerStyles = {
  container: {
    marginTop: 2,
    marginBottom: 2,
    position: "relative",
  },
  flexHeader: {
    display: { xs: "none", sm: "none", md: "flex" },
    justifyContent: "space-between",
    alignItems: "center",
    px: 0,
  },
  flexList: {
    fontFamily: "Lato,Inter, open Sans",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    px: 0,

    "& > :not(style)": {
      listStyle: "none",
      marginRight: 2,
      textDecoration: "none",
      color: "black",
      fontSize: "1.125rem",

      "&:hover": {
        fontWeight: "bolder",
      },
    },
  },
  logo: {
    marginRight: 5,
    marginTop: "-.3rem",
    marginLeft: "-10px",

    "@media (maxWidth: 600px)": {
      marginLeft: "-50px",
    },
  },
  language: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& > :not(style)": {
      marginRight: 1,
    },
  },
  auth: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontWeight: "bold",

    "& > :not(style)": {
      marginRight: 2,
      listStyle: "none",
      textDecoration: "none",
      color: "black !important",
    },
  },
  authButton: {
    background: "#00A9C1 !important",
    color: "#fff !important",
    px: 3,
    borderRadius: 10,
    textTransform: "capitalize",

    "&:hover": {
      background: "#000",
    },
  },
  drawerContainer: {
    display: { xs: "flex", sm: "flex", md: "none" },
    justifyContent: "space-between",
    alignItems: "center",
    px: 0,
  },

  mobileList: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    px: 3,
    py: 3,

    "& > *": {
      borderRadius: 1,
      justifyContent: "flex-start",
      px: 2,
      py: 1,
      my: 1,
      fontSize: "1.2rem",
      textAlign: "left",
      textTransform: "none",
      width: "100%",
      backgroundColor: "transparent !important",
      color: "black",
      listStyle: "none",
      textDecoration: "none",

      "&:hover": {
        backgroundColor: "#8E1512 !important",
        borderRadius: 10,
        color: "white",
      },
    },
  },

  paper: {
    padding: "20px 0",
    background: "#fff !important",
    color: "#FFFFFF !important",
    width: 280,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex--start",
    justifyContent: "space-between",
  },

  menuButton: {
    border: "1px solid #00A9C1",
    fontSize: "8pt",
    borderRadius: 2,
    padding: "0.3rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent !important",

    "&:hover": {
      cursor: "pointer",
      border: "1px solid black",
      backgroundColor: "transparent",
    },
  },
  menuButtonName: {
    fontWeight: 700,
    fontSize: "8pt",
    px: 1,
    textTransform: "capitalize",
  },
  avatar: {
    width: 28,
    height: 28,
    marginRight: 1,
    fontSize: "10px",
    backgroundColor: "#00A9C1",
    color: "white",
    fontWeight: "bold",
  },
}
