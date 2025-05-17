"use client"
import { addSubjectComplete } from "@/app/api/rest"
import AddCourseForm from "@/components/courses/AddCourseForm"
import AddLessonForm from "@/components/courses/AddLessonForm"
import AddTopicForm from "@/components/courses/AddTopicForm"
import ReviewSubjectForm from "@/components/courses/ReviewSubjectForm"
import { courseCompleteSchema } from "@/schema/courseSchema"
import { CourseComplete } from "@/types/types"
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
import { useRouter } from "next/navigation"
import { JSX, useState } from "react"

import { FieldError, FieldErrors, FormProvider, useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "react-query"
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
  const { data: session } = useSession()
  const [activeStep, setActiveStep] = useState(0)
  const [isLoading] = useState(false)
  const queryClient = useQueryClient()

  const steps = ["Subject Details", "Add Topics", "Add Lessons", "Review"]

  const handleNext = async () => {
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
      router.push("/lms-courses")
      methods.reset(defaultValues)
      return
    },
    onError: () => {
      notifyError("Failed to create new subject, Try again!!!")
      return
    },
  })

  const defaultValues: CourseComplete = {
    id: undefined, // Optional
    user: session?.user?.id || "",
    courseName: "",
    category: "",
    target: "",
    brief: "",
    overview: "",
    price: undefined,
    tax: undefined,
    thumbnail: "",
    draft: "",
    currency: "",
    createdOn: new Date(),
    updatedOn: new Date(),
    topics: [
      {
        title: "",
        description: "",
        orderIndex: undefined,
        lessons: [
          {
            title: "",
            type: "",
            orderIndex: undefined,
            video: "",
            content: "",
            createdOn: new Date(),
            updatedOn: new Date(),
          },
        ],
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 3)), // Default due date 3 months ahead
        createdOn: new Date(),
        updatedOn: new Date(),
      },
    ],
  }

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(courseCompleteSchema),
  })

  async function onSubmit(values: yup.InferType<typeof courseCompleteSchema>) {
    const submitData = {
      ...values,
      user: session?.user?.id,
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <FormProvider {...methods}>
          <Paper elevation={3} sx={{ p: 4 }}>
            {isLoading && <LinearProgress sx={{ mb: 2 }} />}

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
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Box sx={{ mb: 4 }}>{renderStepContent(activeStep)}</Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button
                    onClick={handleBack}
                    disabled={activeStep === 0 || isLoading}
                  >
                    Back
                  </Button>
                  <Box>
                    <Button
                      variant="contained"
                      type={
                        activeStep === steps.length - 1 ? "submit" : "button"
                      }
                      onClick={
                        activeStep === steps.length - 1 ? undefined : handleNext
                      }
                      disabled={isLoading}
                      startIcon={
                        activeStep === steps.length - 1 ? (
                          <SaveIcon />
                        ) : undefined
                      }
                    >
                      {activeStep === steps.length - 1
                        ? "Create Subject"
                        : "Next"}
                    </Button>
                  </Box>
                </Box>
              </form>
            </FormProvider>
          </Paper>
        </FormProvider>
      </Box>
    </Container>
  )
}

export default SubjectCreatePage
