import { Box, Chip, Typography } from "@mui/material"
type Data = {
  courseName?: string
  target?: string
  category?: string
}
const LessonHead = ({ data }: { data: Data }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      <Box>
        <Typography
          variant="h5"
          component="h1"
          fontWeight="bold"
          sx={{ display: "flex", alignItems: "center" }}
        >
          {data?.courseName || "Classroom"}
          <span role="img" aria-label="cool emoji" style={{ marginLeft: 8 }}>
            😎
          </span>
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {data?.target}
        </Typography>
      </Box>
      <Chip
        color="primary"
        size="small"
        sx={{
          borderRadius: 28,
          px: 3,
        }}
        label={data?.category || "General"}
      />
    </Box>
  )
}
export default LessonHead
