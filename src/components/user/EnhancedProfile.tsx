import { Edit } from "@mui/icons-material"
import { Box, Button, Card, CardContent, Typography } from "@mui/material"
import Profile from "./Profile"

const EnhancedProfile = () => {
  return (
    <Card elevation={2} sx={{ height: "100%", borderRadius: 2 }}>
      <CardContent sx={{ p: 0 }}>
        <Box
          sx={{
            p: 3,
            backgroundImage: "linear-gradient(to right, #3f51b5, #2196f3)",
            color: "white",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            position: "relative",
            height: 100,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Student Profile
          </Typography>
          <Typography variant="body2">
            Update your personal information
          </Typography>

          <Button
            variant="contained"
            color="secondary"
            size="small"
            startIcon={<Edit />}
            sx={{
              position: "absolute",
              right: 16,
              bottom: -20,
              boxShadow: 2,
            }}
          >
            Edit
          </Button>
        </Box>

        <Box sx={{ mt: 4, px: 2 }}>
          <Profile />
        </Box>
      </CardContent>
    </Card>
  )
}
export default EnhancedProfile
