import {
  Box,
  Button,
  Container,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material"
import React from "react"
import SendIcon from "@mui/icons-material/Send"
import { Controller } from "react-hook-form"

import {
  Control,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormGetValues,
} from "react-hook-form"
import { CourseCreate } from "@/types/types"
import { formStyles } from "@/styles/formStyles"
import { categories } from "./CourseDashboard"

interface SubjectFormProps {
  form: {
    control: Control<CourseCreate>
    handleSubmit: UseFormHandleSubmit<CourseCreate>
    getValues: UseFormGetValues<CourseCreate>
    formState: {
      errors: FieldErrors<CourseCreate>
    }
  }
  isLoading: boolean
  onSubmit: (_data: CourseCreate) => void
}

const SubjectForm: React.FC<SubjectFormProps> = ({
  form: {
    control,
    handleSubmit,
    formState: { errors },
  },
  isLoading,
  onSubmit,
}) => {
  return (
    <Container maxWidth="md">
      <Box my={3} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box className="bg-black">
          <Box mb={2}>
            <Typography component="label" sx={formStyles.label} htmlFor="title">
              Course Name
            </Typography>
            <Controller
              name="courseName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="title" // Added id for accessibility
                  fullWidth
                  error={!!errors?.courseName}
                  helperText={
                    (errors?.courseName?.message as string) ||
                    "Please enter a course name."
                  }
                />
              )}
            />
          </Box>
          <Box mb={2}>
            <Typography
              component="label"
              sx={formStyles.label}
              htmlFor="overview"
            >
              Subject Overview
            </Typography>
            <Controller
              name="overview"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="overview" // Added id for accessibility
                  fullWidth
                  multiline
                  rows={4}
                  error={!!errors?.overview}
                  helperText={
                    (errors?.overview?.message as string) ||
                    "Please provide an overview."
                  }
                />
              )}
            />
          </Box>
          <Box>
            <Typography
              component="label"
              sx={formStyles.label}
              htmlFor="class_id"
            >
              Class
            </Typography>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  id="class_id"
                  fullWidth
                  error={!!errors?.category}
                  inputProps={{
                    style: { borderRadius: 8 },
                  }}
                >
                  {categories?.map((cat) => (
                    <MenuItem key={cat} value={cat ?? ""}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </Box>
        </Box>
        <Button
          type="submit"
          disabled={isLoading}
          fullWidth
          variant="contained"
          sx={formStyles.button}
          endIcon={<SendIcon />}
        >
          {isLoading && "Saving..."}
        </Button>
      </Box>
    </Container>
  )
}

export default SubjectForm
