import React from "react"
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Divider,
  styled,
  useTheme,
} from "@mui/material"
import {
  CheckCircleOutline,
  CancelOutlined,
  EmojiEvents,
} from "@mui/icons-material"

// Styled components
const GradientBackground = styled(Box)(({ theme }) => ({
  background: "linear-gradient(to bottom, #f8bbd0, #bbdefb, #b2ebf2)",
  minHeight: "100vh",
  padding: theme.spacing(6, 2),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}))

const ResultsCard = styled(Paper)(({ theme }) => ({
  maxWidth: 700,
  width: "100%",
  marginTop: theme.spacing(4),
  borderRadius: 24,
  overflow: "hidden",
  padding: theme.spacing(4, 3),
  boxShadow: theme.shadows[3],
  position: "relative",
}))

const ResultsBox = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(4),
  textAlign: "center",
}))

const ResultsGrid = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  marginTop: theme.spacing(2),
}))

const ResultColumn = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(0, 4),
}))

interface NavigationCircleProps {
  correct?: boolean
  incorrect?: boolean
  active?: boolean
}

const NavigationCircle = styled(Avatar, {
  shouldForwardProp: (prop) =>
    prop !== "correct" && prop !== "incorrect" && prop !== "active",
})<NavigationCircleProps>(({ theme, correct, incorrect, active }) => ({
  width: 32,
  height: 32,
  fontSize: "0.75rem",
  backgroundColor: correct
    ? theme.palette.success.light
    : incorrect
      ? theme.palette.error.light
      : active
        ? theme.palette.primary.main
        : theme.palette.grey[300],
  margin: theme.spacing(0.5),
  border: active ? `2px solid ${theme.palette.primary.main}` : "none",
  color: correct || incorrect ? theme.palette.common.white : undefined,
}))

const LeaderboardButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  borderRadius: 20,
  padding: theme.spacing(1, 4),
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}))

const FooterText = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  marginTop: theme.spacing(4),
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
}))

const ExerciseResults = () => {
  const theme = useTheme()

  // Mock data for the results
  const correctAnswers = 21
  const incorrectAnswers = 9

  // Define which questions were answered correctly/incorrectly
  const questionResults = [
    { num: 1, status: "correct" },
    { num: 2, status: "correct" },
    { num: 3, status: "correct" },
    { num: 4, status: "correct" },
    { num: 5, status: "incorrect" },
    { num: 6, status: "correct" },
    { num: 7, status: "correct" },
    { num: 8, status: "active" }, // Currently viewed question
    { num: 9, status: "inactive" },
    { num: 10, status: "inactive" },
    { num: 11, status: "correct" },
    { num: 12, status: "inactive" },
    { num: 13, status: "correct" },
    { num: 14, status: "correct" },
    { num: 15, status: "correct" },
    { num: 16, status: "correct" },
    { num: 17, status: "inactive" },
    { num: 18, status: "inactive" },
    { num: 19, status: "correct" },
    { num: 20, status: "correct" },
    { num: 21, status: "correct" },
    { num: 22, status: "correct" },
    { num: 23, status: "incorrect" },
    { num: 24, status: "inactive" },
    { num: 25, status: "inactive" },
    { num: 26, status: "inactive" },
    { num: 27, status: "inactive" },
    { num: 28, status: "correct" },
    { num: 29, status: "correct" },
    { num: 30, status: "correct" },
  ]

  return (
    <GradientBackground>
      <ResultsCard>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            Exercise
          </Typography>
          <Avatar
            sx={{
              width: 24,
              height: 24,
              ml: 1,
              bgcolor: "pink",
              fontSize: "0.75rem",
            }}
          >
            🧠
          </Avatar>
        </Box>

        <ResultsBox>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                width: 40,
                height: 40,
              }}
            >
              <EmojiEvents />
            </Avatar>
          </Box>

          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            Exercise successfully submitted!
          </Typography>

          <Divider sx={{ my: 2 }} />

          <ResultsGrid>
            <ResultColumn>
              <Avatar
                sx={{
                  bgcolor: theme.palette.success.main,
                  width: 46,
                  height: 46,
                  mb: 1,
                }}
              >
                <CheckCircleOutline />
              </Avatar>
              <Typography variant="h5" fontWeight="bold">
                {correctAnswers}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Questions correct
              </Typography>
            </ResultColumn>

            <Divider orientation="vertical" flexItem sx={{ mx: 3 }} />

            <ResultColumn>
              <Avatar
                sx={{
                  bgcolor: theme.palette.error.main,
                  width: 46,
                  height: 46,
                  mb: 1,
                }}
              >
                <CancelOutlined />
              </Avatar>
              <Typography variant="h5" fontWeight="bold">
                {incorrectAnswers}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Questions wrong
              </Typography>
            </ResultColumn>
          </ResultsGrid>
        </ResultsBox>

        {/* Question navigation circles */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            mb: 3,
          }}
        >
          {questionResults.slice(0, 15).map((question) => (
            <NavigationCircle
              key={question.num}
              correct={question.status === "correct"}
              incorrect={question.status === "incorrect"}
              active={question.status === "active"}
            >
              {question.num}
            </NavigationCircle>
          ))}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            mb: 4,
          }}
        >
          {questionResults.slice(15, 30).map((question) => (
            <NavigationCircle
              key={question.num}
              correct={question.status === "correct"}
              incorrect={question.status === "incorrect"}
              active={question.status === "active"}
            >
              {question.num}
            </NavigationCircle>
          ))}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <LeaderboardButton variant="contained">
            View Leaderboard
          </LeaderboardButton>
        </Box>
      </ResultsCard>

      <FooterText>Created By Horace | All Rights Reserved © 2023</FooterText>
    </GradientBackground>
  )
}

export default ExerciseResults
