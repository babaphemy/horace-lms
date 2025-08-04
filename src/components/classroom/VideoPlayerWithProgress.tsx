"use client"
import { useLessonProgress } from "@/hooks/useLessonProgress"
import React, { useEffect, useRef, useState } from "react"
import ReactPlayer from "react-player"

interface VideoPlayerProps {
  lesson: {
    id: string
  }
  streamUrl: string
  userId: string
  playerRef: React.RefObject<ReactPlayer>
}

export interface LessonProgress {
  lessonId: string
  userId: string
  completionPercentage: number
  lastWatched: string
}

export interface VideoProgress extends LessonProgress {
  currentTime: number
  duration?: number
}

const VideoPlayerWithProgress: React.FC<VideoPlayerProps> = ({
  lesson,
  streamUrl,
  userId,
  playerRef,
}) => {
  const progressUpdateRef = useRef<NodeJS.Timeout>()

  const [hasSeekingToSavedPosition, setHasSeekingToSavedPosition] =
    useState(false)

  const { saveProgress, progress, isLoaded, playerReady, setPlayerReady } =
    useLessonProgress({
      lessonId: lesson.id,
      userId,
    })
  const handleReady = () => {
    setPlayerReady(true)
  }

  // const handleReady = () => {
  //   if (progress && progress.currentTime > 0 && playerRef.current) {
  //     setTimeout(() => {
  //       playerRef.current?.seekTo(progress.currentTime, "seconds")
  //     }, 100)
  //   }
  // }

  useEffect(() => {
    if (
      playerReady &&
      isLoaded &&
      progress &&
      progress.currentTime > 0 &&
      playerRef.current &&
      !hasSeekingToSavedPosition
    ) {
      // Small delay to ensure player is fully ready
      setTimeout(() => {
        if (playerRef.current) {
          playerRef.current.seekTo(progress.currentTime, "seconds")
          setHasSeekingToSavedPosition(true)
        }
      }, 200)
    }
  }, [playerReady, isLoaded, progress, playerRef, hasSeekingToSavedPosition])

  useEffect(() => {
    setHasSeekingToSavedPosition(false)
    setPlayerReady(false)
  }, [lesson.id, setPlayerReady])

  const handleProgress = ({
    playedSeconds,
  }: {
    playedSeconds: number
    loadedSeconds: number
  }) => {
    if (!isLoaded) return

    const duration = playerRef.current?.getDuration() || 0

    // Debounced save - clear previous timeout
    if (progressUpdateRef.current) {
      clearTimeout(progressUpdateRef.current)
    }

    // Set new timeout for saving progress
    progressUpdateRef.current = setTimeout(() => {
      saveProgress(playedSeconds, duration)
    }, 1000) // Save after 1 second of no updates
  }

  // Handle when video duration is available
  const handleDuration = (duration: number) => {
    if (progress && progress.duration !== duration) {
      // Update duration if it has changed
      saveProgress(progress.currentTime, duration)
    }
  }

  // Handle video end
  const handleEnded = () => {
    const duration = playerRef.current?.getDuration() || 0
    saveProgress(duration, duration) // Mark as 100% complete
  }

  // Handle seeking
  const handleSeek = (seconds: number) => {
    const duration = playerRef.current?.getDuration() || 0
    saveProgress(seconds, duration)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressUpdateRef.current) {
        clearTimeout(progressUpdateRef.current)
      }
    }
  }, [])

  // Get video URL with quality parameter
  const getVideoUrl = () => {
    const quality = "480p" // You can make this configurable
    return `${streamUrl}/${lesson.id}?quality=${quality}`
  }

  return (
    <div className="video-player-container">
      {/* Progress indicator */}
      {progress && progress.completionPercentage > 0 && (
        <div
          className="progress-indicator"
          style={{
            marginBottom: "10px",
            padding: "8px",
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
          }}
        >
          <div style={{ fontSize: "14px", color: "#666" }}>
            Progress: {Math.round(progress.completionPercentage)}% completed
            {progress.completionPercentage < 100 && (
              <span>
                {" "}
                • Resume from {Math.floor(progress.currentTime / 60)}:
                {String(Math.floor(progress.currentTime % 60)).padStart(2, "0")}
              </span>
            )}
          </div>
          <div
            style={{
              width: "100%",
              height: "4px",
              backgroundColor: "#ddd",
              borderRadius: "2px",
              marginTop: "4px",
            }}
          >
            <div
              style={{
                width: `${progress.completionPercentage}%`,
                height: "100%",
                backgroundColor: "#4CAF50",
                borderRadius: "2px",
                transition: "width 0.3s ease",
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Video Player */}
      {lesson.id ? (
        <ReactPlayer
          ref={playerRef}
          url={getVideoUrl()}
          width="100%"
          height="100%"
          controls={true}
          loop={false}
          onReady={handleReady}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onEnded={handleEnded}
          onSeek={handleSeek}
          config={{
            file: {
              attributes: {
                controlsList: "nodownload",
                defer: true,
              },
            },
          }}
        />
      ) : (
        <div>No lesson selected</div>
      )}
    </div>
  )
}

export default VideoPlayerWithProgress
