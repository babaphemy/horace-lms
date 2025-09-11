"use client"

import React, { useMemo, useState } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  Grid,
  IconButton,
  FormControlLabel,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Radio,
} from "@mui/material"
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { quizSchema, TQuiz } from "@/schema/quizSchema"
import { addQuiz, fetchCourse } from "@/app/api/rest"
import { LessonDto } from "@/types/types"

const CreateQuiz: React.FC<{ id: string }> = ({ id }) => {
  const [activeStep, setActiveStep] = useState(0)
  const queryClient = useQueryClient()

  const { data: courseData } = useQuery({
    queryKey: ["course", id],
    queryFn: () => fetchCourse(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  })

  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TQuiz>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      lessonId: "",
      content: {
        title: "",
        description: "",
        timeLimit: 30,
        passingScore: 70,
        questions: [
          {
            id: 1,
            type: "multiple_choice",
            question: "",
            points: 1,
            options: [
              { id: "a", text: "" },
              { id: "b", text: "" },
              { id: "c", text: "" },
              { id: "d", text: "" },
            ],
            correctAnswer: "",
            explanation: "",
          },
        ],
      },
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "content.questions",
  })

  const createQuizMutation = useMutation({
    mutationFn: addQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] })
    },
  })

  const steps = ["Quiz Details", "Questions", "Review"]

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const onSubmit = (data: TQuiz) => {
    createQuizMutation.mutate(data)
  }

  const addQuestion = () => {
    const newQuestionId = fields.length + 1
    append({
      id: newQuestionId,
      type: "multiple_choice",
      question: "",
      points: 1,
      options: [
        { id: "a", text: "" },
        { id: "b", text: "" },
        { id: "c", text: "" },
        { id: "d", text: "" },
      ],
      correctAnswer: "",
      explanation: "",
    })
  }

  const addOption = (questionIndex: number) => {
    const options = watch(`content.questions.${questionIndex}.options`)
    const newOptionId = String.fromCharCode(97 + options.length)
    setValue(`content.questions.${questionIndex}.options`, [
      ...options,
      { id: newOptionId, text: "" },
    ])
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const options = watch(`content.questions.${questionIndex}.options`)
    if (options.length > 2) {
      setValue(
        `content.questions.${questionIndex}.options`,
        options.filter((_, index) => index !== optionIndex)
      )
    }
  }

  const lessons: LessonDto[] = useMemo(() => {
    if (courseData) {
      return (
        courseData?.curriculum?.topic?.flatMap(
          (c: { lessons: LessonDto[] }) => c?.lessons
        ) || []
      )
    } else return []
  }, [courseData])

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Quiz
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {createQuizMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to create quiz. Please try again.
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {activeStep === 0 && (
            <Box>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth error={!!errors.lessonId}>
                    <InputLabel id="lesson-select-label">
                      Select Lesson
                    </InputLabel>
                    <Controller
                      name="lessonId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          labelId="lesson-select-label"
                          label="Select Lesson"
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 300,
                              },
                            },
                          }}
                        >
                          {!lessons ? (
                            <MenuItem value={0} disabled>
                              Loading lessons...
                            </MenuItem>
                          ) : lessons.length === 0 ? (
                            <MenuItem value={0} disabled>
                              No lessons available
                            </MenuItem>
                          ) : (
                            lessons.map((lesson) => (
                              <MenuItem key={lesson.id} value={lesson.id}>
                                {lesson.title || `Lesson ${lesson.id}`}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                      )}
                    />
                    {errors.lessonId && (
                      <FormHelperText>{errors.lessonId.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Quiz Title"
                    {...register("content.title")}
                    error={!!errors.content?.title}
                    helperText={errors.content?.title?.message}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    {...register("content.description")}
                    error={!!errors.content?.description}
                    helperText={errors.content?.description?.message}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Time Limit (minutes)"
                    {...register("content.timeLimit", { valueAsNumber: true })}
                    error={!!errors.content?.timeLimit}
                    helperText={errors.content?.timeLimit?.message}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Passing Score (%)"
                    {...register("content.passingScore", {
                      valueAsNumber: true,
                    })}
                    error={!!errors.content?.passingScore}
                    helperText={errors.content?.passingScore?.message}
                    inputProps={{ min: 0, max: 100 }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              {fields.map((question, questionIndex) => (
                <Paper key={question.id} sx={{ p: 3, mb: 3 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography variant="h6">
                      Question {questionIndex + 1}
                    </Typography>
                    {fields.length > 1 && (
                      <IconButton
                        color="error"
                        onClick={() => remove(questionIndex)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Question"
                        {...register(
                          `content.questions.${questionIndex}.question`
                        )}
                        error={
                          !!errors.content?.questions?.[questionIndex]?.question
                        }
                        helperText={
                          errors.content?.questions?.[questionIndex]?.question
                            ?.message
                        }
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth>
                        <InputLabel>Question Type</InputLabel>
                        <Controller
                          name={`content.questions.${questionIndex}.type`}
                          control={control}
                          render={({ field }) => (
                            <Select {...field} label="Question Type">
                              <MenuItem value="multiple_choice">
                                Multiple Choice
                              </MenuItem>
                              <MenuItem value="true_false">True/False</MenuItem>
                              <MenuItem value="short_answer">
                                Short Answer
                              </MenuItem>
                            </Select>
                          )}
                        />
                      </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Points"
                        {...register(
                          `content.questions.${questionIndex}.points`,
                          { valueAsNumber: true }
                        )}
                        error={
                          !!errors.content?.questions?.[questionIndex]?.points
                        }
                        helperText={
                          errors.content?.questions?.[questionIndex]?.points
                            ?.message
                        }
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Options
                      </Typography>

                      {watch(`content.questions.${questionIndex}.options`).map(
                        (option, optionIndex) => (
                          <Box
                            key={option.id}
                            sx={{
                              mb: 2,
                              p: 2,
                              border: "1px solid #eee",
                              borderRadius: 1,
                            }}
                          >
                            <Grid container spacing={2} alignItems="center">
                              <Grid size={{ xs: 1 }}>
                                <FormControlLabel
                                  control={
                                    <Radio
                                      checked={
                                        watch(
                                          `content.questions.${questionIndex}.correctAnswer`
                                        ) === option.id
                                      }
                                      onChange={() =>
                                        setValue(
                                          `content.questions.${questionIndex}.correctAnswer`,
                                          option.id
                                        )
                                      }
                                    />
                                  }
                                  label=""
                                />
                              </Grid>
                              <Grid size={{ xs: 9 }}>
                                <TextField
                                  fullWidth
                                  label={`Option ${option.id.toUpperCase()}`}
                                  {...register(
                                    `content.questions.${questionIndex}.options.${optionIndex}.text`
                                  )}
                                />
                              </Grid>
                              <Grid size={{ xs: 2 }}>
                                <IconButton
                                  color="error"
                                  onClick={() =>
                                    removeOption(questionIndex, optionIndex)
                                  }
                                  disabled={
                                    watch(
                                      `content.questions.${questionIndex}.options`
                                    ).length <= 2
                                  }
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Grid>
                            </Grid>
                          </Box>
                        )
                      )}
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => addOption(questionIndex)}
                        sx={{ mt: 1 }}
                      >
                        Add Option
                      </Button>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Explanation"
                        {...register(
                          `content.questions.${questionIndex}.explanation`
                        )}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              ))}

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addQuestion}
                sx={{ mt: 2 }}
              >
                Add Question
              </Button>
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Review Your Quiz
              </Typography>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Quiz Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Title
                    </Typography>
                    <Typography variant="body1">
                      {watch("content.title")}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Lesson
                    </Typography>
                    <Typography variant="body1">
                      {lessons.find(
                        (l) => l.id?.toString() === String(watch("lessonId"))
                      )?.title || "Not selected"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Time Limit
                    </Typography>
                    <Typography variant="body1">
                      {watch("content.timeLimit")} minutes
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Passing Score
                    </Typography>
                    <Typography variant="body1">
                      {watch("content.passingScore")}%
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" color="text.secondary">
                      Description
                    </Typography>
                    <Typography variant="body1">
                      {watch("content.description")}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Questions ({fields.length})
                </Typography>
                {fields.map((question, index) => (
                  <Box
                    key={question.id}
                    sx={{ mb: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}
                  >
                    <Typography variant="subtitle1">
                      Q{index + 1}:{" "}
                      {watch(`content.questions.${index}.question`)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Points: {watch(`content.questions.${index}.points`)} |
                      Type: {watch(`content.questions.${index}.type`)}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>

            {activeStep < steps.length - 1 ? (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                disabled={createQuizMutation.isLoading}
              >
                {createQuizMutation.isLoading ? "Creating..." : "Create Quiz"}
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  )
}

export default CreateQuiz
