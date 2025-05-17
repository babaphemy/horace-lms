"use client"
import React, { useEffect, useState } from "react"
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  TextField,
  Grid,
  Paper,
  IconButton,
  Divider,
  LinearProgress,
  Stack,
  styled,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from "@mui/material"
import {
  Favorite,
  Comment,
  Share,
  CloudDownload,
  ChevronRight,
  StarRate,
  DescriptionOutlined,
  NoteAltOutlined,
  FolderOutlined,
} from "@mui/icons-material"
import Header from "@/components/Header"
import FooterLte from "@/components/layout/FooterLte"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useQuery } from "react-query"
import { fetchLMS } from "@/app/api/rest"
import ContentCard, { Lesson } from "@/components/classroom/ContentCard"
import LessonContent from "@/components/classroom/LessonContent"

const MainCard = styled(Card)(({ theme }) => ({
  borderRadius: 24,
  overflow: "hidden",
  boxShadow: theme.shadows[3],
  maxWidth: 1200,
  margin: "0 auto",
}))
const ContentContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  marginBottom: theme.spacing(3),
}))

const MaterialItem = styled(Paper)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.grey[100],
  marginBottom: theme.spacing(1),
}))

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
  const searchParams = useSearchParams()
  const id = searchParams?.get("courseId")
  const [tabValue, setTabValue] = useState(0)
  const { data, isLoading, error } = useQuery({
    queryKey: ["course", id],
    queryFn: () => fetchLMS(id as string),
    refetchOnWindowFocus: false,
    enabled: !!id,
  })
  const [currentLesson, setCurrentLesson] = React.useState(
    data?.topics[0]?.lessons[0]
  )
  useEffect(() => {
    if (data?.topics?.length > 0 && data.topics[0]?.lessons?.length > 0) {
      setCurrentLesson(data.topics[0].lessons[0])
    }
  }, [data])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLesson(lesson)
  }

  const lessonMaterials = {
    "68201835ae6e6825ed5e56c8": [
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
      <Header />
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
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{
                    borderRadius: 28,
                    px: 3,
                  }}
                >
                  {data?.category}
                </Button>
              </Box>
              <ContentContainer>
                <LessonContent lesson={currentLesson} />
              </ContentContainer>

              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip label="OOP" size="small" />
                    <Chip label="Java" size="small" />
                  </Stack>

                  <Typography variant="h6" fontWeight="bold">
                    {data?.courseName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {data?.brief}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Box sx={{ display: "flex" }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarRate
                          key={star}
                          fontSize="small"
                          sx={{ color: "gold" }}
                        />
                      ))}
                    </Box>
                    <Typography variant="body2" sx={{ ml: 0.5 }}>
                      (5.0)
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      • HOW STUDENTS RATE THIS COURSE
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    4000 STUDENTS
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {`CREATED BY: ${data?.author?.firstname} ${data?.author?.lastname}`}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Stack direction="row" spacing={3}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <IconButton size="small">
                          <Favorite fontSize="small" />
                        </IconButton>
                        <Typography variant="caption">23K</Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <IconButton size="small">
                          <Comment fontSize="small" />
                        </IconButton>
                        <Typography variant="caption">Comments</Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <IconButton size="small">
                          <Share fontSize="small" />
                        </IconButton>
                        <Typography variant="caption">Share</Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <IconButton size="small">
                          <CloudDownload fontSize="small" />
                        </IconButton>
                        <Typography variant="caption">Download</Typography>
                      </Box>
                    </Stack>
                    <Link href={`/course/${id}`} passHref>
                      <Button
                        variant="text"
                        color="primary"
                        size="small"
                        endIcon={<ChevronRight />}
                      >
                        LEARN MORE
                      </Button>
                    </Link>
                  </Box>
                </CardContent>
              </Card>

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
                    icon={<DescriptionOutlined fontSize="small" />}
                    label="Overview"
                    iconPosition="start"
                  />
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

                <TabPanel value={tabValue} index={0}>
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Course Overview
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {data?.overview}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      Kotlin is a modern programming language that makes
                      developers happier. It's concise, safe, interoperable with
                      Java, and offers many ways to reuse code between multiple
                      platforms.
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                      What you'll learn:
                    </Typography>
                    <ul style={{ paddingLeft: "20px" }}>
                      <li>
                        <Typography variant="body2" color="text.secondary">
                          Kotlin syntax and fundamentals
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2" color="text.secondary">
                          Object-oriented programming with Kotlin
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2" color="text.secondary">
                          Functional programming concepts
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2" color="text.secondary">
                          Building Android applications with Kotlin
                        </Typography>
                      </li>
                    </ul>
                  </Box>
                </TabPanel>

                {/* Notes Panel */}
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

                {/* Materials Panel */}
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
                topics={data.topics}
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

export default ClassroomPage
