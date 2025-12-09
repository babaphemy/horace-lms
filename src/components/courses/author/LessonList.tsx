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
  LinearProgress,
} from "@mui/material"
import {
  CheckCircle,
  RadioButtonUnchecked,
  AccessTime,
  PlayArrow,
} from "@mui/icons-material"
import { LessonDto, ProgressData } from "@/types/types"

const formatTime = (seconds: number): string => {
  if (seconds === 0) return "0 min"

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes} min`
}

interface LessonsListProps {
  lessons: LessonDto[]
  progress?: { progress: ProgressData[] }
}

export const LessonsList: React.FC<LessonsListProps> = ({
  lessons,
  progress,
}) => {
  const isLessonCompleted = (lessonId: string) => {
    if (!progress?.progress || !lessonId) return false

    const lessonProgress = progress.progress.find(
      (p: ProgressData) => String(p.lessonId) === String(lessonId)
    )
    return lessonProgress?.completionPercentage === 100
  }

  const getLessonCompletion = (lessonId: string) => {
    if (!progress?.progress || !lessonId) return 0

    const lessonProgress = progress.progress.find(
      (p: ProgressData) => String(p.lessonId) === String(lessonId)
    )
    return lessonProgress?.completionPercentage || 0
  }

  const getLessonLastActivity = (lessonId: string) => {
    if (!progress?.progress) return null

    const lessonProgress = progress.progress.find(
      (p: ProgressData) => String(p.lessonId) === String(lessonId)
    )
    return lessonProgress?.updatedAt || null
  }

  const getLessonTimeSpent = (lessonId: string) => {
    if (!progress?.progress) return 0

    const lessonProgress = progress.progress.find(
      (p: ProgressData) => String(p.lessonId) === String(lessonId)
    )
    if (!lessonProgress) return 0

    return Math.min(
      lessonProgress.currentTime || 0,
      lessonProgress.duration || 0
    )
  }

  const getLessonDuration = (lessonId: string) => {
    if (!progress?.progress) return 0

    const lessonProgress = progress.progress.find(
      (p: ProgressData) => String(p.lessonId) === String(lessonId)
    )
    return lessonProgress?.duration || 0
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
              const lessonId = lesson?.id ?? "0"
              const completed = isLessonCompleted(lessonId)
              const completionPercentage = getLessonCompletion(lessonId)
              const lastActivity = getLessonLastActivity(lessonId)
              const timeSpent = getLessonTimeSpent(lessonId)
              const duration = getLessonDuration(lessonId)

              return (
                <ListItem key={lesson.id} divider>
                  <ListItemIcon>
                    {completed ? (
                      <CheckCircle color="success" />
                    ) : completionPercentage > 0 ? (
                      <PlayArrow color="primary" />
                    ) : (
                      <RadioButtonUnchecked color="disabled" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <Typography variant="body1" fontWeight="medium">
                          {lesson.title || `Lesson ${lesson.id}`}
                        </Typography>
                        {completed && (
                          <Chip
                            label="Completed"
                            size="small"
                            color="success"
                            icon={<CheckCircle />}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        {completionPercentage > 0 ? (
                          <>
                            <LinearProgress
                              variant="determinate"
                              value={completionPercentage}
                              sx={{ height: 6, borderRadius: 3, mb: 1.5 }}
                              color={
                                completed
                                  ? "success"
                                  : completionPercentage >= 50
                                    ? "primary"
                                    : "warning"
                              }
                            />
                            <Box
                              display="flex"
                              flexWrap="wrap"
                              gap={1}
                              alignItems="center"
                            >
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
                              />
                              {timeSpent > 0 && (
                                <Chip
                                  icon={<AccessTime />}
                                  label={`Time: ${formatTime(timeSpent)}`}
                                  size="small"
                                  variant="outlined"
                                  color="default"
                                />
                              )}
                              {duration > 0 && (
                                <Chip
                                  label={`Duration: ${formatTime(duration)}`}
                                  size="small"
                                  variant="outlined"
                                  color="default"
                                />
                              )}
                              {lastActivity && (
                                <Chip
                                  label={`Last: ${new Date(lastActivity).toLocaleDateString()}`}
                                  size="small"
                                  variant="outlined"
                                  color="default"
                                />
                              )}
                            </Box>
                          </>
                        ) : (
                          <Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              Not started
                            </Typography>
                            {duration > 0 && (
                              <Chip
                                label={`Estimated: ${formatTime(duration)}`}
                                size="small"
                                variant="outlined"
                                color="default"
                              />
                            )}
                          </Box>
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
