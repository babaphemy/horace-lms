import { Add, Delete } from "@mui/icons-material"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material"
import { GridExpandMoreIcon } from "@mui/x-data-grid"
import { Controller, useFieldArray, useFormContext } from "react-hook-form"

const AddTopicForm = () => {
  const { control, watch } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "topics",
  })
  const addTopic = () => {
    append({
      module: "",
      description: "",
      orderIndex: 0,
      lessons: [],
    })
  }
  return (
    <Box>
      <>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">Add Module(s)</Typography>
          <Typography variant="body2" color="text.secondary">
            Add module(s) for course: {watch("course.courseName")}
          </Typography>
        </Box>
        {fields.map((field, index) => (
          <Accordion key={field.id} defaultExpanded={index === 0}>
            <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
              <Typography>
                {watch(`topics.${index}.module`) || `Module ${index + 1}`}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name={`topics.${index}.module`}
                    control={control}
                    rules={{ required: "Module title is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Module Title"
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
                    name={`topics.${index}.description`}
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Description" fullWidth />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name={`topics.${index}.orderIndex`}
                    control={control}
                    defaultValue={index + 1}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Index"
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              {index > 0 && (
                <Button
                  color="error"
                  onClick={() => remove(index)}
                  startIcon={<Delete />}
                  sx={{ mt: 2 }}
                >
                  Remove Module
                </Button>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Button startIcon={<Add />} onClick={addTopic}>
            Add Another Module
          </Button>
        </Box>
      </>
    </Box>
  )
}
export default AddTopicForm
