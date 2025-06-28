import { useFormContext, useFieldArray } from "react-hook-form"
import { Box, Button, TextField } from "@mui/material"
import LessonEditor from "./LessonEditor"
import { LESSONTYPE } from "@/types/types"

export default function TopicEditor({
  index,
  onRemove,
}: {
  index: number
  onRemove: () => void
}) {
  const { register, control } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: `topics.${index}.lessons`,
  })

  return (
    <Box sx={{ mb: 4, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
      <TextField
        {...register(`topics.${index}.module`)}
        label="Module Title"
        fullWidth
      />
      <TextField
        {...register(`topics.${index}.description`)}
        label="Description"
        fullWidth
        multiline
      />

      <h4>Lessons</h4>
      {fields.map((_, i) => (
        <LessonEditor
          key={i}
          topicIndex={index}
          lessonIndex={i}
          onRemove={() => remove(i)}
        />
      ))}

      <Button
        onClick={() =>
          append({
            title: "",
            type: LESSONTYPE.TEXT,
            orderIndex: fields.length,
            content: "",
            video: "",
            createdOn: new Date(),
            updatedOn: new Date(),
          })
        }
      >
        Add Lesson
      </Button>

      <Button color="error" onClick={onRemove}>
        Remove Module
      </Button>
    </Box>
  )
}
