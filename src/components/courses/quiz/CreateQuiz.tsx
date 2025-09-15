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
  RadioGroup,
} from "@mui/material"
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Error as ErrorIcon,
} from "@mui/icons-material"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { quizSchema, TQuiz } from "@/schema/quizSchema"
import { addQuiz, fetchCourse } from "@/app/api/rest"
import { LessonDto } from "@/types/types"
import { notifyError, notifySuccess } from "@/utils/notification"

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
    reset,
    trigger,
    formState: { errors, isSubmitting },
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
      notifySuccess("Quiz created successfully!")
      reset()
      setActiveStep(0)
    },
    onError: (error: Error) => {
      notifyError(error?.message || "Failed to create quiz. Please try again.")
    },
  })

  const steps = ["Quiz Details", "Questions", "Review"]

  const handleNext = async () => {
    let isValid = true

    if (activeStep === 0) {
      isValid = await trigger([
        "lessonId",
        "content.title",
        "content.description",
        "content.timeLimit",
        "content.passingScore",
      ])
    } else if (activeStep === 1) {
      isValid = await trigger("content.questions")
    }

    if (isValid) {
      setActiveStep((prevStep) => prevStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const onSubmit = async (data: TQuiz) => {
    try {
      await createQuizMutation.mutateAsync(data)
    } catch {
      notifyError("Submission error:")
    }
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
      const currentCorrectAnswer = watch(
        `content.questions.${questionIndex}.correctAnswer`
      )
      const removedOption = options[optionIndex]

      if (currentCorrectAnswer === removedOption.id) {
        setValue(`content.questions.${questionIndex}.correctAnswer`, "")
      }

      setValue(
        `content.questions.${questionIndex}.options`,
        options.filter((_, index) => index !== optionIndex)
      )
    }
  }

  const handleQuestionTypeChange = (
    questionIndex: number,
    newType: "multiple_choice" | "true_false" | "short_answer"
  ) => {
    setValue(`content.questions.${questionIndex}.type`, newType)
    setValue(`content.questions.${questionIndex}.correctAnswer`, "")

    if (newType === "true_false") {
      setValue(`content.questions.${questionIndex}.options`, [
        { id: "true", text: "True" },
        { id: "false", text: "False" },
      ])
    } else if (newType === "multiple_choice") {
      setValue(`content.questions.${questionIndex}.options`, [
        { id: "a", text: "" },
        { id: "b", text: "" },
        { id: "c", text: "" },
        { id: "d", text: "" },
      ])
    } else if (newType === "short_answer") {
      setValue(`content.questions.${questionIndex}.options`, [
        {
          id: "a",
          text: "NA",
        },
        {
          id: "b",
          text: "NA",
        },
      ])
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

  const renderFormErrors = () => {
    const hasErrors = Object.keys(errors).length > 0
    if (!hasErrors) return null

    return (
      <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Please fix the following errors:
        </Typography>
        <Box component="ul" sx={{ margin: 0, paddingLeft: 2 }}>
          {errors.lessonId && <li>Please select a lesson</li>}
          {errors.content?.title && <li>Quiz title is required</li>}
          {errors.content?.description && <li>Quiz description is required</li>}
          {errors.content?.timeLimit && <li>Valid time limit is required</li>}
          {errors.content?.passingScore && (
            <li>Valid passing score is required (0-100%)</li>
          )}
          {errors.content?.questions && (
            <li>Please fix question errors below</li>
          )}
        </Box>
      </Alert>
    )
  }

  const renderCorrectAnswerField = (
    questionIndex: number,
    questionType: string
  ) => {
    const hasCorrectAnswerError =
      !!errors.content?.questions?.[questionIndex]?.correctAnswer

    if (questionType === "short_answer") {
      return (
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Correct Answer"
            {...register(`content.questions.${questionIndex}.correctAnswer`)}
            error={hasCorrectAnswerError}
            helperText={
              hasCorrectAnswerError
                ? errors.content?.questions?.[questionIndex]?.correctAnswer
                    ?.message
                : "Provide the expected answer for this short answer question"
            }
          />
        </Grid>
      )
    }

    return (
      <Grid size={{ xs: 12 }}>
        <FormControl
          component="fieldset"
          error={hasCorrectAnswerError}
          fullWidth
        >
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{
              color: hasCorrectAnswerError ? "error.main" : "text.primary",
            }}
          >
            Correct Answer *
          </Typography>
          <Controller
            name={`content.questions.${questionIndex}.correctAnswer`}
            control={control}
            render={({ field }) => (
              <RadioGroup {...field} row>
                {watch(`content.questions.${questionIndex}.options`).map(
                  (option) => (
                    <FormControlLabel
                      key={option.id}
                      value={option.id}
                      control={<Radio />}
                      label={
                        questionType === "true_false"
                          ? option.text
                          : `Option ${option.id.toUpperCase()}${option.text ? ` - ${option.text}` : ""}`
                      }
                    />
                  )
                )}
              </RadioGroup>
            )}
          />
          {hasCorrectAnswerError && (
            <FormHelperText>
              {
                errors.content?.questions?.[questionIndex]?.correctAnswer
                  ?.message
              }
            </FormHelperText>
          )}
        </FormControl>
      </Grid>
    )
  }

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

        {renderFormErrors()}

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
                      Select Lesson *
                    </InputLabel>
                    <Controller
                      name="lessonId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          labelId="lesson-select-label"
                          label="Select Lesson *"
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
                    label="Quiz Title *"
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
                    label="Description *"
                    {...register("content.description")}
                    error={!!errors.content?.description}
                    helperText={errors.content?.description?.message}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Time Limit (minutes) *"
                    {...register("content.timeLimit", { valueAsNumber: true })}
                    error={!!errors.content?.timeLimit}
                    helperText={errors.content?.timeLimit?.message}
                    inputProps={{ min: 1, max: 180 }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Passing Score (%) *"
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
              {fields.map((question, questionIndex) => {
                const questionType = watch(
                  `content.questions.${questionIndex}.type`
                )
                const questionErrors =
                  errors.content?.questions?.[questionIndex]
                const hasQuestionErrors = !!questionErrors

                return (
                  <Paper
                    key={question.id}
                    sx={{
                      p: 3,
                      mb: 3,
                      border: hasQuestionErrors ? "2px solid" : "1px solid",
                      borderColor: hasQuestionErrors ? "error.main" : "divider",
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Typography
                        variant="h6"
                        color={
                          hasQuestionErrors ? "error.main" : "text.primary"
                        }
                      >
                        Question {questionIndex + 1}
                        {hasQuestionErrors && (
                          <ErrorIcon sx={{ ml: 1, fontSize: "1.2em" }} />
                        )}
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
                          label="Question *"
                          {...register(
                            `content.questions.${questionIndex}.question`
                          )}
                          error={!!questionErrors?.question}
                          helperText={questionErrors?.question?.message}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth error={!!questionErrors?.type}>
                          <InputLabel>Question Type *</InputLabel>
                          <Controller
                            name={`content.questions.${questionIndex}.type`}
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                label="Question Type *"
                                onChange={(e) => {
                                  field.onChange(e)
                                  handleQuestionTypeChange(
                                    questionIndex,
                                    e.target.value
                                  )
                                }}
                              >
                                <MenuItem value="multiple_choice">
                                  Multiple Choice
                                </MenuItem>
                                <MenuItem value="true_false">
                                  True/False
                                </MenuItem>
                                <MenuItem value="short_answer">
                                  Short Answer
                                </MenuItem>
                              </Select>
                            )}
                          />
                          {questionErrors?.type && (
                            <FormHelperText>
                              {typeof questionErrors?.type === "object" &&
                              "message" in questionErrors.type
                                ? (questionErrors.type as { message?: string })
                                    .message
                                : null}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Points *"
                          {...register(
                            `content.questions.${questionIndex}.points`,
                            { valueAsNumber: true }
                          )}
                          error={!!questionErrors?.points}
                          helperText={questionErrors?.points?.message}
                          inputProps={{ min: 1, max: 10 }}
                        />
                      </Grid>

                      {questionType !== "short_answer" && (
                        <Grid size={{ xs: 12 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            Options
                          </Typography>

                          {watch(
                            `content.questions.${questionIndex}.options`
                          ).map((option, optionIndex) => (
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
                                <Grid size={{ xs: 10 }}>
                                  <TextField
                                    fullWidth
                                    label={`Option ${option.id.toUpperCase()}`}
                                    {...register(
                                      `content.questions.${questionIndex}.options.${optionIndex}.text`
                                    )}
                                    disabled={questionType === "true_false"}
                                    error={
                                      !!questionErrors?.options?.[optionIndex]
                                        ?.text
                                    }
                                    helperText={
                                      questionErrors?.options?.[optionIndex]
                                        ?.text?.message
                                    }
                                  />
                                </Grid>
                                <Grid size={{ xs: 2 }}>
                                  {questionType !== "true_false" && (
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
                                  )}
                                </Grid>
                              </Grid>
                            </Box>
                          ))}

                          {questionType === "multiple_choice" && (
                            <Button
                              variant="outlined"
                              startIcon={<AddIcon />}
                              onClick={() => addOption(questionIndex)}
                              sx={{ mt: 1 }}
                            >
                              Add Option
                            </Button>
                          )}
                        </Grid>
                      )}

                      {renderCorrectAnswerField(questionIndex, questionType)}

                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          placeholder="Provide further explanation for the question (optional)"
                          label="Explanation"
                          {...register(
                            `content.questions.${questionIndex}.explanation`
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                )
              })}

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
                      Type: {watch(`content.questions.${index}.type`)} | Correct
                      Answer:{" "}
                      {watch(`content.questions.${index}.correctAnswer`)}
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
                disabled={isSubmitting || createQuizMutation.isLoading}
              >
                {isSubmitting || createQuizMutation.isLoading
                  ? "Creating..."
                  : "Create Quiz"}
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  )
}

export default CreateQuiz
