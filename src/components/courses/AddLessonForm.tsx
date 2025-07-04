import { LESSONTYPE, TopicBase } from "@/types/types"
import {
  Add as AddIcon,
  Remove as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Code as CodeIcon,
  Edit as EditIcon,
} from "@mui/icons-material"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material"
import React, { useState } from "react"
import { Controller, useFieldArray, useFormContext } from "react-hook-form"
import RichEditor from "./Editor"
import FileUploadZone from "./FileUploadZone"

const AddLessonForm = () => {
  const { watch } = useFormContext()

  const topics = watch("topics") ?? []
  return (
    <Box>
      <>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">Add Lessons</Typography>
          <Typography variant="body2" color="text.secondary">
            Add lessons for subject: {watch("course.courseName")}
          </Typography>
        </Box>

        {topics.map((topicField: TopicBase, topicIndex: number) => (
          <TopicAccordion key={topicField.module} topicIndex={topicIndex} />
        ))}
      </>
    </Box>
  )
}

const TopicAccordion: React.FC<{
  topicIndex: number
}> = ({ topicIndex }) => {
  const { control, watch, setValue } = useFormContext()
  const {
    fields: lessonFields,
    append: appendLesson,
    remove: removeLesson,
  } = useFieldArray({
    control,
    name: `topics.${topicIndex}.lessons`,
  })

  const handleLessonTypeChange = (lessonIndex: number) => {
    setValue(`topics.${topicIndex}.lessons.${lessonIndex}.video`, "")
    setValue(`topics.${topicIndex}.lessons.${lessonIndex}.content`, "")
  }

  return (
    <Accordion defaultExpanded={topicIndex === 0} sx={{ mb: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>
          {watch(`topics.${topicIndex}.title`) || `Topic ${topicIndex + 1}`}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={3}>
          {lessonFields.map((lessonField, lessonIndex) => {
            const lessonType = watch(
              `topics.${topicIndex}.lessons.${lessonIndex}.type`
            )
            const showFileUpload =
              lessonType === LESSONTYPE.VIDEO ||
              lessonType === LESSONTYPE.DOCUMENT

            return (
              <Paper key={lessonField.id} variant="outlined" sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name={`topics.${topicIndex}.lessons.${lessonIndex}.title`}
                      control={control}
                      rules={{ required: "Lesson title is required" }}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          label="Lesson Title"
                          required
                          fullWidth
                          error={!!error}
                          helperText={error?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name={`topics.${topicIndex}.lessons.${lessonIndex}.type`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          fullWidth
                          displayEmpty
                          onChange={(e) => {
                            field.onChange(e)
                            handleLessonTypeChange(lessonIndex)
                          }}
                        >
                          <MenuItem value="" disabled>
                            Select Lesson Type
                          </MenuItem>
                          {Object.values(LESSONTYPE).map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </Grid>

                  {showFileUpload && (
                    <Grid size={{ xs: 12 }}>
                      <FileUploadZone
                        lessonIndex={lessonIndex}
                        topicIndex={topicIndex}
                        lessonType={lessonType}
                        currentFile={
                          lessonType === LESSONTYPE.VIDEO
                            ? watch(
                                `topics.${topicIndex}.lessons.${lessonIndex}.video`
                              )
                            : watch(
                                `topics.${topicIndex}.lessons.${lessonIndex}.content`
                              )
                        }
                      />
                    </Grid>
                  )}

                  {lessonType === LESSONTYPE.TEXT && (
                    <Grid size={{ xs: 12 }}>
                      <Controller
                        name={`topics.${topicIndex}.lessons.${lessonIndex}.content`}
                        control={control}
                        render={({ field }) => (
                          <div>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                              Lesson Content
                            </Typography>
                            <RichEditor
                              content={field.value || ""}
                              onUpdate={({ editor }) => {
                                field.onChange(editor.getHTML())
                              }}
                              placeholder="Enter lesson content here..."
                            />
                          </div>
                        )}
                      />
                    </Grid>
                  )}

                  {lessonType === LESSONTYPE.HTML && (
                    <Grid size={{ xs: 12 }}>
                      <HTMLContentEditor
                        topicIndex={topicIndex}
                        lessonIndex={lessonIndex}
                      />
                    </Grid>
                  )}
                </Grid>

                {lessonIndex > 0 && (
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      color="error"
                      onClick={() => removeLesson(lessonIndex)}
                      startIcon={<DeleteIcon />}
                    >
                      Remove Lesson
                    </Button>
                  </Box>
                )}
              </Paper>
            )
          })}

          <Button
            startIcon={<AddIcon />}
            onClick={() =>
              appendLesson({
                tid: "",
                title: "",
                type: LESSONTYPE.TEXT,
                content: "",
                video: "",
                dueDate: new Date(),
              })
            }
          >
            Add Lesson to Topic
          </Button>
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}
const HTMLContentEditor: React.FC<{
  topicIndex: number
  lessonIndex: number
}> = ({ topicIndex, lessonIndex }) => {
  const [editMode, setEditMode] = useState<"visual" | "code">("visual")
  const { watch, control } = useFormContext()

  const currentContent =
    watch(`topics.${topicIndex}.lessons.${lessonIndex}.content`) || ""

  return (
    <Controller
      name={`topics.${topicIndex}.lessons.${lessonIndex}.content`}
      control={control}
      render={({ field }) => (
        <div>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="subtitle2">HTML Lesson Content</Typography>
            <ToggleButtonGroup
              value={editMode}
              exclusive
              onChange={(_, newMode) => {
                if (newMode !== null) {
                  setEditMode(newMode)
                }
              }}
              size="small"
            >
              <ToggleButton value="visual" aria-label="visual editor">
                <EditIcon sx={{ mr: 1 }} />
                Visual Editor
              </ToggleButton>
              <ToggleButton value="code" aria-label="code editor">
                <CodeIcon sx={{ mr: 1 }} />
                HTML Code
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {editMode === "visual" ? (
            <RichEditor
              content={field.value || ""}
              onUpdate={({ editor }) => {
                field.onChange(editor.getHTML())
              }}
              placeholder="Enter lesson content here using the visual editor..."
            />
          ) : (
            <TextField
              multiline
              rows={12}
              fullWidth
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              placeholder="Paste or type your HTML code here..."
              variant="outlined"
              sx={{
                "& .MuiInputBase-input": {
                  fontFamily: "monospace",
                  fontSize: "14px",
                },
              }}
              helperText="You can paste HTML code directly here. Switch to Visual Editor to see the rendered preview."
            />
          )}

          {editMode === "code" && currentContent && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Preview:
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  maxHeight: "300px",
                  overflow: "auto",
                  backgroundColor: "#fafafa",
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: currentContent }} />
              </Paper>
            </Box>
          )}
        </div>
      )}
    />
  )
}

export default AddLessonForm
