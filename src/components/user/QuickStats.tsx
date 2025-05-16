import {
  Box,
  Card,
  CardContent,
  LinearProgress,
  Typography,
} from "@mui/material"

const QuickStats = () => {
  return (
    <Card elevation={2} sx={{ height: "100%", borderRadius: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
          Academic Overview
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Attendance
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Box sx={{ flexGrow: 1, mr: 1 }}>
              <LinearProgress
                variant="determinate"
                value={95}
                sx={{ height: 8, borderRadius: 5 }}
              />
            </Box>
            <Typography variant="body2" fontWeight="bold">
              NA
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Current Grade
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Box sx={{ flexGrow: 1, mr: 1 }}>
              <LinearProgress
                variant="determinate"
                value={87}
                color="secondary"
                sx={{ height: 8, borderRadius: 5 }}
              />
            </Box>
            <Typography variant="body2" fontWeight="bold">
              NA
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Assignments Completed
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ flexGrow: 1, mr: 1 }}>
              <LinearProgress
                variant="determinate"
                value={78}
                color="success"
                sx={{ height: 8, borderRadius: 5 }}
              />
            </Box>
            <Typography variant="body2" fontWeight="bold">
              NA
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
export default QuickStats
