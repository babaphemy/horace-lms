import { notifyError } from "@/utils/notification"
import * as z from "zod"
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  CircularProgress,
} from "@mui/material"

import React from "react"
import { Controller, useForm } from "react-hook-form"
import Link from "next/link"
import { registerUser, verifyEmail } from "@/app/api/rest"
// import { Appcontext, AppDpx } from "@/context/AppContext"
// import { useSession } from "next-auth/react"
// import { SET_STEP } from "@/context/Action"
import { Send } from "@mui/icons-material"
import { useMutation } from "react-query"

const formSchema = z.object({
  firstname: z.string().min(2, "Name is required"),
  lastname: z.string().min(2, "Name is required"),
  email: z
    .string()
    .email("Invalid email")
    .refine(async (e: string) => {
      const data = await verifyEmail(e)
      return data
    }, "Email already exists"),
  status: z.string(),
  owner_id: z.number(),
  address: z.object({
    phone_number: z.string().min(6, "Valid phone number required"),
    street: z.string().min(2, "Street is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    country: z.string().min(2, "Country is required"),
    zip_code: z.string().min(2, "Zip code required"),
  }),
})

const countries = [
  { code: "US", name: "United States" },
  { code: "NG", name: "Nigeria" },
  { code: "OT", name: "Other" },
]
interface Addschoolprops {
  callback?: (_user_id: string) => void
}
const AddSchoolForm: React.FC<Addschoolprops> = ({ callback }) => {
  //   const dispatch = useContext(AppDpx)
  //   const { plan } = useContext(Appcontext)
  //   const { data: session } = useSession()

  const form = useForm({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      status: "New",
      owner_id: 0,
      address: {
        phone_number: "",
        street: "",
        city: "",
        state: "",
        country: "",
        zip_code: "",
      },
    },
  })

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    // const owner_id =
    //   session?.user?.id && !isNaN(Number(session.user.id))
    //     ? +session.user.id
    //     : 1
    const userPayload = {
      firstname: data.firstname,
      lastname: data.lastname,
      type: "Guest",
      email: data.email,
      roles: ["Guest"],
      timestamp: new Date().toISOString(),
      password: "Password",
      is_active: false,
      gender: "Male",
      address: data.address,
    }
    userMutation.mutate(userPayload)
    // const schoolPayload = {
    //   name: data.name,
    //   email: data.email,
    //   status: data.status,
    //   owner_id,
    //   address: data.address,
    // }
    // if (session?.user?.id) {
    //   mutate(schoolPayload)
    //   if (plan !== null) {
    //     dispatch({ type: SET_STEP, payload: 3 })
    //   } else {
    //     dispatch({ type: SET_STEP, payload: 2 })
    //   }
    // } else {
    //   setPayload(schoolPayload)
    //   userMutation.mutate(userPayload)
    // }
  }

  const userMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: async (data) => {
      //@ts-ignore
      //dispatch({ type: SET_USER, data: data })
      //   mutate({ ...payload, owner_id: data.id })
      callback(data.id)
      form.reset()
    },
    onError: () => {
      notifyError("User Sign Up Failed")
    },
  })

  //   const { mutate, isLoading } = useMutation({
  //     mutationFn: addSchool,
  //     onSuccess: (data) => {
  //       notifySuccess("Registration is successful")
  //       if (callback) {
  //         callback(data.owner_id)
  //       }
  //       if (plan !== null) {
  //         dispatch({ type: SET_STEP, payload: 3 })
  //       } else {
  //         dispatch({ type: SET_STEP, payload: 2 })
  //       }
  //     },
  //     onError: () => {
  //       notifyError("School Sign Up Failed")
  //     },
  //   })

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: "42rem",
        mx: "auto",
        p: 4,
        borderRadius: 2,
      }}
    >
      <Box
        component="form"
        noValidate
        onSubmit={form.handleSubmit(handleSubmit)}
        sx={{ "& .MuiGrid-item": { mt: 3 } }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{ pb: 1, borderBottom: 1, borderColor: "divider" }}
          >
            Bio Information
          </Typography>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="firstname"
                control={form.control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="First Name"
                    placeholder="Enter first name"
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="lastname"
                control={form.control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="FirLastst Name"
                    placeholder="Enter first name"
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Email"
                    placeholder="Email Address"
                    type="email"
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="address.phone_number"
                control={form.control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Phone Number"
                    placeholder="Enter phone number"
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{ pb: 1, borderBottom: 1, borderColor: "divider" }}
          >
            Address Information
          </Typography>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Controller
                name="address.street"
                control={form.control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Street"
                    placeholder="Street address"
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="address.city"
                control={form.control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="City"
                    placeholder="City"
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="address.state"
                control={form.control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="State"
                    placeholder="State"
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="address.country"
                control={form.control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth error={!!error}>
                    <InputLabel id="country-select-label">Country</InputLabel>
                    <Select
                      {...field}
                      labelId="country-select-label"
                      label="Country"
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        <em>Select Country</em>
                      </MenuItem>
                      {countries.map((country) => (
                        <MenuItem key={country.code} value={country.code}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {error && <FormHelperText>{error.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="address.zip_code"
                control={form.control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Zip Code or LGA"
                    placeholder="Enter zip code or LGA"
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={userMutation.isLoading}
          sx={{ py: 1.5, mt: 2 }}
          endIcon={!userMutation.isLoading && <Send />}
        >
          {userMutation.isLoading ? (
            <>
              <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
              Processing...
            </>
          ) : (
            "Submit Registration"
          )}
        </Button>
      </Box>

      <Box
        sx={{
          mt: 4,
          textAlign: "center",
          pt: 2,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          By signing up, you agree to our
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Link
            href="https://docs.horacelearning.com/docs/policies/terms-of-service"
            target="_blank"
            rel="noreferrer"
            color="primary"
          >
            Terms of Service
          </Link>
          <Typography variant="body2" component="span" sx={{ mx: 1 }}>
            and
          </Typography>
          <Link
            href="https://docs.horacelearning.com/docs/policies/privacy-policy"
            target="_blank"
            rel="noreferrer"
            color="primary"
          >
            Privacy Policy
          </Link>
        </Box>
      </Box>
    </Paper>
  )
}

export default AddSchoolForm
