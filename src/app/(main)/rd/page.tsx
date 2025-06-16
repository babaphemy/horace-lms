"use client"
import ModalLogin from "@/components/auth/ModalLogin"
import SignUpLogin from "@/components/auth/ModalSignUp"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { MODAL_SET } from "@/context/Action"
import { AppDpx, Appcontext } from "@/context/AppContext"
import { IAnswer } from "@/types/types"
import { notifyError, notifySuccess } from "@/utils/notification"
import { yupResolver } from "@hookform/resolvers/yup"
import {
  Alert,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material"
import { useContext } from "react"
import { useForm } from "react-hook-form"
import { useMutation } from "react-query"
import * as yup from "yup"
import { submitInterview } from "../../api/rest"

const schema = yup.object().shape({
  alignment: yup.string().label("Alignment").required(),
  misalignment: yup.string().label("Misalignment").required(),
  hardest: yup.string().label("Hardest").required(),
  whyHardest: yup.string().label("Why Hardest"),
  currentSolution: yup.string().label("Current Solution"),
  strengthsCurrentSolution: yup
    .string()
    .label("Strengths Current Solution")
    .required(),
  weaknessCurrentSolution: yup
    .string()
    .label("Weakness Current Solution")
    .required(),
  problemtime: yup.number().label("Problem Time"),
  painpoint: yup.string().label("Pain Point").required(),
  willTryHorace: yup.string().label("Will Try Horace"),
})

const defaultValues = {
  alignment: "",
  misalignment: "",
  hardest: "",
  whyHardest: "",
  currentSolution: "",
  strengthsCurrentSolution: "",
  weaknessCurrentSolution: "",
  problemtime: 0,
  painpoint: "",
  willTryHorace: "",
}
const InterviewQuestionnaire = () => {
  const { user } = useContext(Appcontext)
  const dispatch = useContext(AppDpx)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  })

  const { mutate } = useMutation(submitInterview, {
    onSuccess: () => {
      notifySuccess("Thank you for your feedback!")
      reset()
      return
    },
    onError: () => {
      notifyError("Something went wrong")
      return
    },
  })

  const onSubmit = async (data: IAnswer) => {
    if (!user || !user.id) {
      return dispatch({ type: MODAL_SET, data: { open: true, type: "login" } })
    }
    const userInfo = {
      fullname: user?.firstname + " " + user?.lastname,
      email: user?.email,
      phone: user?.phone,
    }

    mutate({
      response: {
        person: userInfo,
        answer: data,
      },
    })
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
          {Object.keys(errors).length > 0 && (
            <Alert severity="error">Form error</Alert>
          )}
          <Typography variant="body1" gutterBottom>
            Introduction: Thank you for taking the time to participate in this
            interview. We are exploring ways to improve our school management
            ERP and LMS solution, Horace Learning, to better align with your
            workflow and address your needs. Your feedback is invaluable in
            helping us understand your challenges and develop effective
            solutions.
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h6" gutterBottom>
            Workflow Alignment:
          </Typography>
          <TextField
            {...register("alignment")}
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            error={!!errors.alignment}
            helperText={errors.alignment?.message}
            label="Could you please walk me through your typical workflow for managing school operations and learning activities?"
          />
          <TextField
            {...register("misalignment")}
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            helperText={errors.misalignment?.message}
            error={!!errors.misalignment}
            label="If the workflow of Horace Learning does not align with how you currently operate, what are the key areas of misalignment?"
          />

          <Typography variant="h6" gutterBottom>
            For each step in the workflow:
          </Typography>
          <TextField
            {...register("hardest")}
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            error={!!errors.hardest}
            helperText={errors.hardest?.message}
            label="What is the hardest part of this step for you? (Try to understand the problem)"
          />
          <TextField
            {...register("whyHardest")}
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            error={!!errors.whyHardest}
            helperText={errors.whyHardest?.message}
            label="Why is that a problem for you? (Understand the emotion behind the problem)"
          />
          <TextField
            {...register("currentSolution")}
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            error={!!errors.currentSolution}
            helperText={errors.currentSolution?.message}
            label="How are you currently solving this problem? (Access if they are searching for solutions)"
          />
          <TextField
            {...register("strengthsCurrentSolution")}
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            error={!!errors.strengthsCurrentSolution}
            helperText={errors.strengthsCurrentSolution?.message}
            label="What do you like about your current solution?"
          />
          <TextField
            {...register("weaknessCurrentSolution")}
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            error={!!errors.weaknessCurrentSolution}
            helperText={errors.weaknessCurrentSolution?.message}
            label="What do you not like about your current solution? (Don't look for gaps)"
          />
          <TextField
            {...register("problemtime", { valueAsNumber: true })}
            type="number"
            variant="outlined"
            fullWidth
            margin="normal"
            helperText={errors.problemtime?.message}
            error={!!errors.problemtime}
            label="Approximately how many hours per week do you spend on this step of the problem?"
          />

          <Typography variant="h6" gutterBottom>
            Additional Questions:
          </Typography>
          <TextField
            {...register("painpoint")}
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            error={!!errors.painpoint}
            helperText={errors.painpoint?.message}
            label="Are there any other significant challenges or pain points you face in managing school operations and learning activities that we haven't covered?"
          />
          <TextField
            {...register("willTryHorace", { value: "yes" })}
            variant="outlined"
            fullWidth
            margin="normal"
            error={!!errors.willTryHorace}
            helperText={errors.willTryHorace?.message}
            label="If we were to develop solutions to address the challenges you've mentioned, would it be okay if I get back to you for further input and feedback?"
          />

          <Box sx={{ my: 4 }}>
            <Typography variant="body1" gutterBottom>
              Thank you again for your valuable time and insights. Your feedback
              will help us improve Horace Learning to better meet your needs and
              streamline your workflow. We appreciate your participation and
              look forward to continuing our collaboration to enhance our
              solution.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Box>
        </form>
        <ModalLogin />
        <SignUpLogin />
      </Container>
      <Footer />
    </Box>
  )
}

export default InterviewQuestionnaire
