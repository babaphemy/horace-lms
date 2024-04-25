import React from "react"
import Image from "next/image"
import { Box } from "@mui/material"

const bgStyles = {
  blue: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: -1,
    width: "100%",
  },
  red: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1,
    width: "100%",
  },
}
const TopBg = () => {
  return (
    <Box>
      <Box sx={bgStyles.blue}>
        <Image
          src={"/img/blue.webp"}
          alt="blue"
          width={1920}
          height={0}
          style={{ height: 1080 }}
          loading="lazy"
        />
      </Box>
      <Box sx={bgStyles.red}>
        <Image
          src={"/img/red.webp"}
          alt="red"
          width={1920}
          height={0}
          style={{ height: 1080 }}
          loading="lazy"
        />
      </Box>
    </Box>
  )
}

export default TopBg
