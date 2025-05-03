import React from "react"
import { Box, Toolbar, Typography } from "@mui/material"

const Coursebar = ({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) => {
  return (
    <Box className="flex flex-auto w-full text-center rounded-2xl overflow-hidden">
      <Toolbar className="w-full mb-1">
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {`${title}: ${subtitle}` || "NA"}
        </Typography>
      </Toolbar>
    </Box>
  )
}

export default Coursebar
