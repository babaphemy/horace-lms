"use client"
import React, { Suspense, useEffect, useState } from "react"
import {
  Box,
  Typography,
  Button,
  Chip,
  TextField,
  Grid,
  IconButton,
  LinearProgress,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from "@mui/material"
import {
  CloudDownload,
  NoteAltOutlined,
  FolderOutlined,
} from "@mui/icons-material"
import FooterLte from "@/components/layout/FooterLte"
import { useSearchParams } from "next/navigation"
import { useQuery } from "react-query"
import { fetchCourse } from "@/app/api/rest"
import ContentCard, { Lesson } from "@/components/classroom/ContentCard"
import LessonContent from "@/components/classroom/LessonContent"
import { useSession } from "next-auth/react"
import {
  ContentContainer,
  MainCard,
  MaterialItem,
} from "@/components/classroom/StyledComponents"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  )
}

const ClassroomPage = () => {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const id = searchParams?.get("courseId")
  const [tabValue, setTabValue] = useState(0)
  const { data, isLoading, error } = useQuery({
    queryKey: ["course", id, session?.user?.id],
    queryFn: () => fetchCourse(id as string, session?.user?.id as string),
    refetchOnWindowFocus: false,
    enabled: !!id && !!session?.user?.id,
  })
  const [currentLesson, setCurrentLesson] = React.useState(
    data?.curriculum?.topic[0]?.lessons[0]
  )
  useEffect(() => {
    if (
      data?.curriculum?.topic?.length > 0 &&
      data.curriculum.topic[0]?.lessons?.length > 0
    ) {
      setCurrentLesson(data.curriculum.topic[0].lessons[0])
    }
  }, [data])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  React.useEffect(() => {
    if (typeof window !== undefined) {
      const assetString = localStorage.getItem("currentLesson")
      if (assetString) {
        const assetData = JSON.parse(assetString) as Lesson

        setCurrentLesson(assetData)
      }
    }
  }, [])

  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLesson(lesson)
    localStorage.setItem("currentLesson", JSON.stringify(lesson))
  }

  const lessonMaterials = {
    [currentLesson?.id || "default"]: [
      { id: 1, name: "Introduction Slides.pdf", size: "2.5 MB" },
      { id: 2, name: "Getting Started Guide.pdf", size: "1.8 MB" },
    ],
  }
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    )
  }
  if (error) {
    return (
      <Box p={4}>
        <Alert severity="error">
          Failed to load course content. Please try again later.
        </Alert>
      </Box>
    )
  }

  return (
    <Box>
      <MainCard>
        <Grid container>
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="h5"
                    component="h1"
                    fontWeight="bold"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    {data?.courseName || "Classroom"}
                    <span
                      role="img"
                      aria-label="cool emoji"
                      style={{ marginLeft: 8 }}
                    >
                      😎
                    </span>
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {data?.target}
                  </Typography>
                </Box>
                <Chip
                  color="primary"
                  size="small"
                  sx={{
                    borderRadius: 28,
                    px: 3,
                  }}
                  label={data?.category}
                />
              </Box>
              <ContentContainer>
                <LessonContent lesson={currentLesson} />
              </ContentContainer>

              <Box sx={{ mb: 3 }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant="fullWidth"
                  sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    mb: 2,
                  }}
                >
                  <Tab
                    icon={<NoteAltOutlined fontSize="small" />}
                    label="Notes"
                    iconPosition="start"
                  />
                  <Tab
                    icon={<FolderOutlined fontSize="small" />}
                    label="Materials"
                    iconPosition="start"
                  />
                </Tabs>

                <TabPanel value={tabValue} index={1}>
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Your Notes
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      Take notes during the course to help with your learning.
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={6}
                      placeholder="Add your notes here..."
                      variant="outlined"
                    />
                    <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                      Save Notes
                    </Button>
                  </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Materials
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      Download resources for the currently selected lesson.
                    </Typography>

                    {(lessonMaterials[currentLesson?.id] || []).map((item) => (
                      <MaterialItem key={item.id}>
                        <Box>
                          <Typography variant="body2">{item.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.size}
                          </Typography>
                        </Box>
                        <IconButton size="small">
                          <CloudDownload fontSize="small" />
                        </IconButton>
                      </MaterialItem>
                    ))}

                    {!lessonMaterials[
                      currentLesson?.id as keyof typeof lessonMaterials
                    ] && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: "center", py: 2 }}
                      >
                        No materials available for this lesson.
                      </Typography>
                    )}
                  </Box>
                </TabPanel>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={{ bgcolor: "grey.50" }}>
            <Box sx={{ p: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  fontWeight="medium"
                  sx={{ mb: 0.5 }}
                >
                  10% Complete
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={10}
                  sx={{
                    height: 4,
                    borderRadius: 1,
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#f48fb1",
                    },
                  }}
                />
              </Box>

              <ContentCard
                topics={data?.curriculum?.topic || []}
                currentLessonId={currentLesson?.id}
                handleSelect={handleLessonSelect}
              />
            </Box>
          </Grid>
        </Grid>
      </MainCard>

      <FooterLte />
    </Box>
  )
}
export default function ClassroomPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClassroomPage />
    </Suspense>
  )
}
