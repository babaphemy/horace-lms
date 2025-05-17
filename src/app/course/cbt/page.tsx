"use client"
import React, { useState } from "react"
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Paper,
  IconButton,
  Avatar,
  styled,
  Grid,
} from "@mui/material"
import { ArrowBack, ArrowForward, Code } from "@mui/icons-material"

const GradientBackground = styled(Box)(({ theme }) => ({
  background: "linear-gradient(to bottom, #f8bbd0, #bbdefb, #b2ebf2)",
  minHeight: "100vh",
  padding: theme.spacing(6, 2),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}))

const ExerciseCard = styled(Paper)(({ theme }) => ({
  maxWidth: 700,
  width: "100%",
  marginTop: theme.spacing(4),
  borderRadius: 24,
  overflow: "hidden",
  padding: theme.spacing(4, 3),
  boxShadow: theme.shadows[3],
  position: "relative",
}))

const QuestionHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(3),
}))

const CodeAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  width: theme.spacing(5),
  height: theme.spacing(5),
  margin: "0 auto",
  marginBottom: theme.spacing(2),
}))

const QuestionBox = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  textAlign: "center",
}))

const RadioOptionLabel = styled(FormControlLabel)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  width: "100%",
  "& .MuiFormControlLabel-label": {
    width: "100%",
  },
}))

const OptionBox = styled(Box)(({ theme, selected }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${selected ? theme.palette.primary.main : theme.palette.grey[300]}`,
  backgroundColor: selected
    ? theme.palette.primary.lighter
    : theme.palette.grey[50],
  width: "100%",
  "&:hover": {
    backgroundColor: selected
      ? theme.palette.primary.lighter
      : theme.palette.grey[100],
  },
}))

const NavigationCircle = styled(Avatar)(({ theme, active }) => ({
  width: 24,
  height: 24,
  fontSize: "0.75rem",
  backgroundColor: active
    ? theme.palette.primary.main
    : theme.palette.grey[300],
  cursor: "pointer",
  "&:hover": {
    backgroundColor: active
      ? theme.palette.primary.dark
      : theme.palette.grey[400],
  },
}))

const FooterText = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  marginTop: theme.spacing(4),
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
}))

const Exercise = () => {
  const [selectedOption, setSelectedOption] = useState("")
  const [currentQuestion, setCurrentQuestion] = useState(8)

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value)
  }

  // Navigation functions
  const goToPrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const goToNext = () => {
    if (currentQuestion < 30) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const goToQuestion = (questionNumber) => {
    setCurrentQuestion(questionNumber)
  }

  // Create array of question numbers 1-30
  const questionNumbers = Array.from({ length: 30 }, (_, i) => i + 1)

  return (
    <GradientBackground>
      <ExerciseCard>
        <QuestionHeader>
          <Box sx={{ display: "flex", alignItems: "center" }}>
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
          <Box>
            <IconButton size="small" onClick={goToPrevious}>
              <ArrowBack fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={goToNext}>
              <ArrowForward fontSize="small" />
            </IconButton>
          </Box>
        </QuestionHeader>

        <QuestionBox>
          <CodeAvatar>
            <Code />
          </CodeAvatar>
          <Typography variant="subtitle1" fontWeight="medium">
            How to initialize an array in Kotlin with values?
          </Typography>
        </QuestionBox>

        <RadioGroup value={selectedOption} onChange={handleOptionChange}>
          {["A", "B", "C", "D"].map((option, index) => (
            <RadioOptionLabel
              key={index}
              value={option}
              control={<Radio />}
              label={
                <OptionBox selected={selectedOption === option}>
                  <Typography variant="body2">
                    Lorem ipsum dolor sit amet, consectetur
                  </Typography>
                </OptionBox>
              }
            />
          ))}
        </RadioGroup>

        {/* Question navigation circles */}
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={1} justifyContent="center">
            {questionNumbers.slice(0, 15).map((num) => (
              <Grid key={num}>
                <NavigationCircle
                  active={num === currentQuestion}
                  onClick={() => goToQuestion(num)}
                >
                  {num}
                </NavigationCircle>
              </Grid>
            ))}
          </Grid>
          <Grid container spacing={1} justifyContent="center" sx={{ mt: 1 }}>
            {questionNumbers.slice(15, 30).map((num) => (
              <Grid key={num}>
                <NavigationCircle
                  active={num === currentQuestion}
                  onClick={() => goToQuestion(num)}
                >
                  {num}
                </NavigationCircle>
              </Grid>
            ))}
          </Grid>
        </Box>
      </ExerciseCard>

      <FooterText>Created By Horace | All Rights Reserved © 2023</FooterText>
    </GradientBackground>
  )
}

export default Exercise
