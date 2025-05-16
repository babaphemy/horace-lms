import { LESSONTYPE } from "@/types/types"
import {
  InsertDriveFile as FileIcon,
  VideoFile as VideoFileIcon,
} from "@mui/icons-material"
import {
  Box,
  Button,
  Paper,
  Typography,
  LinearProgress,
  Alert,
} from "@mui/material"
import { useDropzone } from "react-dropzone"

import { uploadVideoToS3, uploadImageToS3 } from "@/app/api/rest"
import { notifyError, notifySuccess } from "@/utils/notification"
import React from "react"
import { useFormContext } from "react-hook-form"

type FileUploadProps = {
  lessonIndex: number
  topicIndex: number
  lessonType: string
  currentFile?: string
}

const VIDEO_TYPES = {
  "video/mp4": [".mp4"],
  "video/mpeg": [".mpeg"],
  "video/quicktime": [".mov"],
  "video/x-msvideo": [".avi"],
  "video/webm": [".webm"],
}

const DOCUMENT_TYPES = {
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
  "application/vnd.ms-powerpoint": [".ppt"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [
    ".pptx",
  ],
}

const FileUploadZone: React.FC<FileUploadProps> = ({
  lessonIndex,
  topicIndex,
  lessonType,
  currentFile,
}) => {
  const { setValue, setError, clearErrors } = useFormContext()
  const [uploading, setUploading] = React.useState(false)
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [uploadedFile, setUploadedFile] = React.useState<string>(
    currentFile || ""
  )

  const acceptedTypes =
    lessonType === LESSONTYPE.video ? VIDEO_TYPES : DOCUMENT_TYPES

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    setUploadProgress(0)

    try {
      const uploadFunction =
        lessonType === LESSONTYPE.video ? uploadVideoToS3 : uploadImageToS3

      const filePath: string = await uploadFunction(file)

      // Set the appropriate field based on lesson type
      const fieldName =
        lessonType === LESSONTYPE.video
          ? `topics.${topicIndex}.lessons.${lessonIndex}.video`
          : `topics.${topicIndex}.lessons.${lessonIndex}.content`

      setValue(fieldName, filePath)
      setUploadedFile(filePath)
      clearErrors(fieldName)
      notifySuccess(`${lessonType} uploaded successfully!`)
    } catch {
      notifyError(`Failed to upload ${lessonType.toLowerCase()}`)
      setError(`topics.${topicIndex}.lessons.${lessonIndex}.content`, {
        type: "manual",
        message: "Upload failed. Please try again.",
      })
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      accept: acceptedTypes,
      maxFiles: 1,
      disabled: uploading,
      onDrop: (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
          handleFileUpload(acceptedFiles[0])
        }
      },
    })

  const removeFile = () => {
    const fieldName =
      lessonType === LESSONTYPE.video
        ? `topics.${topicIndex}.lessons.${lessonIndex}.video`
        : `topics.${topicIndex}.lessons.${lessonIndex}.content`

    setValue(fieldName, "")
    setUploadedFile("")
    // TODO: Call API to delete file from S3 if needed
  }

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Upload {lessonType}
      </Typography>

      {!uploadedFile ? (
        <Box
          {...getRootProps()}
          sx={{
            border: "2px dashed",
            borderColor: isDragActive ? "primary.main" : "grey.400",
            borderRadius: 2,
            p: 3,
            textAlign: "center",
            backgroundColor: isDragActive ? "action.hover" : "background.paper",
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
                variant="determinate"
                value={uploadProgress}
                sx={{ width: "100%" }}
              />
              <Typography variant="caption" sx={{ mt: 1 }}>
                {uploadProgress}% Complete
              </Typography>
            </Box>
          ) : (
            <>
              {lessonType === LESSONTYPE.video ? (
                <VideoFileIcon
                  sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
                />
              ) : (
                <FileIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              )}

              <Typography variant="body1" gutterBottom>
                {isDragActive
                  ? `Drop the ${lessonType.toLowerCase()} here...`
                  : `Drag and drop ${lessonType.toLowerCase()} here, or click to browse`}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Accepted formats:{" "}
                {Object.values(acceptedTypes).flat().join(", ")}
              </Typography>
            </>
          )}
        </Box>
      ) : (
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {lessonType === LESSONTYPE.video ? (
              <VideoFileIcon sx={{ mr: 2, color: "primary.main" }} />
            ) : (
              <FileIcon sx={{ mr: 2, color: "primary.main" }} />
            )}
            <Box>
              <Typography variant="body2" fontWeight="medium">
                {uploadedFile.split("/").pop()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {lessonType} uploaded successfully
              </Typography>
            </Box>
          </Box>

          <Button
            color="error"
            size="small"
            onClick={removeFile}
            disabled={uploading}
          >
            Remove
          </Button>
        </Paper>
      )}

      {fileRejections.length > 0 && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {fileRejections[0].errors[0].message}
        </Alert>
      )}
    </Box>
  )
}
export default FileUploadZone
