"use client"
import { addSubjectComplete, fetchCourse } from "@/app/api/rest"
import AddCourseForm from "@/components/courses/AddCourseForm"
import AddLessonForm from "@/components/courses/AddLessonForm"
import AddTopicForm from "@/components/courses/AddTopicForm"
import ReviewSubjectForm from "@/components/courses/ReviewSubjectForm"
import { courseCompleteSchema } from "@/schema/courseSchema"
import { CourseComplete, LESSONTYPE, TopicDto } from "@/types/types"
import { notifyError, notifySuccess } from "@/utils/notification"
import { yupResolver } from "@hookform/resolvers/yup"
import { Save as SaveIcon } from "@mui/icons-material"
import {
  Box,
  Button,
  Container,
  LinearProgress,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { JSX, useCallback, useEffect, useState } from "react"

import { FieldError, FieldErrors, FormProvider, useForm } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "react-query"
import * as yup from "yup"

// Recursive function to render nested errors
const renderErrors = (errors: FieldErrors, parentKey = ""): JSX.Element[] => {
  return Object.entries(errors).flatMap(([key, value]) => {
    const fieldName = parentKey ? `${parentKey}.${key}` : key

    if (value && typeof value === "object" && "message" in value) {
      return (
        <Typography key={fieldName} variant="body2">
          {fieldName}: {(value as FieldError).message}
        </Typography>
      )
    } else if (Array.isArray(value)) {
      return value.flatMap((item, index) => {
        const arrayKey = `${fieldName}[${index}]`
        return item && typeof item === "object"
          ? renderErrors(item, arrayKey)
          : []
      })
    } else if (value && typeof value === "object") {
      return renderErrors(value as FieldErrors, fieldName)
    }
    return []
  })
}

const SubjectCreatePage = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const cid = searchParams.get("cid")
  const [activeStep, setActiveStep] = useState(0)
  const queryClient = useQueryClient()
  const isEditMode = !!cid

  const { data: acourse, isLoading } = useQuery({
    queryKey: ["course", cid],
    queryFn: () => fetchCourse(cid as string),
    enabled: !!cid && !!session?.user?.id,
    onError: () => {
      notifyError("Failed to fetch course data")
    },
  })

  useEffect(() => {
    if (isLoading || status === "loading") return

    if (status === "unauthenticated" || !session?.user?.id) {
      notifyError("Please log in to create/edit a subject")
      router.push("/login")
      return
    }
  }, [status, session, router, isLoading])

  const steps = ["Subject Details", "Add Modules", "Add Lessons", "Review"]

  const handleNext = async () => {
    if (!session?.user?.id) {
      notifyError("Session expired, please login again!")
      router.push("/login")
      return
    }

    setActiveStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0))
  }

  const { mutate } = useMutation({
    mutationFn: addSubjectComplete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] })
      notifySuccess("New Subject created successfully")
      router.push(`/courses/${session?.user?.id}`)
      methods.reset(getDefaultValues())
      return
    },
    onError: () => {
      notifyError(
        isEditMode
          ? "Failed to edit subject, please retry!"
          : "Failed to create new subject, Try again!!!"
      )
      return
    },
  })
  const getDefaultValues = useCallback((): CourseComplete => {
    const baseDefaults: CourseComplete = {
      course: {
        id: undefined,
        user: session?.user?.id || "",
        courseName: "",
        category: "",
        target: "",
        brief: "",
        overview: "",
        price: 0,
        tax: 0,
        thumbnail: "",
        draft: "",
        currency: "",
        createdOn: new Date(),
        updatedOn: new Date(),
      },
      topics: [
        {
          module: "",
          description: "",
          orderIndex: undefined,
          lessons: [
            {
              title: "",
              type: LESSONTYPE.text,
              orderIndex: undefined,
              video: "",
              content: "",
              createdOn: new Date(),
              updatedOn: new Date(),
            },
          ],
          dueDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
          createdOn: new Date(),
          updatedOn: new Date(),
        },
      ],
    }

    if (isEditMode && acourse) {
      return {
        course: {
          ...baseDefaults.course,
          courseName: acourse?.courseName || "",
          category: acourse?.category || "calegi",
          target: acourse?.target || "tatat",
          brief: acourse?.brief || "",
          overview: acourse?.overview || "",
          price: acourse?.price || 0,
          tax: acourse?.tax || 0,
          thumbnail: acourse?.thumbnail || "",
          draft: acourse?.draft || "",
          currency: acourse?.currency || "",
          id: acourse.courseId || "",
          user: session?.user?.id || acourse.author?.id || "",
          updatedOn: new Date(),
        },
        topics:
          acourse.curriculum && acourse.curriculum?.topic.length > 0
            ? acourse.curriculum.topic.map((topic: TopicDto) => ({
                id: topic.id,
                cid: topic?.courseId,
                module: topic?.title || "",
                description: topic?.description || "",
                orderIndex: topic?.orderIndex,
                updatedOn: new Date(),
                lessons:
                  topic.lessons?.map((lesson) => ({
                    updatedOn: new Date(),
                    id: lesson.id,
                    title: lesson.title || "",
                    type: lesson.type || LESSONTYPE.text,
                    content: lesson.content || "",
                    video: lesson.video || "",
                  })) || baseDefaults.topics[0].lessons,
              }))
            : baseDefaults.topics,
      }
    }
    return baseDefaults
  }, [acourse, isEditMode, session?.user?.id])

  const methods = useForm({
    defaultValues: getDefaultValues(),
    resolver: yupResolver(courseCompleteSchema),
  })
  useEffect(() => {
    if (isEditMode && acourse) {
      const newDefaults = getDefaultValues()
      methods.reset(newDefaults)
    }
  }, [
    acourse,
    isLoading,
    isEditMode,
    methods,
    session?.user?.id,
    getDefaultValues,
  ])
  const isLastStep = activeStep === steps.length - 1

  const handleSubmit = async (
    values: yup.InferType<typeof courseCompleteSchema>
  ) => {
    if (!session?.user?.id) {
      notifyError("User not authenticated")
      return
    }
    const submitData = {
      ...values,
      course: {
        ...values.course,
        id: isEditMode ? cid : undefined,
        user: session?.user?.id,
        updatedOn: new Date(),
      },
      topics: values.topics ?? [],
    }
    mutate(submitData)
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <AddCourseForm />
      case 1:
        return <AddTopicForm />
      case 2:
        return <AddLessonForm />
      case 3:
        return <ReviewSubjectForm />
      default:
        return null
    }
  }

  if (status === "unauthenticated" || !session?.user?.id) {
    return null
  }
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <FormProvider {...methods}>
          <Paper elevation={3} sx={{ p: 4 }}>
            {isLoading && <LinearProgress sx={{ mb: 2 }} />}

            <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>
              {isEditMode ? "Edit Course" : "Create New Course"}
            </Typography>

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Global error message display */}
            {!isLoading && Object.keys(methods.formState.errors).length > 0 && (
              <Box sx={{ mb: 2, color: "error.main" }}>
                <Typography variant="body1">
                  There are errors in the form:
                </Typography>
                {renderErrors(methods.formState.errors)}
              </Box>
            )}

            <Box sx={{ mb: 4 }}>{renderStepContent(activeStep)}</Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0 || isLoading}
              >
                Back
              </Button>
              <Box>
                {isLastStep ? (
                  <Button
                    variant="contained"
                    onClick={methods.handleSubmit(handleSubmit)}
                    disabled={isLoading}
                    startIcon={<SaveIcon />}
                  >
                    Create Subject
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={isLoading}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </FormProvider>
      </Box>
    </Container>
  )
}

export default SubjectCreatePage
