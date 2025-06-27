import { uploadImageToS3 } from "@/app/api/rest"
import { notifyError, notifySuccess } from "@/utils/notification"
import {
  Alert,
  Box,
  Button,
  Divider,
  FormControlLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material"
import React from "react"
import { Controller, useFormContext } from "react-hook-form"
import { categories } from "./CourseDashboard"
import { useDropzone } from "react-dropzone"
import { Image as ImageIcon, Close as CloseIcon } from "@mui/icons-material"
import Image from "next/image"
const IMAGE_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "image/webp": [".webp"],
}
const AddCourseForm = () => {
  const { control, setValue } = useFormContext()
  const [checked, setChecked] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const [imagePreview, setImagePreview] = React.useState<string>("")
  const handleUpload = async (file: File) => {
    setUploading(true)

    try {
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      const uploadUrl = await uploadImageToS3(file)

      setValue("thumbnail", uploadUrl)
      setValue("file", file) // Store file object in form
      notifySuccess("Thumbnail uploaded successfully!")
    } catch {
      notifyError("Failed to upload image. Please try again.")
      setImagePreview("")
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    setValue("thumbnail", "")
    setValue("file", null)
    setImagePreview("")
  }
  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      accept: IMAGE_TYPES,
      maxFiles: 1,
      maxSize: 5 * 1024 * 1024, // 5MB max
      disabled: uploading,
      onDrop: (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
          handleUpload(acceptedFiles[0])
        }
      },
    })
  return (
    <Stack spacing={3}>
      <Controller
        name="course.courseName"
        control={control}
        rules={{ required: "Course name is required" }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Course Name"
            required
            fullWidth
            id="course.courseName"
            error={!!error}
            helperText={error?.message}
          />
        )}
      />

      <Controller
        name="course.category"
        control={control}
        render={({ field }) => (
          <TextField
            select
            fullWidth
            label="Content Category"
            margin="normal"
            {...field}
          >
            {Object.values(categories).map((term) => (
              <MenuItem key={term} value={term}>
                {term}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      <Controller
        name="course.target"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Target Audience"
            required
            fullWidth
            id="course.target"
            error={!!error}
            helperText={error?.message}
          />
        )}
      />

      <Controller
        name="course.brief"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Brief"
            required
            fullWidth
            id="course.brief"
            error={!!error}
            helperText={error?.message}
          />
        )}
      />

      <Controller
        name="course.overview"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Overview"
            id="course.overview"
            multiline
            rows={4}
            fullWidth
          />
        )}
      />

      {/* Image Upload with Dropzone */}
      <Controller
        name="file"
        control={control}
        rules={{ required: "Course display image is required" }}
        render={({ fieldState: { error } }) => (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Course Display Image *
            </Typography>

            {!imagePreview ? (
              <Box
                {...getRootProps()}
                sx={{
                  border: "2px dashed",
                  borderColor: isDragActive
                    ? "primary.main"
                    : error
                      ? "error.main"
                      : "grey.400",
                  borderRadius: 2,
                  p: 4,
                  textAlign: "center",
                  backgroundColor: isDragActive
                    ? "action.hover"
                    : "background.paper",
                  cursor: uploading ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <input {...getInputProps()} />

                {uploading ? (
                  <Box>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Uploading...
                    </Typography>
                    <LinearProgress
                      variant="indeterminate"
                      sx={{ width: "100%", maxWidth: 300, mx: "auto" }}
                    />
                  </Box>
                ) : (
                  <>
                    <ImageIcon
                      sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
                    />

                    <Typography variant="body1" gutterBottom>
                      {isDragActive
                        ? "Drop the image here..."
                        : "Drag and drop an image here, or click to browse"}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      Accepted formats: JPG, PNG, GIF, WEBP (Max 5MB)
                    </Typography>
                  </>
                )}
              </Box>
            ) : (
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  position: "relative",
                }}
              >
                <Box sx={{ position: "relative", mb: 2 }}>
                  <Image
                    src={imagePreview}
                    alt="Course thumbnail preview"
                    width={300}
                    height={200}
                    style={{
                      width: "100%",
                      maxHeight: 300,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                  <Button
                    size="small"
                    color="error"
                    onClick={removeImage}
                    disabled={uploading}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      minWidth: "auto",
                      bgcolor: "background.paper",
                      "&:hover": {
                        bgcolor: "error.light",
                        color: "white",
                      },
                    }}
                  >
                    <CloseIcon />
                  </Button>
                </Box>

                <Typography variant="body2" color="success.main" align="center">
                  Thumbnail uploaded successfully
                </Typography>
              </Paper>
            )}

            {error && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 1, display: "block" }}
              >
                {error.message}
              </Typography>
            )}

            {fileRejections.length > 0 && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {fileRejections[0].errors[0].code === "file-too-large"
                  ? "File size must be less than 5MB"
                  : "Please upload a valid image file"}
              </Alert>
            )}
          </Box>
        )}
      />

      <Divider />

      <FormControlLabel
        control={
          <Switch
            checked={checked}
            onChange={(event) => setChecked(event.target.checked)}
          />
        }
        label="Paid course?"
      />

      {checked && (
        <>
          <Controller
            name="course.price"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Price"
                required
                fullWidth
                id="course.price"
                type="number"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="course.currency"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Currency"
                required
                fullWidth
                id="course.currency"
                error={!!error}
                helperText={error?.message}
                placeholder="e.g., USD, EUR, GBP"
              />
            )}
          />
        </>
      )}
    </Stack>
  )
}
export default AddCourseForm
