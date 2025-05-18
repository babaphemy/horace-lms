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
      title: "",
      description: "",
      orderIndex: 0,
      dueDate: "",
      lessons: [],
    })
  }
  return (
    <Box>
      <>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">Add Topics</Typography>
          <Typography variant="body2" color="text.secondary">
            Add topics for course: {watch("courseName")}
          </Typography>
        </Box>
        {fields.map((field, index) => (
          <Accordion key={field.id} defaultExpanded={index === 0}>
            <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
              <Typography>
                {watch(`topics.${index}.title`) || `Topic ${index + 1}`}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name={`topics.${index}.title`}
                    control={control}
                    rules={{ required: "Topic title is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Topic Title"
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
                    render={({ field }) => (
                      <TextField {...field} label="Index" fullWidth />
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
                  Remove Topic
                </Button>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Button startIcon={<Add />} onClick={addTopic}>
            Add Topic
          </Button>
        </Box>
      </>
    </Box>
  )
}
export default AddTopicForm
