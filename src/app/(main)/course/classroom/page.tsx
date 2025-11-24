"use client"
import React, { Suspense, useEffect, useState } from "react"
import { Box, Grid, CircularProgress, Alert } from "@mui/material"
import FooterLte from "@/components/layout/FooterLte"
import { useSearchParams } from "next/navigation"
import { useQuery } from "react-query"
import { fetchCourse, userQuizScores } from "@/app/api/rest"
import ContentCard from "@/components/classroom/ContentCard"
import LessonContent from "@/components/classroom/LessonContent"
import { useSession } from "next-auth/react"
import {
  ContentContainer,
  MainCard,
} from "@/components/classroom/StyledComponents"
import LessonHead from "@/components/classroom/LessonHead"
import { useLessonProgress } from "@/hooks/useLessonProgress"
import { LessonDto, LessonMaterial, TopicDto } from "@/types/types"
import useQuizSummary from "@/hooks/useQuizSummary"
import LessonResources from "@/components/classroom/LessonResources"

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

  const { data: userScores } = useQuery({
    queryFn: () => userQuizScores(session?.user?.id as string),
    queryKey: ["userQuizScores", session?.user?.id],
    enabled: !!session?.user?.id,
  })

  const [currentLesson, setCurrentLesson] = React.useState(
    data?.curriculum?.topic[0]?.lessons[0]
  )
  const { courseQuiz } = useQuizSummary({ courseId: id as string })

  const { progress, saveALessonProgress } = useLessonProgress({
    lessonId: currentLesson?.id,
    userId: session?.user?.id || "",
  })

  const handleLessonSelect = (lesson: LessonDto) => {
    if (lesson.id) {
      saveALessonProgress(lesson.id)
    }
    setCurrentLesson(lesson)
  }
  useEffect(() => {
    if (
      data?.curriculum?.topic?.length > 0 &&
      data.curriculum.topic[0]?.lessons?.length > 0
    ) {
      const progressLessonId = progress?.progress?.[0]?.lessonId
      const allLessons = data.curriculum.topic.flatMap(
        (topic: TopicDto) => topic.lessons || []
      )
      const matchedLesson = allLessons.find(
        (lesson: LessonDto) => lesson.id === progressLessonId
      )
      setCurrentLesson(matchedLesson || allLessons[0])
    }
  }, [data, progress])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const lessonMaterials: LessonMaterial[] = []
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
              <LessonHead data={data} />
              <ContentContainer>
                {session?.user?.id && currentLesson && (
                  <LessonContent
                    lesson={currentLesson}
                    userId={session?.user?.id}
                  />
                )}
              </ContentContainer>
              <LessonResources
                lessonMaterials={lessonMaterials}
                currentLesson={currentLesson}
                tabValue={tabValue}
                setTabValue={setTabValue}
                handleTabChange={handleTabChange}
                userID={session?.user?.id || ""}
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={{ bgcolor: "grey.50" }}>
            <Box sx={{ p: 3 }}>
              {/* <Box sx={{ mb: 3 }}>
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
              </Box> */}

              <ContentCard
                topics={data?.curriculum?.topic || []}
                currentLessonId={currentLesson?.id}
                handleSelect={handleLessonSelect}
                quizSummary={courseQuiz || []}
                courseId={id || ""}
                progress={progress?.progress || []}
                userScores={userScores}
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
