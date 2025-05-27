import { TopicDto } from "@/types/types"
import {
  Box,
  Divider,
  Paper,
  Stack,
  Typography,
  FormControlLabel,
  Switch,
  Alert,
  Chip,
} from "@mui/material"
import { useFormContext } from "react-hook-form"

const ReviewSubjectForm = () => {
  const { watch, setValue } = useFormContext()
  const formData = watch()
  const isDraft =
    formData.course?.draft === "true" || formData.course?.draft === true

  const handlePublishToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isPublished = event.target.checked
    setValue("course.draft", isPublished ? "false" : "true", {
      shouldDirty: true,
    })
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Review Subject Details
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          p: 3,
          mb: 3,
          bgcolor: isDraft ? "warning.light" : "success.light",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Publication Status
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                label={isDraft ? "Draft" : "Published"}
                color={isDraft ? "warning" : "success"}
                size="small"
              />
              <Typography variant="body2" color="text.secondary">
                {isDraft
                  ? "This subject is saved as a draft and not visible to students"
                  : "This subject is published and visible to students"}
              </Typography>
            </Box>
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={!isDraft}
                onChange={handlePublishToggle}
                color="success"
                size="medium"
              />
            }
            label={
              <Typography variant="subtitle1" fontWeight="medium">
                {isDraft ? "Publish Subject" : "Published"}
              </Typography>
            }
            labelPlacement="start"
          />
        </Stack>

        {!isDraft && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <strong>Published:</strong> Students can now enroll and access this
            subject.
          </Alert>
        )}
      </Paper>

      {/* Course Details Section */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Course name
            </Typography>
            <Typography variant="body1">
              {formData.course?.courseName || "No course name provided"}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Category
            </Typography>
            <Typography variant="body1">
              {formData.course?.category || "No category specified"}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Target Audience
            </Typography>
            <Typography variant="body1">
              {formData.course?.target || "No target audience specified"}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Brief Description
            </Typography>
            <Typography variant="body1">
              {formData.course?.brief || "No brief description provided"}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Overview
            </Typography>
            <Typography variant="body1">
              {formData.course?.overview || "No overview provided"}
            </Typography>
          </Box>

          {(formData.course?.price > 0 || formData.course?.tax > 0) && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Pricing
              </Typography>
              <Typography variant="body1">
                {formData.course?.currency || "$"}
                {formData.course?.price || 0}
                {formData.course?.tax > 0 && ` (Tax: ${formData.course.tax}%)`}
              </Typography>
            </Box>
          )}

          <Divider />

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Modules ({formData.topics?.length || 0})
            </Typography>
            {formData.topics?.length > 0 ? (
              formData.topics.map((topic: TopicDto, topicIndex: number) => (
                <Box key={topicIndex} sx={{ mt: 2, ml: 2 }}>
                  <Typography variant="body1" fontWeight="medium">
                    {topicIndex + 1}. {topic.module}
                  </Typography>
                  {topic.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {topic.description}
                    </Typography>
                  )}

                  <Box sx={{ ml: 3, mt: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Lessons ({topic.lessons?.length || 0})
                    </Typography>
                    {topic.lessons?.length > 0 ? (
                      topic.lessons.map((lesson, lessonIndex: number) => (
                        <Box key={lessonIndex} sx={{ ml: 2, mt: 1 }}>
                          <Typography variant="body2">
                            • {lesson.title}
                            {lesson.dueDate &&
                              ` (Due: ${new Date(
                                lesson.dueDate
                              ).toLocaleDateString()})`}
                          </Typography>
                          {lesson.content ? (
                            <Box
                              sx={{
                                mt: 0.5,
                                mb: 1.5,
                                pl: 1,
                                borderLeft: "2px solid",
                                borderColor: "divider",
                                fontSize: "0.875rem",
                              }}
                              dangerouslySetInnerHTML={{
                                __html: lesson.content,
                              }}
                            />
                          ) : (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ ml: 1 }}
                            >
                              No description provided
                            </Typography>
                          )}
                        </Box>
                      ))
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: 2 }}
                      >
                        No lessons added yet
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No modules added yet
              </Typography>
            )}
          </Box>
        </Stack>
      </Paper>
    </Box>
  )
}

export default ReviewSubjectForm
