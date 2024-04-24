"use client"
import React from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { Typography, Box, TextField, Button, Container } from "@mui/material"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
const schema = yup.object().shape({
  workflow: yup.string().required("First name is required"),
  alignmentIssues: yup.string().required("Last name is required"),
  hardestPart: yup
    .string()
    .email("You must enter a valid email")
    .required("You must enter a email"),
  problemReason: yup.string().required("Phone number is required"),
  currentSolution: yup.string().required("Message is required"),
  likedSolution: yup.string(),
  dislikedSolution: yup.string(),
  weeklyHours: yup.string(),
  additionalChallenges: yup.string(),
  feedback: yup.string(),
})

const defaultValues = {
  workflow: "",
  alignmentIssues: "",
  hardestPart: "",
  problemReason: "",
  currentSolution: "",
  likedSolution: "",
  dislikedSolution: "",
  weeklyHours: "",
  additionalChallenges: "",
  feedback: "",
}
const InterviewQuestionnaire = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  })

  const onSubmit = (data: any) => {
    console.log(data)
    // Handle form submission here
  }

  return (
    <Box>
        <Header />
        <Container>
      <Typography variant="h4" gutterBottom>
        User Interview Questionnaire for Horace Learning
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        (School Management ERP and LMS Solution)
      </Typography>

      <Box sx={{ my: 4 }}>
        <Typography variant="body1" gutterBottom>
          Introduction: Thank you for taking the time to participate in this
          interview. We are exploring ways to improve our school management ERP
          and LMS solution, Horace Learning, to better align with your workflow
          and address your needs. Your feedback is invaluable in helping us
          understand your challenges and develop effective solutions.
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h6" gutterBottom>
          Workflow Alignment:
        </Typography>
        <TextField
          {...register("workflow")}
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          label="Could you please walk me through your typical workflow for managing school operations and learning activities?"
        />
        <TextField
          {...register("alignmentIssues")}
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          label="If the workflow of Horace Learning does not align with how you currently operate, what are the key areas of misalignment?"
        />

        <Typography variant="h6" gutterBottom>
          For each step in the workflow:
        </Typography>
        <TextField
          {...register("hardestPart")}
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          label="What is the hardest part of this step for you? (Try to understand the problem)"
        />
        <TextField
          {...register("problemReason")}
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          label="Why is that a problem for you? (Understand the emotion behind the problem)"
        />
        <TextField
          {...register("currentSolution")}
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          label="How are you currently solving this problem? (Access if they are searching for solutions)"
        />
        <TextField
          {...register("likedSolution")}
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          label="What do you like about your current solution?"
        />
        <TextField
          {...register("dislikedSolution")}
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          label="What do you not like about your current solution? (Don't look for gaps)"
        />
        <TextField
          {...register("weeklyHours", { valueAsNumber: true })}
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          label="Approximately how many hours per week do you spend on this step of the problem?"
        />

        <Typography variant="h6" gutterBottom>
          Additional Questions:
        </Typography>
        <TextField
          {...register("additionalChallenges")}
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          label="Are there any other significant challenges or pain points you face in managing school operations and learning activities that we haven't covered?"
        />
        <TextField
          {...register("feedback", { value: "yes" })}
          variant="outlined"
          fullWidth
          margin="normal"
          label="If we were to develop solutions to address the challenges you've mentioned, would it be okay if I get back to you for further input and feedback?"
        />

        <Box sx={{ my: 4 }}>
          <Typography variant="body1" gutterBottom>
            Thank you again for your valuable time and insights. Your
            feedback will help us improve Horace Learning to better meet your
            needs and streamline your workflow. We appreciate your participation
            and look forward to continuing our collaboration to enhance our
            solution.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Box>
      </form></Container><Footer />
    </Box>
  )
}

export default InterviewQuestionnaire