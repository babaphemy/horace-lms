"use client"
import React, { Suspense, useEffect, useState } from "react"
import { Box, Grid, CircularProgress, Alert } from "@mui/material"
import FooterLte from "@/components/layout/FooterLte"
import { useQuery } from "react-query"
import { courseAccessToken, fetchCourse } from "@/app/api/rest"
import ContentCard, { Lesson } from "@/components/classroom/ContentCard"
import LessonContent from "@/components/classroom/LessonContent"
import {
  ContentContainer,
  MainCard,
} from "@/components/classroom/StyledComponents"
import LessonHead from "@/components/classroom/LessonHead"
import LessonResources, {
  LessonMaterial,
} from "@/components/classroom/LessonResources"
import { useLessonProgress } from "@/hooks/useLessonProgress"
import { LessonDto, TopicDto } from "@/types/types"

const ClassroomPage = () => {
  const [tabValue, setTabValue] = useState(0)

  const { data: userToken, isLoading: tokenLoading } = useQuery({
    queryKey: ["userToken"],
    queryFn: courseAccessToken,
    refetchOnWindowFocus: false,
  })
  const { data, isLoading, error } = useQuery({
    queryKey: ["course", userToken?.courseId, userToken?.userId],
    queryFn: () =>
      fetchCourse(userToken?.courseId as string, userToken?.userId as string),
    refetchOnWindowFocus: false,
    enabled: !!userToken?.userId && !!userToken?.courseId,
  })

  const [currentLesson, setCurrentLesson] = React.useState(
    data?.curriculum?.topic[0]?.lessons[0]
  )
  const { progress, saveALessonProgress } = useLessonProgress({
    lessonId: currentLesson?.id,
    userId: userToken?.userId || "",
  })

  const handleLessonSelect = (lesson: Lesson) => {
    saveALessonProgress(lesson.id)
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
  if (isLoading || tokenLoading) {
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
  if (error || !userToken) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        p={4}
      >
        <Alert severity="error">Access denied! Please login to continue.</Alert>
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
                {userToken?.userId && currentLesson && (
                  <LessonContent
                    lesson={currentLesson}
                    userId={userToken?.userId}
                  />
                )}
              </ContentContainer>
              <LessonResources
                lessonMaterials={lessonMaterials}
                currentLesson={currentLesson}
                tabValue={tabValue}
                setTabValue={setTabValue}
                handleTabChange={handleTabChange}
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={{ bgcolor: "grey.50" }}>
            <Box sx={{ p: 3 }}>
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
