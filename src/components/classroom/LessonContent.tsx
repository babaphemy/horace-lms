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
  DescriptionOutlined,
  Favorite,
  PictureAsPdf,
  PlayCircle,
  Share,
} from "@mui/icons-material"
import VideoPlaceholderSVG from "../lms/VideoPlaceholderSVG"
import ReactPlayer from "react-player"
interface HTMLLessonProps {
  lesson: {
    content?: string
  }
}
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
const LessonContent = ({ lesson }: { lesson: Lesson }) => {
  if (!lesson) {
    return (
      <Alert severity="info">
        Please select a lesson from the content menu.
      </Alert>
    )
  }
  switch (lesson.type?.toLowerCase()) {
    case "video":
      return (
        <VideoPlaceholder>
          {lesson.id ? (
            <ReactPlayer
              url={`https://horacelms.com/stream/${lesson.id}`}
              width="100%"
              height="100%"
              controls={true}
              loop={true}
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
            // <Box
            //   component="video"
            //   controls
            //   width="100%"
            //   height="100%"
            //   onError={(e) => {
            //     console.error("Video error:", e)
            //     console.error("Video error details:", e.target.error)
            //   }}
            //   onLoadStart={() => console.log("Video loading started")}
            //   onCanPlay={() => console.log("Video can play")}
            // >
            //   <source
            //     src={`http://localhost:8000/stream/${lesson.id}`}
            //     type="video/mp4"
            //   />
            //   Your browser does not support the video streamer.
            // </Box>
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
      return (
        <PDFPreview>
          <PictureAsPdf sx={{ fontSize: 60, color: "#f44336", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {lesson.title || "PDF Document"}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            PDF document preview
          </Typography>
          {lesson.content && (
            <Button
              variant="contained"
              startIcon={<CloudDownload />}
              href={lesson.content}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open PDF
            </Button>
          )}
        </PDFPreview>
      )

    case "document":
    case "word":
    case "docx":
      return (
        <PDFPreview>
          <DescriptionOutlined sx={{ fontSize: 60, color: "#2196f3", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {lesson.title || "Document"}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Document preview not available
          </Typography>
          {lesson.content && (
            <Button
              variant="contained"
              startIcon={<CloudDownload />}
              href={lesson.content}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Document
            </Button>
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

    default:
      // Default case for unknown content types
      return (
        <DocumentContainer>
          <Typography variant="h6" gutterBottom>
            {lesson.title || "Lesson Content"}
          </Typography>
          {lesson.content ? (
            <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
          ) : (
            <Typography variant="body1" color="text.secondary" align="center">
              Content type not supported or no content available.
            </Typography>
          )}
        </DocumentContainer>
      )
  }
}
export default LessonContent
