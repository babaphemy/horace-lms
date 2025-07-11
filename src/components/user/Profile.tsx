"use client"
import { SET_USER } from "@/context/Action"
import { AppDpx } from "@/context/AppContext"
import useUser from "@/hooks/useUser"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import Logout from "@mui/icons-material/Logout"
import MailOutlineIcon from "@mui/icons-material/MailOutline"
import PersonIcon from "@mui/icons-material/Person"
import Settings from "@mui/icons-material/Settings"
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Link,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import * as React from "react"

const Profile = () => {
  const { data: session } = useSession()
  const user = session?.user

  const dispatch = React.useContext(AppDpx)
  const { removeUser } = useUser()
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const router = useRouter()
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const _logout = () => {
    dispatch({ type: SET_USER, data: null })
    removeUser()
    router.push("/logout/")
  }
  const firstNameInitial = user?.firstname ?? "H"
  return (
    <>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ p: 0 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          className="ml-2"
        >
          {user?.image ? (
            <Avatar
              src={user?.image}
              alt={user?.firstname || "Horace User"}
              sx={{ width: 40, height: 40 }}
            />
          ) : (
            <Avatar>H</Avatar>
          )}
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        sx={{
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          getContentAnchorEl: null,
          PaperProps: {
            elevation: 0,
            sx: {
              borderRadius: "10px",
              boxShadow: "0px 10px 35px rgba(50, 110, 189, 0.2)",
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        className="for-dark-top-navList"
      >
        <MenuItem>
          {user?.image ? (
            <Avatar src={user.image} className="mr-1" />
          ) : (
            <Avatar>{firstNameInitial}</Avatar>
          )}

          <Box>
            <Typography sx={{ fontSize: "11px", color: "#757FEF" }}>
              {user?.roles?.[0] ?? "Guest"}
            </Typography>
            <Typography
              sx={{
                fontSize: "13px",
                color: "#260944",
                fontWeight: "500",
              }}
            >
              {user?.firstname
                ? `${user?.firstname || ""} ${user?.lastname || ""}`
                : "Horace User"}
            </Typography>
          </Box>
        </MenuItem>

        <Divider />

        <MenuItem>
          <ListItemIcon sx={{ mr: "-8px", mt: "-3px" }}>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <Link
            href={"/dashboard/profile/"}
            fontSize="13px"
            color="inherit"
            underline="none"
          >
            Profile
          </Link>
        </MenuItem>

        <MenuItem>
          <ListItemIcon sx={{ mr: "-8px", mt: "-3px" }}>
            <MailOutlineIcon fontSize="small" />
          </ListItemIcon>
          <Link
            href="/dashboard/notification/"
            fontSize="13px"
            color="inherit"
            underline="none"
          >
            Inbox
          </Link>
        </MenuItem>

        <MenuItem>
          <ListItemIcon sx={{ mr: "-8px", mt: "-3px" }}>
            <Settings fontSize="small" />
          </ListItemIcon>
          <Link
            href="/dashboard/settings/"
            fontSize="13px"
            color="inherit"
            underline="none"
          >
            Settings
          </Link>
        </MenuItem>

        <MenuItem>
          <ListItemIcon sx={{ mr: "-8px", mt: "-3px" }}>
            <AttachMoneyIcon fontSize="small" />
          </ListItemIcon>
          <Link
            href={`/courses/${user?.id}`}
            fontSize="13px"
            color="inherit"
            underline="none"
          >
            My Courses
          </Link>
        </MenuItem>

        <Divider />

        <MenuItem>
          <ListItemIcon sx={{ mr: "-8px", mt: "-3px" }}>
            <Logout fontSize="small" />
          </ListItemIcon>

          <Button variant="text" color="inherit" onClick={_logout}>
            Logout
          </Button>
        </MenuItem>
      </Menu>
    </>
  )
}

export default Profile
