import { Stat } from "@/types/types"
import { Box, Card, CardContent, Grid, Typography } from "@mui/material"
import { Book, Users, CheckCircle, DollarSign } from "lucide-react"

const StatsGrid = ({ stats }: { stats: Stat | null }) => {
  const statsConfig = [
    {
      key: "totalCourses" as keyof Stat,
      title: "Total Courses",
      icon: <Book size={24} />,
      color: "#3B82F6",
      format: (value: number) => value.toLocaleString(),
    },
    {
      key: "activeStudents" as keyof Stat,
      title: "Active Students",
      icon: <Users size={24} />,
      color: "#10B981",
      format: (value: number) => value.toLocaleString(),
    },
    {
      key: "completedLessons" as keyof Stat,
      title: "Completed Lessons",
      icon: <CheckCircle size={24} />,
      color: "#8B5CF6",
      format: (value: number) => value.toLocaleString(),
    },
    {
      key: "revenue" as keyof Stat,
      title: "Revenue",
      icon: <DollarSign size={24} />,
      color: "#F59E0B",
      format: (value: number) => `$${value.toLocaleString()}`,
    },
  ]

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {statsConfig.map((config) => (
        <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={config.key}>
          <Card
            sx={{
              height: "100%",
              background: `linear-gradient(135deg, ${config.color} 0%, ${config.color}88 100%)`,
              border: "none",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    component="div"
                    fontWeight="bold"
                    color="white"
                  >
                    {stats ? config.format(stats[config.key]) : "--"}
                  </Typography>
                  <Typography
                    color="rgba(255,255,255,0.9)"
                    variant="body2"
                    sx={{ mb: 1 }}
                  >
                    {config.title}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "white",
                  }}
                >
                  {config.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default StatsGrid
