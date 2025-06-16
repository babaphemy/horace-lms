"use client"
import NavBar from "@/components/settings/NavBar"
import Profile from "@/components/user/Profile"
import { Typography } from "@mui/material"
import Card from "@mui/material/Card"

export default function Account() {
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
        <Typography
          component="h3"
          sx={{
            fontSize: 18,
            fontWeight: 500,
            borderBottom: "1px solid #EEF0F7",
            paddingBottom: "5px",
            mb: "15px",
          }}
          className="for-dark-bottom-border"
        >
          Settings
        </Typography>

        <NavBar />

        <Profile />
      </Card>
    </>
  )
}
