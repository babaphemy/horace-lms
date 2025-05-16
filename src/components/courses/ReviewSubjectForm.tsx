import { TopicDto } from "@/types/types"
import { Box, Divider, Paper, Stack, Typography } from "@mui/material"
import { useFormContext } from "react-hook-form"
const ReviewSubjectForm = () => {
  const { watch } = useFormContext()
  const formData = watch()
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Review Subject Details
      </Typography>
      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Subject Title
            </Typography>
            <Typography variant="body1">{formData.title}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Overview
            </Typography>
            <Typography variant="body1">
              {formData.overview || "No overview provided"}
            </Typography>
          </Box>
          <Divider />
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Topics ({formData.topics.length})
            </Typography>
            {formData.topics.map((topic: TopicDto, topicIndex: number) => (
              <Box key={topicIndex} sx={{ mt: 2, ml: 2 }}>
                <Typography variant="body1">{topic.title}</Typography>
                <Box sx={{ ml: 3, mt: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Lessons ({topic.lessons.length})
                  </Typography>
                  {topic.lessons.map((lesson, lessonIndex: number) => (
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
                          }}
                          dangerouslySetInnerHTML={{
                            __html: lesson.content,
                          }}
                        />
                      ) : (
                        <Typography variant="body2">
                          No description provided
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Stack>
      </Paper>
    </Box>
  )
}
export default ReviewSubjectForm
