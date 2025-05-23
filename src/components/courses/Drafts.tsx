import { courseStyles } from "@/styles/courseStyles"
import { tCourse } from "@/types/types"
import {
  Box,
  CircularProgress,
  Grid,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Chip,
  Avatar,
  Button,
  Divider,
  IconButton,
  ButtonGroup,
} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import { useRouter } from "next/navigation"
import React from "react"
import { notifyInfo } from "@/utils/notification"

const Drafts = ({
  data,
  loading,
  onPublish,
  onDelete,
}: {
  data: tCourse[]
  loading: boolean
  onPublish: (_id: string, _draft: boolean) => void
  onDelete?: (_id: string) => void
}) => {
  const router = useRouter()

  const handleEditCourse = (courseId: string) => {
    router.push(`/dashboard/courses/add?cid=${courseId}`)
  }

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A"
    const d = new Date(date)
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
  const handleDelete = (id: string) => {
    notifyInfo(`Deleting course... ${id}`)
  }

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading your authored courses...
        </Typography>
      </Box>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Box>
        <Typography variant="h4" sx={courseStyles.title}>
          Authored Courses (0)
        </Typography>

        <Card
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
            backgroundColor: "rgba(0, 0, 0, 0.02)",
          }}
        >
          <VisibilityOffIcon
            sx={{ fontSize: 60, color: "text.secondary", opacity: 0.5 }}
          />
          <Typography variant="h6" sx={{ mt: 2 }}>
            No draft courses yet
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, mb: 3 }}
          >
            Create your first course to get started
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/dashboard/courses/add")}
          >
            Create New Course
          </Button>
        </Card>
      </Box>
    )
  }

  return (
    <Box mb={4}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" sx={courseStyles.title}>
          Authored ({data.length})
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/dashboard/courses/add")}
        >
          Create New Course
        </Button>
      </Box>

      <Grid container spacing={3}>
        {data.map((course: tCourse, index: number) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id || index}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderLeft: "4px solid #FFC107",
                position: "relative",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                },
              }}
            >
              {course?.draft && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bgcolor: "warning.main",
                    color: "warning.contrastText",
                    px: 2,
                    py: 0.5,
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    zIndex: 1,
                    display: "flex",
                    alignItems: "center",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <EditIcon fontSize="small" sx={{ mr: 0.5 }} />
                  DRAFT
                </Box>
              )}

              <CardActionArea
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                }}
                onClick={() => handleEditCourse(course.id || "")}
              >
                <CardContent
                  sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Avatar
                      src={
                        course.thumbnail
                          ? `/img/${course.thumbnail}`
                          : undefined
                      }
                      variant="rounded"
                      sx={{
                        width: 60,
                        height: 60,
                        bgcolor: course.thumbnail ? "transparent" : "grey.300",
                        mr: 2,
                      }}
                    >
                      {!course.thumbnail &&
                        course.courseName.substring(0, 1).toUpperCase()}
                    </Avatar>

                    <Box>
                      <Typography variant="h6" component="h2" noWrap>
                        {course.courseName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Last updated: {formatDate(course.updatedOn)}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      mb: 2,
                      minHeight: "40px",
                    }}
                  >
                    {course.brief || "No description provided."}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip
                      label={course.category || "Uncategorized"}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Stack>

                  <Box
                    sx={{
                      mt: "auto",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      alt={course?.author?.firstname || "Author"}
                      src="/img/avatar.jpg"
                      sx={{ width: 28, height: 28, mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {course?.author?.firstname || "Unknown author"}
                    </Typography>

                    {course?.draft ? (
                      <Chip
                        label="Not Published"
                        size="small"
                        color="warning"
                        sx={{ ml: "auto" }}
                      />
                    ) : (
                      <Chip
                        label="Published"
                        size="small"
                        color="success"
                        sx={{ ml: "auto" }}
                      />
                    )}
                  </Box>
                </CardContent>
              </CardActionArea>

              <Divider />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  p: 1,
                }}
              >
                {course?.draft ? (
                  <Button
                    startIcon={<EditIcon />}
                    size="small"
                    sx={{ flexGrow: 1 }}
                    onClick={() => handleEditCourse(course.id || "")}
                  >
                    Edit Draft
                  </Button>
                ) : (
                  <ButtonGroup>
                    <Button
                      startIcon={<DeleteOutlineIcon />}
                      size="small"
                      sx={{ flexGrow: 1 }}
                      onClick={() => handleDelete(course.id || "")}
                    >
                      Delete
                    </Button>

                    <Button
                      startIcon={<EditIcon />}
                      size="small"
                      sx={{ flexGrow: 1 }}
                      onClick={() => onPublish(course.id, !course.draft)}
                    >
                      UnPublish
                    </Button>
                  </ButtonGroup>
                )}

                {onDelete && (
                  <IconButton
                    color="error"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(course.id || "")
                    }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                )}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
export default Drafts
