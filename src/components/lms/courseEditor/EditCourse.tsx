import { useFieldArray, useFormContext } from "react-hook-form"
import { Box, Button, TextField } from "@mui/material"
import TopicEditor from "./TopicEditor"

export default function EditCourseForm() {
  const { register, control } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "topics",
  })

  return (
    <Box>
      <TextField
        {...register("course.courseName")}
        label="Course Name"
        fullWidth
      />
      <TextField {...register("course.category")} label="Category" fullWidth />
      <TextField
        {...register("course.overview")}
        label="Overview"
        fullWidth
        multiline
      />

      <h3>Modules</h3>
      {fields.map((topic, index) => (
        <TopicEditor
          key={topic.id}
          index={index}
          onRemove={() => remove(index)}
        />
      ))}

      <Button
        onClick={() =>
          append({
            module: "",
            description: "",
            lessons: [],
            createdOn: new Date(),
            updatedOn: new Date(),
            dueDate: new Date(),
            orderIndex: fields.length,
          })
        }
      >
        Add Module
      </Button>
    </Box>
  )
}
