import {
  Alert,
  Box,
  Button,
  IconButton,
  styled,
  Typography,
} from "@mui/material"
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
import Image from "next/image"
import dynamic from "next/dynamic"
import VideoPlayerWithProgress from "./VideoPlayerWithProgress"
import ReactPlayer from "react-player"
import { useEffect, useRef } from "react"
import { LessonDto } from "@/types/types"

const PdfViewer = dynamic(() => import("./PdfViewer"), {
  ssr: false,
  loading: () => <div>Loading PDF viewer...</div>,
})

interface LessonContentProps {
  lesson: LessonDto
  userId: string
  onComplete?: () => void
  onProgress?: (_percentage: number) => void
}

interface HTMLLessonProps {
  lesson: {
    content?: string
  }
  onComplete?: () => void
}

const streamUrl =
  process.env.NEXT_PUBLIC_STREAM_URL || "https://horacelms.com/stream2"

const HTMLLesson: React.FC<HTMLLessonProps> = ({ lesson, onComplete }) => {
  const hasMarkedComplete = useRef(false)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (lesson.content && onCompleteRef.current && !hasMarkedComplete.current) {
      const timer = setTimeout(() => {
        onCompleteRef.current?.()
        hasMarkedComplete.current = true // Set flag to prevent re-runs
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [lesson.content])

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

const getContentType = (lesson: LessonDto): string => {
  const extension = lesson.extension?.toLowerCase() || ""
  if (lesson?.type?.toLowerCase() === "video" || lesson.video) {
    return "video"
  }
  return extension || "unknown"
}

const LessonContent: React.FC<LessonContentProps> = ({
  lesson,
  userId,
  onComplete,
  onProgress,
}) => {
  const playerRef = useRef<ReactPlayer>(null)
  const hasMarkedComplete = useRef(false)
  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    hasMarkedComplete.current = false
  }, [lesson.id])

  useEffect(() => {
    const contentType = getContentType(lesson)

    // For non-video content, mark as complete after viewing
    if (
      contentType !== "video" &&
      lesson.id &&
      onCompleteRef.current &&
      !hasMarkedComplete.current
    ) {
      const timer = setTimeout(() => {
        onCompleteRef.current?.()
        hasMarkedComplete.current = true
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [lesson])

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
            <VideoPlayerWithProgress
              lesson={{ ...lesson, id: lesson.id as string }}
              streamUrl={streamUrl}
              userId={userId}
              playerRef={playerRef}
              onProgress={(progress) => {
                const percentage = Math.round(progress * 100)
                onProgress?.(percentage)
              }}
              onComplete={onComplete}
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
    case "ppt":
    case "pptx":
    case "xls":
    case "xlsx":
    case "doc":
    case "docx":
      const officeDocUrl = `${process.env.NEXT_PUBLIC_HORACE}stream/document/${lesson.id}`

      return (
        <PDFPreview>
          <PictureAsPdf sx={{ fontSize: 60, color: "#1976d2", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {lesson.title || "Document"}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            This document type cannot be previewed directly. You can open it in
            your browser or download it below.
          </Typography>
          <Button
            variant="contained"
            startIcon={<CloudDownload />}
            href={officeDocUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ mb: 2 }}
            onClick={() => {
              setTimeout(() => onComplete?.(), 500)
            }}
          >
            Open in Browser / Download
          </Button>
        </PDFPreview>
      )

    case "text":
    case "html":
      return <HTMLLesson lesson={lesson} onComplete={onComplete} />

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
              <audio
                controls
                style={{ width: "100%" }}
                onEnded={() => onComplete?.()}
                onTimeUpdate={(e) => {
                  const audio = e.target as HTMLAudioElement
                  const progress = (audio.currentTime / audio.duration) * 100
                  onProgress?.(Math.round(progress))
                }}
              >
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
                onClick={() => {
                  setTimeout(() => onComplete?.(), 500)
                }}
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
