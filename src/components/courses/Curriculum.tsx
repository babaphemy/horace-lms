"use client"
import { CourseResponse, LessonDto, QuizItem, TopicDto } from "@/types/types"
import { getIcon } from "./CourseDetail"

import React, { useState } from "react"
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  Divider,
} from "@mui/material"
import {
  ExpandMore,
  PlayCircle,
  Quiz as QuizIcon,
  AccessTime,
} from "@mui/icons-material"
import ReactPlayer from "react-player"

interface CurriculumProps {
  data?: CourseResponse
  quiz: QuizItem[]
}

const Curriculum = ({ data, quiz }: CurriculumProps) => {
  const [expandedVideoId, setExpandedVideoId] = useState<string | null>(null)
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null)

  const getQuizForLesson = (lessonId: string) => {
    return quiz.find((q) => q.lessonId === lessonId)
  }
  const getLessonIds = (lessons: LessonDto[]) => {
    return lessons.map((lesson) => lesson.id)
  }
  const getQuizForTopic = (lessons: LessonDto[]) => {
    const lessonIds = getLessonIds(lessons)
    return quiz.filter((q) => lessonIds.includes(q.lessonId))
  }

  return (
    <Box sx={{ p: 0 }}>
      {data?.curriculum?.topic?.map((module: TopicDto, idx: number) => (
        <Accordion key={`${module.id}-${idx}`} disableGutters>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box display="flex" alignItems="center">
              <PlayCircle sx={{ mr: 1 }} />
              <Typography fontWeight={500}>{module.title}</Typography>

              {getQuizForTopic(module?.lessons || []).length > 0 && (
                <Chip
                  size="small"
                  label={`${getQuizForTopic(module?.lessons || []).length} Quiz${
                    getQuizForTopic(module?.lessons || []).length > 1
                      ? "es"
                      : ""
                  }`}
                  sx={{ ml: 2 }}
                  color="secondary"
                />
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              {module?.lessons?.map((asset) => (
                <Box key={asset.id}>
                  <ListItem
                    component="button"
                    onClick={() => {
                      if (asset.type === "video") {
                        setExpandedVideoId(
                          expandedVideoId === asset.id ? null : asset.id ?? null
                        )
                        if (asset?.video) {
                          setVideoPreviewUrl(asset.video)
                        }
                      }
                    }}
                  >
                    <ListItemIcon>
                      {getIcon(asset.type, asset?.content)}
                    </ListItemIcon>
                    <ListItemText primary={asset.title} secondary={asset.id} />
                  </ListItem>
                  {expandedVideoId === asset.id && videoPreviewUrl && (
                    <Box sx={{ p: 2, width: "100%", ml: 4 }}>
                      <ReactPlayer
                        url={videoPreviewUrl}
                        controls
                        width="100%"
                        height="100%"
                      />
                    </Box>
                  )}

                  {(() => {
                    const lessonQuiz = getQuizForLesson(asset.id ?? "")
                    if (lessonQuiz) {
                      return (
                        <Box sx={{ ml: 4, mt: 1, mb: 2 }}>
                          <Divider sx={{ mb: 1 }} />
                          <ListItem
                            component="button"
                            sx={{
                              border: "1px solid",
                              borderColor: "primary.light",
                              borderRadius: 1,
                              bgcolor: "primary.50",
                              "&:hover": {
                                bgcolor: "primary.100",
                              },
                            }}
                          >
                            <ListItemIcon>
                              <QuizIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Typography variant="body2" fontWeight={500}>
                                    {lessonQuiz.title}
                                  </Typography>
                                  <Chip
                                    size="small"
                                    label="Quiz"
                                    color="primary"
                                    variant="outlined"
                                  />
                                </Box>
                              }
                              secondary={
                                <Box>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {lessonQuiz.description}
                                  </Typography>
                                  <p>{lessonQuiz.lessonId}</p>
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    gap={2}
                                    mt={0.5}
                                  >
                                    <Box
                                      display="flex"
                                      alignItems="center"
                                      gap={0.5}
                                    >
                                      <AccessTime fontSize="small" />
                                      <Typography variant="caption">
                                        {lessonQuiz.timeLimit} min
                                      </Typography>
                                    </Box>

                                    <Typography
                                      variant="caption"
                                      color="primary"
                                    >
                                      {lessonQuiz.questionsCount} question
                                      {lessonQuiz.questionsCount > 1 ? "s" : ""}
                                    </Typography>
                                  </Box>
                                </Box>
                              }
                            />
                          </ListItem>
                        </Box>
                      )
                    }
                    return null
                  })()}
                </Box>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  )
}

export default Curriculum
