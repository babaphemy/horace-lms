import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import { Box, Typography } from "@mui/material"
import Card from "@mui/material/Card"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Image from "next/image"
import React from "react"
import styles from "./ActivityTimeline.module.css"

interface ActivityTimelineProps {
  id: number
  image: string
  title: string
  time: string
}
const ActivityTimelineData: ActivityTimelineProps[] = [
  {
    id: 1,
    image: "/images/ActivityTimeline/1.png",
    title: "User logged in",
    time: "2 hours ago",
  },
]

const ActivityTimeline = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Card
        sx={{
          boxShadow: "none",
          borderRadius: "10px",
          p: "25px",
          mb: "15px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #EEF0F7",
            paddingBottom: "10px",
            mb: "20px",
          }}
          className="for-dark-bottom-border"
        >
          <Typography
            component="h3"
            sx={{
              fontSize: 18,
              fontWeight: 500,
            }}
          >
            Activity Timeline
          </Typography>

          <Box>
            <IconButton
              onClick={handleClick}
              size="small"
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <MoreHorizIcon />
            </IconButton>
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
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
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem>Last 15 Days</MenuItem>
            <MenuItem>Last Month</MenuItem>
            <MenuItem>Last Year</MenuItem>
          </Menu>
        </Box>

        <div className={styles.timelineList}>
          {ActivityTimelineData.slice(0, 6).map((timeline) => (
            <div className={styles.tList} key={timeline.id}>
              <div className={styles.content}>
                <Image src={timeline.image} alt="Icon" width={27} height={27} />
                <h5>{timeline.title}</h5>
              </div>
              <p className={styles.date}>{timeline.time}</p>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}

export default ActivityTimeline
