import React, { useMemo, useState } from "react"
import {
  Card,
  CardContent,
  Typography,
  Box,
  ListItem,
  ListItemText,
  List,
  Collapse,
} from "@mui/material"
import {
  FiberManualRecord,
  KeyboardArrowDown,
  KeyboardArrowUp,
  PlayCircleOutline,
  ArticleOutlined,
} from "@mui/icons-material"

export interface Lesson {
  id: string
  tid: string
  title: string
  video?: string
  content?: string
  type: string
  orderIndex: number
  createdOn: string | null
  updatedOn: string | null
}

interface Topic {
  id: string
  module: string
  title: string
  description: string
  cid: string | null
  orderIndex: number
  lessons: Lesson[]
  createdOn: string | null
  updatedOn: string | null
}

interface ContentCardProps {
  topics: Topic[]
  currentLessonId?: string
  handleSelect: (_lesson: Lesson) => void
}

const ContentCard: React.FC<ContentCardProps> = ({
  topics,
  currentLessonId,
  handleSelect,
}) => {
  const [expandedTopics, setExpandedTopics] = useState<{
    [key: string]: boolean
  }>({})

  // React.useEffect(() => {
  //   if (topics.length > 0) {
  //     setExpandedTopics({ [topics[0].id]: true })
  //   }
  // }, [topics])

  const handleTopicToggle = (topicId: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }))
  }

  const getLessonIcon = (lessonType: string) => {
    switch (lessonType?.toLowerCase()) {
      case "video":
        return <PlayCircleOutline fontSize="small" color="primary" />
      case "document":
      case "text":
        return <ArticleOutlined fontSize="small" color="primary" />
      default:
        return <FiberManualRecord sx={{ color: "primary.main", fontSize: 8 }} />
    }
  }

  const sortedModules = useMemo(() => {
    if (topics.length === 0) return []

    return [...topics].sort((a, b) => a.orderIndex - b.orderIndex)
  }, [topics])

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const assetString = localStorage.getItem("currentLesson")
      if (sortedModules.length > 0 && assetString) {
        const assetData = JSON.parse(assetString) as Lesson

        setExpandedTopics({ [assetData?.id]: true })

        const found = sortedModules?.find((md) =>
          md?.lessons?.some((l) => l.id === assetData?.id)
        )

        if (found) {
          setExpandedTopics({ [found.id]: true })
        }
      } else {
        if (sortedModules.length === 0) return
        // Expand first module by default
        setExpandedTopics({ [sortedModules[0].id]: true })

        // Expand first lesson of first module by default
        if (sortedModules[0].lessons && sortedModules[0].lessons.length > 0) {
          setExpandedTopics({ [sortedModules[0].lessons[0].id]: true })
        }
      }
    }
  }, [sortedModules])

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
          Content
        </Typography>

        {topics.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center">
            No content available for this course.
          </Typography>
        ) : (
          <List disablePadding>
            {topics
              .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
              .map((topic, idx) => (
                <Box key={topic.id} sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                      cursor: "pointer",
                    }}
                    onClick={() => handleTopicToggle(topic.id)}
                  >
                    {expandedTopics[topic.id] ? (
                      <KeyboardArrowDown
                        sx={{ color: "primary.main", fontSize: 16, mr: 1 }}
                      />
                    ) : (
                      <KeyboardArrowUp
                        sx={{ color: "primary.main", fontSize: 16, mr: 1 }}
                      />
                    )}
                    <Typography variant="caption" fontWeight="medium">
                      {idx + 1}: {topic?.module || topic?.title}
                    </Typography>
                  </Box>

                  <Collapse in={expandedTopics[topic.id] || false}>
                    {topic.lessons
                      .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
                      .map((lesson) => {
                        const isCurrentLesson = lesson.id === currentLessonId

                        return (
                          <ListItem
                            key={lesson.id}
                            onClick={() => handleSelect(lesson)}
                            sx={{
                              backgroundColor: isCurrentLesson
                                ? "#ffcdd2" // Current lesson highlight
                                : "grey.100",
                              borderRadius: 1,
                              mb: 1,
                              py: 0.5,
                              cursor: "pointer",
                              "&:hover": {
                                backgroundColor: isCurrentLesson
                                  ? "#ffbdbd"
                                  : "grey.200",
                              },
                            }}
                          >
                            <ListItemText
                              primary={lesson.title}
                              primaryTypographyProps={{
                                variant: "body2",
                                color: isCurrentLesson
                                  ? "#c62828"
                                  : "text.secondary",
                                fontWeight: isCurrentLesson
                                  ? "medium"
                                  : "regular",
                              }}
                            />
                            {getLessonIcon(lesson.type)}
                          </ListItem>
                        )
                      })}
                  </Collapse>
                </Box>
              ))}
          </List>
        )}
      </CardContent>
    </Card>
  )
}

export default ContentCard
