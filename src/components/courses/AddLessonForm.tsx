import { LESSONTYPE, TopicDto } from "@/types/types"
import {
  Add as AddIcon,
  Remove as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
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
} from "@mui/material"
import React from "react"
import { Controller, useFieldArray, useFormContext } from "react-hook-form"
import RichEditor from "./Editor"
import FileUploadZone from "./FileUploadZone"

// TODO: Delete video when remove lesson
const AddLessonForm = () => {
  const { watch } = useFormContext()

  const topics = watch("topics")
  return (
    <Box>
      <>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">Add Lessons</Typography>
          <Typography variant="body2" color="text.secondary">
            Add lessons for subject: {watch("courseName")}
          </Typography>
        </Box>

        {topics.map((topicField: TopicDto, topicIndex: number) => (
          <TopicAccordion key={topicField.id} topicIndex={topicIndex} />
        ))}
      </>
    </Box>
  )
}

const TopicAccordion: React.FC<{
  topicIndex: number
}> = ({ topicIndex }) => {
  const { control, watch } = useFormContext()
  const {
    fields: lessonFields,
    append: appendLesson,
    remove: removeLesson,
  } = useFieldArray({
    control,
    name: `topics.${topicIndex}.lessons`,
  })
  const handleLessonTypeChange = (lessonIndex: number, newType: string) => {
    // Clear file fields when lesson type changes
    const { setValue } = useFormContext()
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
              lessonType === LESSONTYPE.video ||
              lessonType === LESSONTYPE.document

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
                            handleLessonTypeChange(lessonIndex, e.target.value)
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
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name={`topics.${topicIndex}.lessons.${lessonIndex}.dueDate`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Due Date"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                        />
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
                          lessonType === LESSONTYPE.video
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

                  {(lessonType === LESSONTYPE.text ||
                    lessonType === LESSONTYPE.html) && (
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
                type: LESSONTYPE.text,
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

export default AddLessonForm
