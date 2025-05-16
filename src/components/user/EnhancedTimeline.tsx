import { Notifications } from "@mui/icons-material"
import { Box, Button, Card, CardContent, Typography } from "@mui/material"
import ActivityTimeline from "./ActivityTimeline"

const EnhancedTimeline = () => {
  return (
    <Card elevation={2} sx={{ height: "100%", borderRadius: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold" color="primary">
            Activity Timeline
          </Typography>
          <Button size="small" endIcon={<Notifications />}>
            View All
          </Button>
        </Box>
        <ActivityTimeline />
      </CardContent>
    </Card>
  )
}
export default EnhancedTimeline
