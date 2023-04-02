import React from 'react';
import { tQuiz } from '../../types/types';
import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Box,
} from '@mui/material';

type Props = {
  quizzes: tQuiz[];
  playId: any;
  handleNext: (id: number | undefined) => void;
  handlePrev: () => void;
};

const quizStyles = {
  frameContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: {
      xs: '100%',
      sm: '100%',
      md: '70%',
    },
  },
  paper: {
    padding: 4,
    width: '100%',
    maxWidth: 600,
    marginBottom: 4,
  },
  title: {
    marginBottom: 2,
  },
  button: {
    marginTop: 2,
    backgroundColor: '#FF6854 !important',
    color: '#fff',
    px: 3,
    borderRadius: 10,
    textTransform: 'capitalize',

    // disabled
    '&.Mui-disabled': {
      backgroundColor: '#c2c2c2 !important',
    },
  },
  flexButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};

const QuizComponent = ({ quizzes, handleNext, playId, handlePrev }: Props) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showScore, setShowScore] = useState(false);
  const [studentAnswers, setStudentAnswers] = useState<any[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [missedAnswers, setMissedAnswers] = useState<number[]>([]);

  const handleOptionChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    const currentAnswers = [...studentAnswers];
    currentAnswers[currentQuiz] = event.target.value;
    setStudentAnswers(currentAnswers);
    setSelectedAnswer(event.target.value);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(studentAnswers[currentQuiz + 1] || '');
    if (currentQuiz < quizzes.length - 1) {
      setCurrentQuiz(currentQuiz + 1);
    }
    if (selectedAnswer === quizzes[currentQuestion].answer) {
      setCorrectAnswers(correctAnswers + 1);
    } else {
      missedAnswers.push(currentQuiz);
    }

    if (currentQuestion + 1 < quizzes.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowScore(true);
      handleSubmit();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuiz > 0) {
      setCurrentQuiz(currentQuiz - 1);
    }
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }

    if (
      studentAnswers[currentQuiz - 1] === quizzes[currentQuestion - 1].answer
    ) {
      setCorrectAnswers(correctAnswers - 1);
    } else {
      missedAnswers.pop();
    }

    setSelectedAnswer(studentAnswers[currentQuiz - 1]);
  };

  const handleResetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setShowScore(false);
    setStudentAnswers([]);
    setCurrentQuiz(0);
    setCorrectAnswers(0);
    setMissedAnswers([]);
  };

  const handleSubmit = () => {
    quizzes.forEach((quiz, index) => {
      if (studentAnswers[index] === quiz.answer) {
        console.log('correct');
      } else {
      }
    });
  };

  return (
    <Box sx={quizStyles.frameContainer}>
      <Container maxWidth="md">
        {showScore ? (
          <Paper sx={quizStyles.paper}>
            <Typography variant="h5" gutterBottom>
              You got {correctAnswers} out of {quizzes.length} answers correct.
            </Typography>
            <Box>
              {missedAnswers.length > 0 ? (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h5" gutterBottom>
                    You missed the following questions:
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    {missedAnswers.map((index) => {
                      const quiz = quizzes[index];
                      return (
                        <Box key={quiz.id} sx={{ mb: 1 }}>
                          <Typography variant="body1" gutterBottom>
                            - {quiz.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#FF6854 !important',
                            }}
                            gutterBottom
                          >
                            Correct answer: {quiz.answer}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              ) : (
                <Typography variant="h5" gutterBottom>
                  You got all the answers correct!
                </Typography>
              )}
            </Box>
            <Box sx={quizStyles.flexButtons}>
              <Button
                sx={quizStyles.button}
                variant="contained"
                color="primary"
                onClick={handleResetQuiz}
              >
                Try Again
              </Button>
              {/* {correctAnswers < quizzes.length / 2 ? (
                <Button
                  sx={quizStyles.button}
                  variant="contained"
                  color="primary"
                  onClick={() => handlePrev()}
                >
                  Previous Lesson
                </Button>
              ) : (
                <Button
                  sx={quizStyles.button}
                  variant="contained"
                  color="primary"
                  onClick={() => handleNext(playId?.id)}
                >
                  Next Lesson
                </Button>
              )} */}
              <Button
                sx={quizStyles.button}
                variant="contained"
                color="primary"
                onClick={() => handleNext(playId?.id)}
              >
                Next Lesson
              </Button>
            </Box>
          </Paper>
        ) : (
          <Paper sx={quizStyles.paper}>
            <Typography variant="h5" sx={quizStyles.title} gutterBottom>
              {quizzes[currentQuestion].title}
            </Typography>
            <RadioGroup
              aria-label="quiz"
              name="quiz"
              value={selectedAnswer}
              onChange={handleOptionChange}
            >
              {quizzes[currentQuestion].options.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>

            <Box sx={quizStyles.flexButtons}>
              {currentQuiz > 0 && (
                <Button
                  sx={quizStyles.button}
                  variant="contained"
                  color="primary"
                  onClick={handlePrevQuestion}
                >
                  Previous
                </Button>
              )}
              <Button
                sx={quizStyles.button}
                variant="contained"
                color="primary"
                disabled={!selectedAnswer}
                onClick={handleNextQuestion}
              >
                {currentQuestion + 1 === quizzes.length ? 'Submit' : 'Next'}
              </Button>
            </Box>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default QuizComponent;
