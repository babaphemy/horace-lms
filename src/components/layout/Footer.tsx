import React from "react"
import { Stack, Box, Typography, Link } from "@mui/material"

const Footer = () => {
  return (
    <>
      <Stack
        sx={{
          backgroundColor: "#fff",
          p: "25px",
          borderRadius: "10px 10px 0 0",
          textAlign: "center",
          mt: "15px",
        }}
        className="footer"
      >
        <Box>
          <Typography>
            Copyright (c) {new Date().getFullYear()}{" "}
            <strong>Horace Learning</strong>. Powered by{" "}
            <Link
              href="https://reachai.online/"
              target="_blank"
              underline="none"
              rel="noreferrer"
            >
              Everlasting Systems
            </Link>
          </Typography>
        </Box>
      </Stack>
    </>
  )
}

export default Footer
