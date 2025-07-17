import {
  Alert,
  Box,
  Button,
  IconButton,
  styled,
  Typography,
} from "@mui/material"
import { Lesson } from "./ContentCard"
import {
  CloudDownload,
  Code,
  Comment,
  Favorite,
  PictureAsPdf,
  PlayCircle,
  Share,
} from "@mui/icons-material"
import VideoPlaceholderSVG from "../lms/VideoPlaceholderSVG"
import ReactPlayer from "react-player"
import Image from "next/image"
import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import { throttle } from "lodash"

const PdfViewer = dynamic(() => import("./PdfViewer"), {
  ssr: false,
  loading: () => <div>Loading PDF viewer...</div>,
})

interface HTMLLessonProps {
  lesson: {
    content?: string
  }
}

const streamUrl =
  process.env.NEXT_PUBLIC_STREAM_URL || "https://horacelms.com/stream"

const HTMLLesson: React.FC<HTMLLessonProps> = ({ lesson }) => {
  return (
    <DocumentContainer>
      <HTMLContent>
        {lesson.content ? (
          <div
            className="lesson-html-content"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
        ) : (
          <Typography variant="body1" color="text.secondary" align="center">
            No content available for this lesson.
          </Typography>
        )}
      </HTMLContent>
    </DocumentContainer>
  )
}

const VideoPlaceholder = styled(Box)(({ theme }) => ({
  position: "relative",
  aspectRatio: "16/9",
  backgroundColor: "black",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
}))

const DocumentContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  minHeight: "400px",
  display: "flex",
  width: "100%",
  flexDirection: "column",
  boxSizing: "border-box",
}))

const HTMLContent = styled(Box)(() => ({
  flex: 1,
  width: "100%",
  overflow: "auto",
  "& img": {
    maxWidth: "100%",
    height: "auto",
  },

  "& > *": {
    maxWidth: "100%",
  },

  "& div, & section, & article, & main": {
    width: "100%",
    maxWidth: "100%",
    margin: "0",
    boxSizing: "border-box",
  },
}))

const PDFPreview = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4),
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.shape.borderRadius,
  minHeight: "400px",
  border: `1px solid ${theme.palette.grey[300]}`,
}))

const VideoControls = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1, 2),
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  color: "white",
}))

const ProgressIndicator = styled(Box)(({ theme }) => ({
  width: 80,
  height: 4,
  backgroundColor: "rgba(255, 255, 255, 0.3)",
  borderRadius: theme.shape.borderRadius,
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
}))

const ProgressFill = styled(Box)({
  width: "30%",
  height: "100%",
  backgroundColor: "white",
  borderRadius: "inherit",
})

const getFileExtension = (url: string): string => {
  if (!url) return ""

  // Remove query parameters and hash
  const cleanUrl = url.split("?")[0].split("#")[0]

  // Extract file extension
  const extension = cleanUrl.split(".").pop()?.toLowerCase() || ""

  return extension
}

// Helper function to determine content type based on file extension
const getContentType = (lesson: Lesson): string => {
  if (lesson.type?.toLowerCase() === "video" || lesson.video) {
    return "video"
  }
  if (!lesson.content) {
    return lesson.type?.toLowerCase() || "unknown"
  }

  const extension = getFileExtension(lesson.content)

  // Map file extensions to content types
  switch (extension) {
    case "pdf":
      return "pdf"
    case "doc":
    case "docx":
      return "document"
    case "ppt":
    case "pptx":
      return "document"
    case "xls":
    case "xlsx":
      return "document"
    case "txt":
      return "text"
    case "html":
    case "htm":
      return "html"
    case "js":
    case "jsx":
    case "ts":
    case "tsx":
    case "py":
    case "java":
    case "cpp":
    case "c":
    case "css":
    case "scss":
    case "json":
    case "xml":
      return "code"
    case "mp4":
    case "avi":
    case "mov":
    case "wmv":
    case "flv":
    case "webm":
      return "video"
    case "mp3":
    case "wav":
    case "ogg":
    case "m4a":
      return "audio"
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "bmp":
    case "svg":
      return "image"
    default:
      // Fall back to lesson type if extension is unknown
      return lesson.type?.toLowerCase() || "unknown"
  }
}

