"use client"
import React, { useEffect, useState } from "react"
import {
  Container,
  Typography,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Chip,
  Card,
  CardContent,
  Divider,
  Alert,
  CircularProgress,
  Fab,
  List,
  ListItem,
  ListItemText,
} from "@mui/material"
import {
  ExpandMore,
  Add,
  Edit,
  Delete,
  Save,
  DragIndicator,
  PlayArrow,
  Article,
  Quiz,
  Assignment,
  Warning,
} from "@mui/icons-material"
import { useForm, Controller, FormProvider } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation, useQuery, useQueryClient } from "react-query"
import {
  addCourseDetail,
  addLecture,
  addTopic,
  deleteLecture,
  deleteObject,
  deleteTopic,
  fetchCourse,
} from "@/app/api/rest"
import { notifyError, notifySuccess } from "@/utils/notification"
import { courseSchema, lessonSchema, topicSchema } from "@/schema/courseSchema"
import { CourseCreate, LessonDto, LESSONTYPE, TopicDto } from "@/types/types"
import FileUploadZone from "@/components/courses/FileUploadZone"

interface CourseEditorProps {
  id: string
  userId: string
}

interface DeleteConfirmation {
  open: boolean
  type: "topic" | "lesson"
  item?: TopicDto | LessonDto
  index?: number
  topicIndex?: number
  lessonIndex?: number
}

