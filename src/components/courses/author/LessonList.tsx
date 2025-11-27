import React from "react"
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Box,
} from "@mui/material"
import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material"
import { LessonDto, ProgressData } from "@/types/types"

interface LessonsListProps {
  lessons: LessonDto[]
  progress?: { progress: ProgressData[] }
}

export const LessonsList: React.FC<LessonsListProps> = ({
  lessons,
  progress,
}) => {
  const isLessonCompleted = (lessonId: string) => {
    if (!progress?.progress) return false

    const lessonProgress = progress.progress.find(
      (p: ProgressData) => p.lessonId === lessonId
    )
    return lessonProgress?.completionPercentage === 100
  }

  const getLessonCompletion = (lessonId: string) => {
    if (!progress?.progress) return 0

    const lessonProgress = progress.progress.find(
      (p: ProgressData) => p.lessonId === lessonId
    )
    return lessonProgress?.completionPercentage || 0
  }

  const getLessonLastActivity = (lessonId: string) => {
    if (!progress?.progress) return null

    const lessonProgress = progress.progress.find(
      (p: ProgressData) => p.lessonId === lessonId
    )
    return lessonProgress?.updatedAt || null
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Lessons Progress
        </Typography>

        {lessons.length > 0 ? (
          <List>
            {lessons.map((lesson) => {
              const completed = isLessonCompleted(lesson?.id ?? "0")
              const completionPercentage = getLessonCompletion(
                lesson?.id ?? "0"
              )
              const lastActivity = getLessonLastActivity(lesson?.id ?? "0")

              return (
                <ListItem key={lesson.id} divider>
                  <ListItemIcon>
                    {completed ? (
                      <CheckCircle color="success" />
                    ) : completionPercentage > 0 ? (
                      <CheckCircle color="primary" />
                    ) : (
                      <RadioButtonUnchecked color="disabled" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={lesson.title || `Lesson ${lesson.id}`}
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        {completionPercentage > 0 && (
                          <Chip
                            label={`${completionPercentage}% Complete`}
                            size="small"
                            color={
                              completed
                                ? "success"
                                : completionPercentage >= 50
                                  ? "primary"
                                  : "default"
                            }
                            sx={{ mr: 1 }}
                          />
                        )}

                        {lastActivity &&
                          completionPercentage > 0 &&
                          completionPercentage < 100 && (
                            <Chip
                              label={`Last: ${new Date(lastActivity).toLocaleDateString()}`}
                              size="small"
                              variant="outlined"
                              color="default"
                            />
                          )}
                      </Box>
                    }
                  />
                </ListItem>
              )
            })}
          </List>
        ) : (
          <Box textAlign="center" py={3}>
            <Typography variant="body2" color="text.secondary">
              No lessons found in this course
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
