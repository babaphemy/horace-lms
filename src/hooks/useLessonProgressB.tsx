import { useState, useCallback } from "react"
import { useMutation, useQueryClient } from "react-query"
import {
  updateLessonProgress as updateLessonProgressAPI,
  markLessonComplete as markLessonCompleteAPI,
} from "@/app/api/rest"
import { LessonProgressRequest } from "@/types/types"
import { toast } from "react-toastify"

interface UseLessonProgressProps {
  courseId: string
  userId?: string // Not needed for API calls but kept for compatibility
}

interface LessonProgressUpdate {
  lessonId: string
  topicId: string
  percentage: number
  timeSpent?: number
}

export const useLessonProgress = ({ courseId }: UseLessonProgressProps) => {
  const queryClient = useQueryClient()
  const [currentProgress, setCurrentProgress] = useState<{
    [lessonId: string]: number
  }>({})

  const progressMutation = useMutation({
    mutationFn: async ({
      lessonId,
      topicId,
      percentage,
      timeSpent,
    }: LessonProgressUpdate) => {
      const request: LessonProgressRequest = {
        lessonId,
        topicId,
        courseId,
        progressPercentage: percentage,
        completed: percentage === 100,
        timeSpent,
      }
      return updateLessonProgressAPI(request)
    },
    onSuccess: (data) => {
      setCurrentProgress((prev) => ({
        ...prev,
        [data.lessonId]: data.completionPercentage,
      }))

      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries(["courseProgress", courseId])
      queryClient.invalidateQueries(["course", courseId])
      queryClient.invalidateQueries(["studentProgress"])
    },
    onError: () => {
      toast.error("Failed to update lesson progress")
    },
  })

  const completeMutation = useMutation({
    mutationFn: async ({
      lessonId,
      topicId,
    }: {
      lessonId: string
      topicId: string
    }) => {
      return markLessonCompleteAPI(lessonId, topicId, courseId)
    },
    onSuccess: (data) => {
      setCurrentProgress((prev) => ({
        ...prev,
        [data.lessonId]: 100,
      }))

      queryClient.invalidateQueries(["courseProgress", courseId])
      queryClient.invalidateQueries(["course", courseId])
      queryClient.invalidateQueries(["studentProgress"])
    },
    onError: () => {
      toast.error("Failed to mark lesson complete")
    },
  })

  const markLessonStarted = useCallback(
    (lessonId: string, topicId: string) => {
      const existingProgress = currentProgress[lessonId]

      if (existingProgress === undefined || existingProgress === 0) {
        progressMutation.mutate({
          lessonId,
          topicId,
          percentage: 0,
        })
      }
    },
    [currentProgress, progressMutation]
  )

  const updateProgress = useCallback(
    (
      lessonId: string,
      topicId: string,
      percentage: number,
      timeSpent?: number
    ) => {
      const validPercentage = Math.min(Math.max(percentage, 0), 100)

      setCurrentProgress((prev) => ({
        ...prev,
        [lessonId]: validPercentage,
      }))

      progressMutation.mutate({
        lessonId,
        topicId,
        percentage: validPercentage,
        timeSpent,
      })
    },
    [progressMutation]
  )

  const markLessonComplete = useCallback(
    (lessonId: string, topicId: string) => {
      setCurrentProgress((prev) => ({
        ...prev,
        [lessonId]: 100,
      }))

      completeMutation.mutate({ lessonId, topicId })
    },
    [completeMutation]
  )

  return {
    currentProgress,
    markLessonStarted,
    updateProgress,
    markLessonComplete,
    isUpdating: progressMutation.isLoading || completeMutation.isLoading,
    error: progressMutation.error || completeMutation.error,
  }
}