const CourseEditor: React.FC<CourseEditorProps> = ({ id, userId }) => {
  const queryClient = useQueryClient()
  const [saving, setSaving] = useState(false)
  const [expandedTopic, setExpandedTopic] = useState<string | false>(false)

  const [courseDialogOpen, setCourseDialogOpen] = useState(false)
  const [topicDialogOpen, setTopicDialogOpen] = useState(false)
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] =
    useState<DeleteConfirmation>({
      open: false,
      type: "topic",
    })

  const [editingTopic, setEditingTopic] = useState<TopicDto | null>(null)
  const [editingLesson, setEditingLesson] = useState<LessonDto | null>(null)
  const [editingTopicIndex, setEditingTopicIndex] = useState<number>(-1)
  const [editingLessonIndex, setEditingLessonIndex] = useState<number>(-1)

  const { data: courseData, isLoading: loading } = useQuery({
    queryKey: ["course", id],
    queryFn: () => fetchCourse(id),
    enabled: !!id,
  })

  const courseForm = useForm({
    resolver: yupResolver(courseSchema),
    defaultValues: {
      courseName: "",
      category: "",
      target: "",
      brief: "",
      overview: "",
      price: 0,
      tax: 0,
      currency: "USD",
      user: userId,
    },
  })

  useEffect(() => {
    if (courseData) {
      courseForm.reset({
        courseName: courseData.courseName || "",
        category: courseData.category || "",
        target: courseData.target || "",
        brief: courseData.brief || "",
        overview: courseData.overview || "",
        price: courseData.price || 0,
        tax: courseData.tax || 0,
        currency: courseData.currency || "USD",
        user: userId,
      })
    }
  }, [courseData, courseForm, userId])

  const lessonForm = useForm({
    resolver: yupResolver(lessonSchema),
    defaultValues: {
      tid: "",
      title: "",
      type: LESSONTYPE.TEXT as LESSONTYPE,
      content: "",
      video: "",
    },
  })

  const { mutate } = useMutation({
    mutationFn: addCourseDetail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] })
      notifySuccess("Course edited successfully")
      courseForm.reset()
      setCourseDialogOpen(false)
      return
    },
    onError: () => {
      notifyError("Failed to edit course, please retry!")
      return
    },
  })

  const handleSaveCourse = async (data: CourseCreate) => {
    if (!id || !userId) {
      notifyError("Course ID and User ID are required")
      return
    }
    data.id = id
    data.user = userId
    mutate(data)
  }

  const topicForm = useForm({
    resolver: yupResolver(topicSchema),
    defaultValues: {
      cid: id,
      module: "",
      title: "",
      description: "",
      dueDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    },
  })

  const handleAddTopic = () => {
    setEditingTopic(null)
    setEditingTopicIndex(-1)
    topicForm.reset({
      cid: id,
      module: "",
      title: "",
      description: "",
      dueDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    })
    setTopicDialogOpen(true)
  }

  const handleEditTopic = (topic: TopicDto, index: number) => {
    setEditingTopic(topic)
    setEditingTopicIndex(index)
    topicForm.reset({
      cid: id,
      module: topic.module || topic.title,
      title: topic.title || topic.module,
      description: topic.description,
      dueDate: topic.dueDate,
    })
    setTopicDialogOpen(true)
  }

  const { mutate: addEditTopic } = useMutation({
    mutationFn: addTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", id] })
      notifySuccess("Module updated successfully")
      setTopicDialogOpen(false)
      setSaving(false)
      return
    },
    onError: () => {
      notifyError("Failed to update module, please retry!")
      setSaving(false)
      return
    },
  })

  const handleSaveTopic = async (data: TopicDto) => {
    if (!courseData || !id) {
      notifyError("Course data or ID is missing")
      return
    }
    setSaving(true)
    const newTopic: TopicDto = {
      id: editingTopic?.id,
      cid: id,
      module: data.module || data.title,
      title: data.title || data.module,
      description: data.description,
      dueDate: data.dueDate,
      orderIndex:
        editingTopicIndex >= 0
          ? editingTopicIndex + 1
          : courseData.curriculum.topic.length + 1,
      lessons: editingTopic?.lessons,
    }
    addEditTopic(newTopic)
  }

  const { mutate: deleteTopicMutation, isLoading: deletingTopic } = useMutation(
    {
      mutationFn: async (topicData: { id: string }) => {
        await deleteTopic(topicData.id)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["course", id] })
        notifySuccess("Module deleted successfully")
        setDeleteConfirmation({ open: false, type: "topic" })
      },
      onError: () => {
        notifyError("Failed to delete module")
        setDeleteConfirmation({ open: false, type: "topic" })
      },
    }
  )

  const handleDeleteTopicClick = (topic: TopicDto, index: number) => {
    if (topic.lessons && topic.lessons.length > 0) {
      notifyError(
        "You cannot delete a module that already has lessons. Please remove the lessons first."
      )
      return
    }

    setDeleteConfirmation({
      open: true,
      type: "topic",
      item: topic,
      index: index,
    })
  }

  const handleConfirmTopicDelete = () => {
    const topic = deleteConfirmation.item as TopicDto
    if (!topic?.id) return

    deleteTopicMutation({
      id: topic.id,
    })
  }

  const { mutate: addEditLesson } = useMutation({
    mutationFn: addLecture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", id] })
      notifySuccess("Lesson updated successfully")
      setLessonDialogOpen(false)
      setSaving(false)
      return
    },
    onError: () => {
      notifyError("Failed to update lesson, please retry!")
      setSaving(false)
      return
    },
  })

  const handleAddLesson = (topicIndex: number) => {
    setEditingLesson(null)
    setEditingTopicIndex(topicIndex)
    setEditingLessonIndex(-1)
    lessonForm.reset({
      tid: courseData?.curriculum.topic[topicIndex].id,
      title: "",
      type: LESSONTYPE.TEXT,
      content: "",
      video: "",
      assetKey: "",
    })
    setLessonDialogOpen(true)
  }

  const handleEditLesson = (
    lesson: LessonDto,
    topicIndex: number,
    lessonIndex: number
  ) => {
    setEditingLesson(lesson)
    setEditingTopicIndex(topicIndex)
    setEditingLessonIndex(lessonIndex)
    lessonForm.reset({
      tid: courseData?.curriculum.topic[topicIndex].id,
      title: lesson.title,
      type: lesson.type as LESSONTYPE,
      content: lesson.content,
      video: lesson.video,
    })
    setLessonDialogOpen(true)
  }

  const handleSaveLesson = async (data: LessonDto) => {
    if (!courseData || editingTopicIndex < 0) return
    setSaving(true)
    const newLesson: LessonDto = {
      id: editingLesson?.id,
      tid: courseData.curriculum.topic[editingTopicIndex].id,
      title: data.title,
      type: data.type,
      content: data.content,
      video: data.video || "",
      assetKey: data.assetKey || "",
      orderIndex:
        editingLessonIndex >= 0
          ? editingLessonIndex + 1
          : courseData.curriculum.topic[editingTopicIndex].lessons.length + 1,
    }
    addEditLesson(newLesson)
    setLessonDialogOpen(false)
  }

  const handleDeleteLessonClick = (
    lesson: LessonDto,
    topicIndex: number,
    lessonIndex: number
  ) => {
    setDeleteConfirmation({
      open: true,
      type: "lesson",
      item: lesson,
      topicIndex: topicIndex,
      lessonIndex: lessonIndex,
    })
  }

  const { mutate: deleteLessonMutation, isLoading: deletingLesson } =
    useMutation({
      mutationFn: async (lessonData: {
        id: string
        video: string
        content: string
      }) => {
        await deleteLecture(lessonData.id)
        if (lessonData.video) await deleteObject(lessonData.video)
        if (lessonData.content) await deleteObject(lessonData.content)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["course", id] })
        notifySuccess("Lesson deleted successfully")
        setDeleteConfirmation({ open: false, type: "lesson" })
      },
      onError: () => {
        notifyError("Failed to delete lesson")
        setDeleteConfirmation({ open: false, type: "lesson" })
      },
    })

  const handleConfirmLessonDelete = () => {
    const lesson = deleteConfirmation.item as LessonDto
    if (!lesson?.id) return

    deleteLessonMutation({
      id: lesson.id,
      video: lesson.video || "",
      content: lesson.content || "",
    })
  }

  const handleCancelDelete = () => {
    setDeleteConfirmation({ open: false, type: "topic" })
  }

  const getLessonIcon = (type: LESSONTYPE) => {
    switch (type) {
      case LESSONTYPE.VIDEO:
        return <PlayArrow />
      case LESSONTYPE.TEXT:
        return <Article />
      case LESSONTYPE.QUIZ:
        return <Quiz />
      case LESSONTYPE.ASSIGNMENT:
        return <Assignment />
      case LESSONTYPE.PRESENTATION:
        return <Assignment />
      case LESSONTYPE.OTHER:
        return <Article />
      default:
        return <Article />
    }
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
    } catch {
      notifyError("Failed to save course:")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress size={60} />
        </Box>
      </Container>
    )
  }

  if (!courseData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Failed to load course data</Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Edit Course
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {courseData.courseName}
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => setCourseDialogOpen(true)}
          >
            Edit Course Details
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSaveAll}
            disabled={saving}
          >
            {saving ? <CircularProgress size={20} /> : "Save All Changes"}
          </Button>
        </Box>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="h6" gutterBottom>
                Course Overview
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {courseData.brief}
              </Typography>
              <Box display="flex" gap={2} flexWrap="wrap">
                <Chip label={`Category: ${courseData.category}`} />
                <Chip label={`Target: ${courseData.target}`} />
                <Chip label={`${courseData.curriculum.topic.length} Modules`} />
                <Chip
                  label={`${courseData.curriculum.topic.reduce((acc: number, topic: TopicDto) => acc + (topic?.lessons?.length ?? 0), 0)} Lessons`}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box textAlign="right">
                <Typography variant="h5" fontWeight="bold" color="primary">
                  {courseData.currency} {courseData.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  + {courseData.tax}% tax
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight="bold">
          Course Modules ({courseData.curriculum.topic.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddTopic}
          size="large"
        >
          Add New Module
        </Button>
      </Box>

      {courseData.curriculum.topic.map(
        (topic: TopicDto, topicIndex: number) => (
          <Accordion
            key={topic.id || topicIndex}
            expanded={expandedTopic === `topic-${topicIndex}`}
            onChange={() =>
              setExpandedTopic(
                expandedTopic === `topic-${topicIndex}`
                  ? false
                  : `topic-${topicIndex}`
              )
            }
            sx={{ mb: 2 }}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center" width="100%" mr={2}>
                <DragIndicator sx={{ mr: 2, color: "text.secondary" }} />
                <Box flexGrow={1}>
                  <Typography variant="h6" fontWeight="bold">
                    {topic.module}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {topic?.lessons?.length} lessons • Due:{" "}
                    {topic?.dueDate
                      ? new Date(topic.dueDate).toLocaleDateString()
                      : "No due date"}
                  </Typography>
                </Box>
                <Box display="flex" gap={1}>
                  <IconButton
                    size="small"
                    onClick={() => handleEditTopic(topic, topicIndex)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteTopicClick(topic, topicIndex)}
                    disabled={deletingTopic}
                  >
                    {deletingTopic ? (
                      <CircularProgress size={16} />
                    ) : (
                      <Delete />
                    )}
                  </IconButton>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {topic.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="h6">
                    Lessons ({topic?.lessons?.length})
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Add />}
                    onClick={() => handleAddLesson(topicIndex)}
                  >
                    Add Lesson
                  </Button>
                </Box>

                <List>
                  {topic?.lessons?.map((lesson, lessonIndex) => (
                    <ListItem
                      key={lesson.id || lessonIndex}
                      sx={{
                        border: "1px solid #e0e0e0",
                        borderRadius: 1,
                        mb: 1,
                        "&:hover": { backgroundColor: "#f5f5f5" },
                      }}
                      secondaryAction={
                        <>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleEditLesson(lesson, topicIndex, lessonIndex)
                            }
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              handleDeleteLessonClick(
                                lesson,
                                topicIndex,
                                lessonIndex
                              )
                            }
                            disabled={deletingLesson}
                          >
                            {deletingLesson ? (
                              <CircularProgress size={16} />
                            ) : (
                              <Delete />
                            )}
                          </IconButton>
                        </>
                      }
                    >
                      <Box display="flex" alignItems="center" mr={2}>
                        {getLessonIcon(lesson.type as LESSONTYPE)}
                      </Box>
                      <ListItemText
                        primary={lesson.title}
                        secondary={`Type: ${lesson.type} • Updated: ${lesson.updatedOn ? new Date(lesson.updatedOn).toLocaleDateString() : "N/A"}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </AccordionDetails>
          </Accordion>
        )
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmation.open}
        onClose={handleCancelDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Warning color="warning" />
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {deleteConfirmation.type === "topic" ? (
              <>
                Are you sure you want to delete the module{" "}
                <strong>&quot;{deleteConfirmation.item?.title}&quot;</strong>?
                <br />
                <br />
                This action will also delete:
                <ul>
                  <li>
                    All lessons within this module (
                    {(deleteConfirmation.item as TopicDto)?.lessons?.length ||
                      0}{" "}
                    lessons)
                  </li>
                  <li>All associated files and content</li>
                </ul>
                <Alert severity="warning" sx={{ mt: 2 }}>
                  This action cannot be undone!
                </Alert>
              </>
            ) : (
              <>
                Are you sure you want to delete the lesson{" "}
                <strong>
                  &quot;{(deleteConfirmation.item as LessonDto)?.title}&quot;
                </strong>
                ?
                <br />
                <br />
                This action will also delete:
                <ul>
                  <li>All lesson content</li>
                  <li>Associated video and document files</li>
                </ul>
                <Alert severity="warning" sx={{ mt: 2 }}>
                  This action cannot be undone!
                </Alert>
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={
              deleteConfirmation.type === "topic"
                ? handleConfirmTopicDelete
                : handleConfirmLessonDelete
            }
            variant="contained"
            color="error"
            startIcon={<Delete />}
            disabled={deletingLesson || deletingTopic}
          >
            {deletingLesson || deletingTopic ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                Deleting...
              </>
            ) : (
              "Delete Permanently"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Course Edit Dialog */}
      <Dialog open={courseDialogOpen} maxWidth="md" fullWidth>
        <DialogTitle>Edit Course Details</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="courseName"
                  control={courseForm.control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Course Name"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="category"
                  control={courseForm.control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Category"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="target"
                  control={courseForm.control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Target Audience"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="brief"
                  control={courseForm.control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={3}
                      label="Brief Description"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="overview"
                  control={courseForm.control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={4}
                      label="Course Overview"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Controller
                  name="price"
                  control={courseForm.control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Price"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Controller
                  name="tax"
                  control={courseForm.control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Tax (%)"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Controller
                  name="currency"
                  control={courseForm.control}
                  render={({ field, fieldState }) => (
                    <FormControl fullWidth error={!!fieldState.error}>
                      <InputLabel>Currency</InputLabel>
                      <Select {...field} label="Currency">
                        <MenuItem value="USD">USD</MenuItem>
                        <MenuItem value="EUR">EUR</MenuItem>
                        <MenuItem value="GBP">GBP</MenuItem>
                        <MenuItem value="NGN">NGN</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCourseDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={courseForm.handleSubmit(handleSaveCourse)}
            disabled={saving}
          >
            {saving ? <CircularProgress size={20} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={topicDialogOpen} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTopic ? "Edit Topic" : "Add New Topic"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="title"
                  control={topicForm.control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Module Name"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="description"
                  control={topicForm.control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={3}
                      label="Description"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="dueDate"
                  control={topicForm.control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="date"
                      label="Due Date"
                      InputLabelProps={{ shrink: true }}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      value={
                        field.value
                          ? field.value.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTopicDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={topicForm.handleSubmit(handleSaveTopic)}
            disabled={
              saving || Object.keys(topicForm.formState.errors).length > 0
            }
          >
            {saving ? <CircularProgress size={20} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Lesson Edit Dialog */}
      <Dialog open={lessonDialogOpen} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingLesson ? "Edit Lesson" : "Add New Lesson"}
        </DialogTitle>
        <DialogContent>
          <FormProvider {...lessonForm}>
            <Box component="form" sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Controller
                    name="title"
                    control={lessonForm.control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Lesson Title"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Controller
                    name="type"
                    control={lessonForm.control}
                    render={({ field, fieldState }) => (
                      <FormControl fullWidth error={!!fieldState.error}>
                        <InputLabel>Lesson Type</InputLabel>
                        <Select {...field} label="Lesson Type">
                          <MenuItem value={LESSONTYPE.TEXT}>Text</MenuItem>
                          <MenuItem value={LESSONTYPE.VIDEO}>Video</MenuItem>
                          <MenuItem value={LESSONTYPE.QUIZ}>Quiz</MenuItem>
                          <MenuItem value={LESSONTYPE.PRESENTATION}>
                            Presentation
                          </MenuItem>
                          <MenuItem value={LESSONTYPE.DOCUMENT}>
                            Document
                          </MenuItem>
                          <MenuItem value={LESSONTYPE.ASSIGNMENT}>
                            Assignment
                          </MenuItem>
                          <MenuItem value={LESSONTYPE.OTHER}>Other</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="type"
                    control={lessonForm.control}
                    render={({ field }) => {
                      const lessonType = field.value
                      if (
                        lessonType === LESSONTYPE.VIDEO ||
                        lessonType === LESSONTYPE.DOCUMENT ||
                        lessonType === LESSONTYPE.PRESENTATION
                      ) {
                        return (
                          <FileUploadZone
                            lessonIndex={
                              editingLessonIndex >= 0 ? editingLessonIndex : -1
                            }
                            topicIndex={editingTopicIndex}
                            lessonType={lessonType}
                            currentFile={
                              lessonType === LESSONTYPE.VIDEO
                                ? lessonForm.getValues("video")
                                : lessonForm.getValues("content")
                            }
                          />
                        )
                      }
                      return <></>
                    }}
                  />
                </Grid>

                {/* Manual Video URL input (alternative to file upload) */}
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="video"
                    control={lessonForm.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Video URL (optional - alternative to file upload)"
                        placeholder="https://..."
                        helperText="You can either upload a video file above or provide a URL here"
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="type"
                    control={lessonForm.control}
                    render={({ field: typeField }) => (
                      <Controller
                        name="content"
                        control={lessonForm.control}
                        render={({ field: contentField, fieldState }) => {
                          if (typeField.value !== LESSONTYPE.VIDEO) {
                            return (
                              <TextField
                                {...contentField}
                                fullWidth
                                multiline
                                rows={6}
                                label="Lesson Content"
                                error={!!fieldState.error}
                                helperText={
                                  fieldState.error?.message ||
                                  "Enter the lesson content or upload a document above"
                                }
                              />
                            )
                          }

                          return <></>
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
          </FormProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLessonDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={lessonForm.handleSubmit(handleSaveLesson)}
            disabled={saving}
          >
            {saving ? <CircularProgress size={20} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={handleAddTopic}
      >
        <Add />
      </Fab>
    </Container>
  )
}

export default CourseEditor
