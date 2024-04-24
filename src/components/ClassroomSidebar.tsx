import React from "react"
import { Box, Typography } from "@mui/material"
import { detailStyles } from "../styles/courseStyles"
import Curriculum from "./courses/Curriculum"

const ClassroomSidebar = () => {
  return (
    <Box sx={detailStyles.sidebar}>
      <Box margin={4}>
        <Typography>Content</Typography>
      </Box>
      <Curriculum />
    </Box>
  )
}

export default ClassroomSidebar
