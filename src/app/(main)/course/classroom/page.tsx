"use client"
import React, { Suspense, useEffect, useState, useMemo } from "react"
import {
  Box,
  Grid,
  CircularProgress,
  Alert,
  LinearProgress,
  Typography,
} from "@mui/material"
import FooterLte from "@/components/layout/FooterLte"
import { useSearchParams } from "next/navigation"
import { useQuery } from "react-query"
import { fetchCourse, userQuizScores, getCourseProgress } from "@/app/api/rest"
import ContentCard from "@/components/classroom/ContentCard"
import LessonContent from "@/components/classroom/LessonContent"
import { useSession } from "next-auth/react"
import {
  ContentContainer,
  MainCard,
} from "@/components/classroom/StyledComponents"
import LessonHead from "@/components/classroom/LessonHead"
import {
  LessonDto,
  LessonMaterial,
  CourseProgressResponse,
  LessonProgressData,
} from "@/types/types"
import useQuizSummary from "@/hooks/useQuizSummary"
import LessonResources from "@/components/classroom/LessonResources"
import { useLessonProgress } from "@/hooks/useLessonProgressB"

const ClassroomPage = () => {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const id = searchParams?.get("courseId")

  const [tabValue, setTabValue] = useState(0)
  const [currentLesson, setCurrentLesson] = useState<LessonDto | null>(null)
  const [currentTopicId, setCurrentTopicId] = useState<string | null>(null)

  // Fetch course data
  const { data, isLoading, error } = useQuery({
    queryKey: ["course", id, session?.user?.id],
    queryFn: () => fetchCourse(id as string, session?.user?.id as string),
    refetchOnWindowFocus: false,
    enabled: !!id && !!session?.user?.id,
  })

  const { data: userScores } = useQuery({
    queryFn: () => userQuizScores(session?.user?.id as string),
    queryKey: ["userQuizScores", session?.user?.id],
    enabled: !!session?.user?.id,
  })

  const {
    data: courseProgressData,
    isLoading: isLoadingProgress,
    error: progressError,
  } = useQuery<CourseProgressResponse | null>({
    queryKey: ["courseProgress", id],
    queryFn: () => getCourseProgress(id as string),
    enabled: !!id && !!session?.user?.id,
    refetchOnWindowFocus: false,
  })

  const { markLessonStarted, markLessonComplete, updateProgress, isUpdating } =
    useLessonProgress({
      courseId: id as string,
      userId: session?.user?.id as string,
    })

  const { courseQuiz } = useQuizSummary({ courseId: id as string })

  useEffect(() => {
    if (data?.curriculum?.topic && !currentLesson) {
      const firstTopic = data.curriculum.topic[0]
      const firstLesson = firstTopic?.lessons[0]

      if (firstLesson && firstTopic) {
        setCurrentLesson(firstLesson)
        setCurrentTopicId(firstTopic.id)
      }
    }
  }, [data, currentLesson])

  // Handle lesson selection and track progress
  const handleLessonSelect = (lesson: LessonDto, topicId: string) => {
    if (lesson.id && topicId) {
      // Mark lesson as started when selected
      markLessonStarted(lesson.id, topicId)
    }
    setCurrentLesson(lesson)
    setCurrentTopicId(topicId)
  }

  // Calculate overall course progress
  const courseProgress = useMemo(() => {
    if (!courseProgressData) return 0
    return Math.round(courseProgressData.overallProgressPercentage || 0)
  }, [courseProgressData])

  const progressDataForCard = useMemo((): LessonProgressData[] => {
    if (!courseProgressData?.topics) return []

    return courseProgressData.topics
      .filter(
        (topic) =>
          topic && Array.isArray(topic.lessons) && topic.lessons.length > 0
      )
      .flatMap((topic) =>
        topic.lessons.map(
          (lesson): LessonProgressData => ({
            id: lesson.id,
            studentId: lesson.studentId,
            lessonId: lesson.lessonId,
            topicId: lesson.topicId,
            courseId: lesson.courseId,
            completionPercentage: lesson.progressPercentage,
            completed: lesson.completed,
            lastAccessedAt: lesson.lastAccessedAt,
            completedAt: lesson.completedAt,
            timeSpent: lesson.timeSpent,
          })
        )
      )
  }, [courseProgressData])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const lessonMaterials: LessonMaterial[] = []

  if (isLoading || isLoadingProgress) {
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

  if (error || progressError) {
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
              <LessonHead data={data} />

              {/* Course Progress Bar */}
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2" fontWeight="medium">
                    {courseProgress}% Complete
                  </Typography>
                  {isUpdating && (
                    <Typography variant="caption" color="text.secondary">
                      Saving...
                    </Typography>
                  )}
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={courseProgress}
                  sx={{
                    height: 6,
                    borderRadius: 1,
                    backgroundColor: "grey.200",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor:
                        courseProgress === 100
                          ? "success.main"
                          : "primary.main",
                      borderRadius: 1,
                      transition: "background-color 0.3s ease",
                    },
                  }}
                />
                {courseProgressData && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {courseProgressData.completedLessons} of{" "}
                    {courseProgressData.totalLessons} lessons completed
                  </Typography>
                )}
              </Box>

              <ContentContainer>
                {session?.user?.id && currentLesson && currentTopicId && (
                  <LessonContent
                    lesson={currentLesson}
                    userId={session?.user?.id}
                    onComplete={() => {
                      if (currentLesson.id && currentTopicId) {
                        markLessonComplete(currentLesson.id, currentTopicId)
                      }
                    }}
                    onProgress={(percentage: number) => {
                      if (currentLesson.id && currentTopicId) {
                        updateProgress(
                          currentLesson.id,
                          currentTopicId,
                          percentage
                        )
                      }
                    }}
                  />
                )}
              </ContentContainer>

              {currentLesson && (
                <LessonResources
                  lessonMaterials={lessonMaterials}
                  currentLesson={currentLesson}
                  tabValue={tabValue}
                  setTabValue={setTabValue}
                  handleTabChange={handleTabChange}
                  userID={session?.user?.id || ""}
                />
              )}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }} sx={{ bgcolor: "grey.50" }}>
            <Box sx={{ p: 3 }}>
              <ContentCard
                topics={data?.curriculum?.topic || []}
                currentLessonId={currentLesson?.id}
                handleSelect={handleLessonSelect}
                quizSummary={courseQuiz || []}
                courseId={id || ""}
                progress={progressDataForCard}
                userScores={userScores}
                courseProgressData={courseProgressData}
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
