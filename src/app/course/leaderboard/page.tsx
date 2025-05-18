import React from "react"
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
} from "@mui/material"
import type { TableCellProps } from "@mui/material"

interface MedalAvatarProps {
  place: number
}

// Styled components
const GradientBackground = styled(Box)(({ theme }) => ({
  background: "linear-gradient(to bottom, #f8bbd0, #bbdefb, #b2ebf2)",
  minHeight: "100vh",
  padding: theme.spacing(6, 2),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}))

const LeaderboardCard = styled(Paper)(({ theme }) => ({
  maxWidth: 800,
  width: "100%",
  marginTop: theme.spacing(4),
  borderRadius: 24,
  overflow: "hidden",
  padding: theme.spacing(4),
  boxShadow: theme.shadows[3],
  position: "relative",
}))

const TopThreeContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  marginBottom: theme.spacing(4),
  marginTop: theme.spacing(2),
}))

const PlaceHolder = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  margin: theme.spacing(0, 2),
  width: 120,
}))

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 60,
  height: 60,
  border: `3px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[2],
}))

const MedalAvatar = styled(Avatar)<MedalAvatarProps>(({ theme, place }) => {
  const colors: Record<number, { bg: string; text: string }> = {
    1: { bg: "#FFD700", text: "#5D4037" }, // Gold
    2: { bg: "#C0C0C0", text: "#5D4037" }, // Silver
    3: { bg: "#CD7F32", text: "#fff" }, // Bronze
  }

  return {
    backgroundColor: colors[place]?.bg || theme.palette.primary.main,
    color: colors[place]?.text || theme.palette.primary.contrastText,
    width: 24,
    height: 24,
    fontSize: "0.75rem",
    marginBottom: theme.spacing(1),
  }
})

const ScoreTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1.5),
  textAlign: "center",
}))

interface RankCellProps extends TableCellProps {
  rank: number
}

const RankCell = styled(TableCell, {
  shouldForwardProp: (prop) => prop !== "rank",
})<RankCellProps>(({ theme, rank }) => {
  const getColor = (rank: number) => {
    if (rank === 1) return "#FFD700" // Gold
    if (rank === 2) return "#C0C0C0" // Silver
    if (rank === 3) return "#CD7F32" // Bronze
    return theme.palette.grey[500] // Other ranks
  }

  return {
    padding: theme.spacing(1.5),
    textAlign: "center",
    "& .rankAvatar": {
      backgroundColor: getColor(rank),
      color: rank <= 3 ? "#5D4037" : "#fff",
      width: 28,
      height: 28,
      margin: "0 auto",
    },
  }
})

const UserCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1),
  display: "flex",
  alignItems: "center",
  "& .MuiAvatar-root": {
    marginRight: theme.spacing(2),
    width: 36,
    height: 36,
    borderRadius: "12px",
  },
}))

const CompletionCount = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  "& .MuiAvatar-root": {
    width: 20,
    height: 20,
    marginRight: theme.spacing(0.5),
    backgroundColor: "#FFD700",
    fontSize: "0.7rem",
  },
}))

const FooterText = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  marginTop: theme.spacing(4),
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
}))

const Leaderboard = () => {
  // Sample data
  const leaderboardData = [
    {
      id: 1,
      name: "Sarah Mortel",
      points: 200,
      completedCourses: 12,
      avatar: "/api/placeholder/60/60",
    },
    {
      id: 2,
      name: "Abraham Tim",
      points: 150,
      completedCourses: 9,
      avatar: "/api/placeholder/60/60",
    },
    {
      id: 3,
      name: "Lukemon Gabriel",
      points: 90,
      completedCourses: 5,
      avatar: "/api/placeholder/60/60",
    },
    {
      id: 4,
      name: "Arber Bryan",
      points: 80,
      completedCourses: 4,
      avatar: "/api/placeholder/60/60",
    },
    {
      id: 5,
      name: "Lewis Mbappe",
      points: 55,
      completedCourses: 3,
      avatar: "/api/placeholder/60/60",
    },
    {
      id: 6,
      name: "Daniel Morris",
      points: 40,
      completedCourses: 2,
      avatar: "/api/placeholder/60/60",
    },
    {
      id: 7,
      name: "Terence Okorie",
      points: 22,
      completedCourses: 1,
      avatar: "/api/placeholder/60/60",
    },
  ]

  const topThree = leaderboardData.slice(0, 3)
  const restOfUsers = leaderboardData.slice(0) // Copy all for the table

  return (
    <GradientBackground>
      <LeaderboardCard>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" fontWeight="bold">
              Leaderboard
            </Typography>
            <Avatar
              sx={{
                width: 24,
                height: 24,
                ml: 1,
                bgcolor: "gold",
                color: "#5D4037",
                fontSize: "0.75rem",
              }}
            >
              🏆
            </Avatar>
          </Box>

          <CompletionCount>
            <Avatar sx={{ bgcolor: "#FFD700", color: "#5D4037" }}>🏆</Avatar>
            <Typography variant="body2" fontWeight="medium">
              12 Courses Completed
            </Typography>
          </CompletionCount>
        </Box>

        {/* Top 3 Users */}
        <TopThreeContainer>
          {/* Second Place */}
          <PlaceHolder>
            <MedalAvatar place={2}>2</MedalAvatar>
            <StyledAvatar
              src={topThree[1]?.avatar}
              alt={topThree[1]?.name}
              sx={{ width: 70, height: 70 }}
            />
            <Typography
              variant="body2"
              fontWeight="medium"
              align="center"
              sx={{ mt: 1 }}
            >
              {topThree[1]?.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
              <MedalAvatar place={2} sx={{ width: 16, height: 16, mr: 0.5 }}>
                🏆
              </MedalAvatar>
              <Typography variant="caption">
                {topThree[1]?.points} points
              </Typography>
            </Box>
          </PlaceHolder>

          {/* First Place */}
          <PlaceHolder>
            <MedalAvatar place={1}>1</MedalAvatar>
            <StyledAvatar
              src={topThree[0]?.avatar}
              alt={topThree[0]?.name}
              sx={{ width: 90, height: 90 }}
            />
            <Typography
              variant="body2"
              fontWeight="medium"
              align="center"
              sx={{ mt: 1 }}
            >
              {topThree[0]?.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
              <MedalAvatar place={1} sx={{ width: 16, height: 16, mr: 0.5 }}>
                🏆
              </MedalAvatar>
              <Typography variant="caption">
                {topThree[0]?.points} points
              </Typography>
            </Box>
          </PlaceHolder>

          {/* Third Place */}
          <PlaceHolder>
            <MedalAvatar place={3}>3</MedalAvatar>
            <StyledAvatar
              src={topThree[2]?.avatar}
              alt={topThree[2]?.name}
              sx={{ width: 70, height: 70 }}
            />
            <Typography
              variant="body2"
              fontWeight="medium"
              align="center"
              sx={{ mt: 1 }}
            >
              {topThree[2]?.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
              <MedalAvatar place={3} sx={{ width: 16, height: 16, mr: 0.5 }}>
                🏆
              </MedalAvatar>
              <Typography variant="caption">
                {topThree[2]?.points} points
              </Typography>
            </Box>
          </PlaceHolder>
        </TopThreeContainer>

        {/* Leaderboard Table */}
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ bgcolor: "transparent" }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell width="10%" align="center">
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="medium"
                  >
                    #
                  </Typography>
                </TableCell>
                <TableCell width="50%">
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="medium"
                  >
                    Users
                  </Typography>
                </TableCell>
                <TableCell width="20%" align="center">
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="medium"
                  >
                    Scores
                  </Typography>
                </TableCell>
                <TableCell width="20%" align="center">
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="medium"
                  >
                    Courses Completed
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {restOfUsers.map((user, index) => (
                <TableRow
                  key={user.id}
                  sx={{
                    bgcolor: index % 2 ? "rgba(0,0,0,0.02)" : "transparent",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  <RankCell rank={index + 1}>
                    <Avatar className="rankAvatar">{index + 1}</Avatar>
                  </RankCell>
                  <UserCell>
                    <Avatar
                      src={user.avatar}
                      alt={user.name}
                      variant="rounded"
                    />
                    <Typography variant="body2">{user.name}</Typography>
                  </UserCell>
                  <ScoreTableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {user.points} points
                    </Typography>
                  </ScoreTableCell>
                  <ScoreTableCell>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          bgcolor: "#FFD700",
                          color: "#5D4037",
                          fontSize: "0.75rem",
                          mr: 1,
                        }}
                      >
                        🏆
                      </Avatar>
                      <Typography variant="body2">
                        {user.completedCourses}
                      </Typography>
                    </Box>
                  </ScoreTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </LeaderboardCard>

      <FooterText>Created By Horace | All Rights Reserved © 2023</FooterText>
    </GradientBackground>
  )
}

export default Leaderboard
