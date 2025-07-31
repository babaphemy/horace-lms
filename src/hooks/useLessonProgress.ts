import { useMutation, useQuery, useQueryClient } from "react-query"
import { useRef, useState } from "react"
import {
  LessonProgress,
  VideoProgress,
} from "@/components/classroom/VideoPlayerWithProgress"
import {
  getUserProgress,
  saveLessonProgress,
  saveMyProgress,
} from "@/app/api/rest"

interface UseLessonProgressProps {
  lessonId?: string
  userId: string
}

export function useLessonProgress({
  lessonId,
  userId,
}: UseLessonProgressProps) {
  const [playerReady, setPlayerReady] = useState(false)
  const queryClient = useQueryClient()
  const lastSavedTimeRef = useRef(0)

  const { data: progress, isLoading: isLoaded } = useQuery({
    queryKey: ["progress", userId],
    queryFn: () => getUserProgress(userId),
    enabled: !!userId,
  })

  const { mutate: saveUserProgress } = useMutation({
    mutationFn: saveMyProgress,
    onSuccess: () => {
      queryClient.invalidateQueries(["progress", lessonId, userId])
    },
  })
  const { mutate: saveMyLessonProgress } = useMutation({
    mutationFn: saveLessonProgress,
    onSuccess: () => {
      queryClient.invalidateQueries(["progress", lessonId, userId])
    },
  })
  const saveALessonProgress = (lid: string) => {
    const progressData: LessonProgress = {
      lessonId: lid,
      userId,
      completionPercentage: 0,
      lastWatched: new Date().toISOString(),
    }
    saveMyLessonProgress(progressData)
  }

  const saveProgress = (currentTime: number, duration: number) => {
    if (!lessonId || !userId || duration === 0) return

    const completionPercentage = Math.min((currentTime / duration) * 100, 100)
    const timeDiff = Math.abs(currentTime - lastSavedTimeRef.current)
    if (timeDiff < 5 && completionPercentage < 100) return

    const progressData: VideoProgress = {
      lessonId,
      userId,
      currentTime: currentTime,
      duration,
      completionPercentage,
      lastWatched: new Date().toISOString(),
    }
    saveUserProgress(progressData)
    lastSavedTimeRef.current = currentTime
  }

  return {
    progress,
    isLoaded,
    saveProgress,
    saveALessonProgress,
    playerReady,
    setPlayerReady,
  }
}
