"use client"
import {
  Alert,
  Box,
  Container,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  Paper,
  Button,
} from "@mui/material"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { Controller, useForm } from "react-hook-form"
import MailOutlineIcon from "@mui/icons-material/MailOutline"
import PersonOutlineIcon from "@mui/icons-material/PersonOutline"
import PhoneIcon from "@mui/icons-material/Phone"
import MapOutlinedIcon from "@mui/icons-material/MapOutlined"
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk"
import { useMutation } from "react-query"
import { useState } from "react"
import { contactUs } from "../api/rest"
import Header from "@/components/Header"
import Map from "@/components/Map"
import Footer from "@/components/Footer"
import { useRouter } from "next/navigation"
import { tContact } from "@/types/types"

const schema = yup.object().shape({
  firstname: yup.string().required("First name is required"),
  lastname: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("You must enter a valid email")
    .required("You must enter a email"),
  phone: yup.string().required("Phone number is required"),
  message: yup.string().required("Message is required"),
  type: yup.string().default("PMP"),
})

const defaultValues = {
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  type: "PMP",
  message: "",
}
// export const metadata = generateMetadata({
//   title: "Horace Learning Management Solution | Horace Contact",
//   description:
//     "Horace Online Courses. STEM focused online courses for all ages",
// });

const ContactUs = () => {
  const router = useRouter()
  const [al, setAlert] = useState<{
    show: boolean
    msg: string
    type: "success" | "error"
  } | null>(null)
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  })

  const { mutate, isLoading } = useMutation(contactUs, {
    onSuccess: (_data) => {
      setAlert({
        show: true,
        msg: "Your message has been sent successfully",
        type: "success",
      })
      reset(defaultValues)
    },
    onError: (_error) => {
      setAlert({
        show: true,
        msg: "Something went wrong, please try again",
        type: "error",
      })
    },
  })

  const onSubmit = (data: tContact) => {
    mutate(data)
  }
  const emailAddress = "office@horacelearning.com"
  return (
    <Box>
      <Header />
      <Container>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: "bold", my: 1 }}>
            Contact Us
          </Typography>
          <Typography variant="body1">
            Our Friendly Customer Service Team would like to hear from you.
          </Typography>
        </Box>
        <Paper sx={contactStyles.container}>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={contactStyles.form}
          >
            {al?.show && (
              <Alert
                severity={al?.type}
                onClose={() => setAlert(null)}
                sx={contactStyles.alert}
              >
                {al.msg}
              </Alert>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="firstname"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      sx={contactStyles.input}
                      size="small"
                      fullWidth
                      type="text"
                      label="First name"
                      error={!!errors.firstname}
                      helperText={errors?.firstname?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <PersonOutlineIcon />
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      required
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="lastname"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      sx={contactStyles.input}
                      size="small"
                      fullWidth
                      type="text"
                      label="Last name"
                      error={!!errors.lastname}
                      helperText={errors?.lastname?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <PersonOutlineIcon />
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      required
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                {" "}
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      sx={contactStyles.input}
                      size="small"
                      fullWidth
                      type="text"
                      error={!!errors.email}
                      helperText={errors?.email?.message}
                      label="Email"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <MailOutlineIcon />
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      required
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      sx={contactStyles.input}
                      size="small"
                      fullWidth
                      type="text"
                      error={!!errors.phone}
                      helperText={errors?.phone?.message}
                      label="Phone"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <PhoneIcon />
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      required
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Controller
                  name="message"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      sx={contactStyles.input}
                      multiline
                      rows={4}
                      size="small"
                      fullWidth
                      type="text"
                      error={!!errors.message}
                      helperText={errors?.message?.message}
                      label="Message"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <MailOutlineIcon />
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      required
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Button type="submit" sx={contactStyles.button}>
                  Send Message
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box sx={contactStyles.map}>
            <Map />
          </Box>
        </Paper>
        <Paper sx={contactStyles.othersContainer}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={contactStyles.gridBox}>
                <div className="flex items-center justify-center p-2 w-fit mb-5 rounded-md bg-orange-500 text-white cursor-pointer">
                  <MailOutlineIcon />
                </div>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Email Us Now
                </Typography>
                <Typography variant="body2" mb={2}>
                  Our team wants to hear from you
                </Typography>
                <Typography
                  variant="body2"
                  mb={2}
                  sx={{
                    fontWeight: "bold",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    (window.location.href = `mailto:${emailAddress}`)
                  }
                >
                  {emailAddress}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={contactStyles.gridBox}>
                <div className="flex items-center justify-center p-2 w-fit mb-5 rounded-md bg-orange-500 text-white cursor-pointer">
                  <MapOutlinedIcon />
                </div>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Visit Us
                </Typography>
                <Typography variant="body2" mb={2}>
                  Visit our head office
                </Typography>
                <Typography variant="body2" mb={2} sx={{ fontWeight: "bold" }}>
                  Barrone Drive, Cypress,TX, USA
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={contactStyles.gridBox}>
                <div className="flex items-center justify-center p-2 w-fit mb-5 rounded-md bg-orange-500 text-white cursor-pointer">
                  <PhoneInTalkIcon />
                </div>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Call Us
                </Typography>
                <Typography variant="body2" mb={2}>
                  Mon - Sat 9am - 5pm
                </Typography>
                <Typography variant="body2" mb={2} sx={{ fontWeight: "bold" }}>
                  +1 346 580 9700
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={contactStyles.gridBox}>
                <div className="flex items-center justify-center flex-col text-center">
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    Join Horace Today
                  </Typography>
                  <Typography variant="body2" mb={1}>
                    Over 1000+ students have joined our professional courses and
                    learning platform
                  </Typography>
                  <Button
                    variant="contained"
                    sx={contactStyles.otherButton}
                    className="bg-orange-500 text-white cursor-pointer"
                    onClick={() => router.push("/sign-up")}
                    disabled={isLoading}
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="outlined"
                    sx={contactStyles.otherButton}
                    onClick={() => router.push("/about")}
                  >
                    Learn More
                  </Button>
                </div>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <Footer />
    </Box>
  )
}

export default ContactUs

const contactStyles = {
  container: {
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    borderRadius: 3,
    my: "50px",
  },
  othersContainer: {
    p: 2,
  },
  otherButton: {
    px: 3,
    borderRadius: 3,
    textTransform: "capitalize",
    mb: "10px",
    width: "100%",
  },
  gridBox: {
    backgroundColor: "#FF685422",
    borderRadius: 3,
    minHeight: "14.5rem",
    p: 2,
  },
  form: {
    flex: 1,
    p: 5,
  },
  map: {
    flex: 1,
  },
  button: {
    backgroundColor: "#FF6854 !important",
    color: "#fff",
    px: 3,
    borderRadius: 10,
    textTransform: "capitalize",
    mb: "20px",
  },

  alert: {
    my: 2,
    borderRadius: 2,
  },
  input: {
    borderRadius: 3,

    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
    },
    "& .MuiOutlinedInput-input": {
      fontSize: "16px",
      fontWeight: 400,
    },
  },
  submit: {
    background: "#1A055F !important",
    color: "white !important",
    "&:hover": {
      background: "#000000 !important",
    },
  },
}
