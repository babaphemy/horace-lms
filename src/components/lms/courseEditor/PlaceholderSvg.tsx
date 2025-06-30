import { Box } from "@mui/material"
import { Image as ImageIcon } from "@mui/icons-material"

const PlaceholderSVG = () => (
  <Box
    sx={{
      width: 60,
      height: 40,
      borderRadius: 1,
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <ImageIcon
      sx={{
        fontSize: 24,
        color: "white",
        opacity: 0.8,
      }}
    />
    <Box
      sx={{
        position: "absolute",
        bottom: 2,
        left: 2,
        right: 2,
        height: 2,
        backgroundColor: "rgba(255,255,255,0.3)",
        borderRadius: 1,
      }}
    />
  </Box>
)
export default PlaceholderSVG