const LessonContent = ({ lesson }: { lesson: Lesson }) => {
  const [currentTime, setCurrentTime] = useState(0)

  const [isReady, setIsReady] = useState(false)

  const playerRef = useRef<ReactPlayer>(null)
  const [shouldPlayAfterSeek, setShouldPlayAfterSeek] = useState(false)

  const throttledSaveProgress = throttle((id: string, time: number) => {
    localStorage.setItem(`videoProgress_${id}`, time.toString())
  }, 1000)

  //? save progress
  const saveProgress = (time: number) => {
    if (lesson?.id) {
      throttledSaveProgress(lesson.id, time)
    }
  }

  //? get saved progress

  useEffect(() => {
    if (lesson?.id && getContentType(lesson) === "video") {
      const savedProgress = localStorage.getItem(`videoProgress_${lesson.id}`)
      if (savedProgress) {
        const time = parseFloat(savedProgress)
        setCurrentTime(time)
        setShouldPlayAfterSeek(true)
      } else {
        setCurrentTime(0)
      }
      setIsReady(false)
    }
  }, [lesson])

  //? Seek to saved position when player is ready
  useEffect(() => {
    if (isReady && playerRef.current && currentTime > 0) {
      playerRef.current.seekTo(currentTime, "seconds")

      setTimeout(() => {
        if (shouldPlayAfterSeek) {
          playerRef.current?.getInternalPlayer()?.play()
        }
      }, 500)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, shouldPlayAfterSeek])

  //? progress update
  const handleProgress = (state: { playedSeconds: number }) => {
    setCurrentTime(state.playedSeconds)

    saveProgress(state.playedSeconds)
  }

  //?  when video ends
  const handleEnded = () => {
    if (lesson?.id) {
      localStorage.removeItem(`videoProgress_${lesson.id}`)
      setCurrentTime(0)
    }
  }

  const handleReady = () => {
    setIsReady(true)
  }

  if (!lesson) {
    return (
      <Alert severity="info">
        Please select a lesson from the content menu.
      </Alert>
    )
  }

  const contentType = getContentType(lesson)

  switch (contentType) {
    case "video":
      return (
        <VideoPlaceholder>
          {lesson.id ? (
            <ReactPlayer
              key={lesson.id}
              ref={playerRef}
              url={`${streamUrl}/${lesson.id}`}
              width="100%"
              height="100%"
              controls={true}
              onProgress={handleProgress}
              onEnded={handleEnded}
              progressInterval={1000}
              onReady={handleReady}
              loop={true}
              playing={true}
              played={currentTime}
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
            <>
              <VideoPlaceholderSVG title={lesson?.title || ""} />
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconButton
                  sx={{
                    color: "white",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                    },
                  }}
                >
                  <PlayCircle sx={{ fontSize: 60 }} />
                </IconButton>
              </Box>
              <VideoControls>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <PlayCircle fontSize="small" />
                  <ProgressIndicator>
                    <ProgressFill />
                  </ProgressIndicator>
                  <Typography variant="caption">00:43 / 12:31</Typography>
                </Box>
                <Box>
                  <IconButton size="small" sx={{ color: "white" }}>
                    <Favorite fontSize="small" />
                  </IconButton>
                  <IconButton size="small" sx={{ color: "white" }}>
                    <Comment fontSize="small" />
                  </IconButton>
                  <IconButton size="small" sx={{ color: "white" }}>
                    <Share fontSize="small" />
                  </IconButton>
                </Box>
              </VideoControls>
            </>
          )}
        </VideoPlaceholder>
      )

    case "pdf":
    case "document":
      const documentUrl = `${process.env.NEXT_PUBLIC_HORACE}stream/document/${lesson.id}`
      return (
        <PDFPreview>
          {lesson.id ? (
            <>
              <PdfViewer url={documentUrl} />
            </>
          ) : (
            <>
              <PictureAsPdf sx={{ fontSize: 60, color: "#f44336", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                {lesson.title || "PDF Document"}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                No PDF content available
              </Typography>
            </>
          )}
        </PDFPreview>
      )

    case "text":
    case "html":
      return <HTMLLesson lesson={lesson} />

    case "code":
      return (
        <DocumentContainer
          sx={{ fontFamily: "monospace", bgcolor: "#282c34", color: "#f8f8f2" }}
        >
          <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
            <Code sx={{ mr: 1 }} />
            <Typography variant="subtitle1">
              {lesson.title || "Code Example"}
            </Typography>
          </Box>
          <Box
            component="pre"
            sx={{
              overflow: "auto",
              p: 2,
              borderRadius: 1,
              bgcolor: "#1e1e1e",
              color: "#d4d4d4",
              fontSize: "0.9rem",
              flex: 1,
            }}
          >
            {lesson.content || "// No code content available"}
          </Box>
        </DocumentContainer>
      )

    case "audio":
      return (
        <DocumentContainer>
          <Typography variant="h6" gutterBottom>
            {lesson.title || "Audio Content"}
          </Typography>
          {lesson.content ? (
            <Box sx={{ mt: 2 }}>
              <audio controls style={{ width: "100%" }}>
                <source src={lesson.content} />
                Your browser does not support the audio element.
              </audio>
            </Box>
          ) : (
            <Typography variant="body1" color="text.secondary" align="center">
              No audio content available.
            </Typography>
          )}
        </DocumentContainer>
      )

    case "image":
      return (
        <DocumentContainer>
          <Typography variant="h6" gutterBottom>
            {lesson.title || "Image Content"}
          </Typography>
          {lesson.content ? (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Image
                src={lesson.content}
                alt={lesson.title || "Lesson image"}
                layout="responsive"
                width={700}
                height={475}
              />
            </Box>
          ) : (
            <Typography variant="body1" color="text.secondary" align="center">
              No image content available.
            </Typography>
          )}
        </DocumentContainer>
      )

    default:
      // Default case for unknown content types
      return (
        <DocumentContainer>
          <Typography variant="h6" gutterBottom>
            {lesson.title || "Lesson Content"}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Content type: {contentType || "unknown"}
          </Typography>
          {lesson.content ? (
            <Box>
              <Typography variant="body2" color="text.secondary" mb={2}>
                File extension not recognized. You can download the file below:
              </Typography>
              <Button
                variant="contained"
                startIcon={<CloudDownload />}
                href={lesson.content}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download File
              </Button>
            </Box>
          ) : (
            <Typography variant="body1" color="text.secondary" align="center">
              No content available for this lesson.
            </Typography>
          )}
        </DocumentContainer>
      )
  }
}

export default LessonContent
