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
  Card,
  CardMedia,
  IconButton,
  FormControlLabel,
  Checkbox,
  Alert,
  Select,
  MenuItem,
} from "@mui/material"
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { quizSchema, TQuiz } from "@/schema/quizSchema"
import { useSession } from "next-auth/react"
import { fetchCourse } from "@/app/api/rest"
import { LessonDto } from "@/types/types"

const CreateQuiz: React.FC<{ id: string }> = ({ id }) => {
  const [activeStep, setActiveStep] = useState(0)
  const { data: session } = useSession()
  const [imagePreview, setImagePreview] = useState<string>("")
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
      quizName: "",
      courseId: id,
      lessonId: "",
      coverTitle: "",
      description: "",
      coverImage: "",
      questions: [
        {
          question: "",
          questionImage: "",
          duration: "30",
          points: "1",
          feedBack: "",
          options: [
            { optionId: "1", option: "", isAnswer: "false" },
            { optionId: "2", option: "", isAnswer: "false" },
          ],
        },
      ],
      totalDuration: 0,
      totalPoints: 0,
      accessibility: {
        review: true,
        countdown: true,
        countdownTransition: true,
        countDown: 5,
        showAnswer: true,
        showResult: true,
      },
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  })

  const createQuizMutation = useMutation({
    mutationFn: async (data: TQuiz) => {
      // Calculate total duration and points
      const totalDuration = data.questions.reduce(
        (sum, question) => sum + parseInt(question.duration || "0"),
        0
      )
      const totalPoints = data.questions.reduce(
        (sum, question) => sum + parseInt(question.points || "0"),
        0
      )

      const payload = {
        ...data,
        totalDuration,
        totalPoints,
        createdBy: session?.user?.id,
      }

      const response = await fetch("/api/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Failed to create quiz")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] })
      // Navigate to quizzes list or show success message
    },
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        setValue("coverImage", result)
      }
      reader.readAsDataURL(file)
    }
  }

  const steps = ["Quiz Details", "Questions", "Accessibility Settings"]

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
    append({
      question: "",
      questionImage: "",
      duration: "30",
      points: "1",
      feedBack: "",
      options: [
        { optionId: "1", option: "", isAnswer: "false" },
        { optionId: "2", option: "", isAnswer: "false" },
      ],
      // Removed interactionType
    })
  }

  const addOption = (questionIndex: number) => {
    const options = watch(`questions.${questionIndex}.options`)
    const newOptionId = (options.length + 1).toString()
    setValue(`questions.${questionIndex}.options`, [
      ...options,
      { optionId: newOptionId, option: "", isAnswer: "false" },
    ])
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const options = watch(`questions.${questionIndex}.options`)
    if (options.length > 2) {
      setValue(
        `questions.${questionIndex}.options`,
        options.filter((_, index) => index !== optionIndex)
      )
    }
  }

  const toggleCorrectAnswer = (questionIndex: number, optionIndex: number) => {
    const options = watch(`questions.${questionIndex}.options`)
    const updatedOptions = options.map((option, index) => ({
      ...option,
      isAnswer: index === optionIndex ? "true" : "false",
    }))
    setValue(`questions.${questionIndex}.options`, updatedOptions)
  }

  const lessons: LessonDto[] = useMemo(() => {
    if (courseData) {
      return courseData?.curriculum?.topic?.flatMap(
        (c: { lessons: LessonDto[] }) => c?.lessons
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
                  <Select
                    {...register("lessonId")}
                    labelId="lesson-select-label"
                    label="Select Lesson"
                    disabled={!lessons}
                    fullWidth
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                        },
                      },
                    }}
                  >
                    {!lessons ? (
                      <MenuItem value="" disabled>
                        Loading lessons...
                      </MenuItem>
                    ) : lessons.length === 0 ? (
                      <MenuItem value="" disabled>
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
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Quiz Name"
                    {...register("quizName")}
                    error={!!errors.quizName}
                    helperText={errors.quizName?.message}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Cover Title"
                    {...register("coverTitle")}
                    error={!!errors.coverTitle}
                    helperText={errors.coverTitle?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    {...register("description")}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box>
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="cover-image-upload"
                      type="file"
                      onChange={handleImageUpload}
                    />
                    <label htmlFor="cover-image-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                      >
                        Upload Cover Image
                      </Button>
                    </label>
                    {imagePreview && (
                      <Card sx={{ maxWidth: 345, mt: 2 }}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={imagePreview}
                          alt="Cover preview"
                        />
                      </Card>
                    )}
                  </Box>
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
                        {...register(`questions.${questionIndex}.question`)}
                        error={!!errors.questions?.[questionIndex]?.question}
                        helperText={
                          errors.questions?.[questionIndex]?.question?.message
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Duration (seconds)"
                        {...register(`questions.${questionIndex}.duration`)}
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Points"
                        {...register(`questions.${questionIndex}.points`)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Feedback"
                        {...register(`questions.${questionIndex}.feedBack`)}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Options
                      </Typography>
                      <Typography
                        sx={{ mb: 3 }}
                        variant="subtitle2"
                        gutterBottom
                      >
                        Select the correct answer from the options
                      </Typography>
                      {watch(`questions.${questionIndex}.options`).map(
                        (option, optionIndex) => (
                          <Box
                            key={option.optionId}
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
                                    <Checkbox
                                      checked={option.isAnswer === "true"}
                                      onChange={() =>
                                        toggleCorrectAnswer(
                                          questionIndex,
                                          optionIndex
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
                                  label={`Option ${optionIndex + 1}`}
                                  {...register(
                                    `questions.${questionIndex}.options.${optionIndex}.option`
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
                                    watch(`questions.${questionIndex}.options`)
                                      .length <= 2
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
                Accessibility Settings
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="accessibility.review"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        }
                        label="Show quiz feedback after each question"
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="accessibility.countdown"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        }
                        label="Enable countdown timer"
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="accessibility.countdownTransition"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            disabled={!watch("accessibility.countdown")}
                          />
                        }
                        label="Show countdown transition animation"
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="accessibility.showAnswer"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        }
                        label="Show correct answer after each question"
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="accessibility.showResult"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        }
                        label="Show result summary at the end"
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="accessibility.countDown"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        type="number"
                        label="Countdown time (seconds)"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                        disabled={!watch("accessibility.countdown")}
                      />
                    )}
                  />
                </Grid>
              </Grid>
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
