import { useFormContext } from "react-hook-form"
import { Box, Button, MenuItem, TextField } from "@mui/material"
import { LESSONTYPE } from "@/types/types"
import FileUploadZone from "@/components/courses/FileUploadZone"
export default function LessonEditor({
  topicIndex,
  lessonIndex,
  onRemove,
}: {
  topicIndex: number
  lessonIndex: number
  onRemove: () => void
}) {
  const { register, watch } = useFormContext()
  const lessonType = watch(`topics.${topicIndex}.lessons.${lessonIndex}.type`)

  return (
    <Box sx={{ p: 2, mt: 2, border: "1px dashed #ccc" }}>
      <TextField
        {...register(`topics.${topicIndex}.lessons.${lessonIndex}.title`)}
        label="Lesson Title"
        fullWidth
      />

      <TextField
        select
        {...register(`topics.${topicIndex}.lessons.${lessonIndex}.type`)}
        label="Lesson Type"
        fullWidth
      >
        {Object.values(LESSONTYPE).map((type) => (
          <MenuItem key={type} value={type}>
            {type.toUpperCase()}
          </MenuItem>
        ))}
      </TextField>

      <FileUploadZone
        lessonIndex={lessonIndex}
        topicIndex={topicIndex}
        lessonType={lessonType}
      />

      <Button color="error" onClick={onRemove}>
        Remove Lesson
      </Button>
    </Box>
  )
}
