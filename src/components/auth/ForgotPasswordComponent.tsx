import { doToken, resetPass } from "@/app/api/rest"
import yeah from "@/assets/img/yeah.webp"
import { MODAL_SET, USER_ADD } from "@/context/Action"
import { AppDpx } from "@/context/AppContext"
import { loginStyles } from "@/styles/loginStyles"
import { yupResolver } from "@hookform/resolvers/yup"
import MailOutlineIcon from "@mui/icons-material/MailOutline"
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material"
import VpnKeyIcon from "@mui/icons-material/VpnKey"
import { PasswordRounded } from "@mui/icons-material"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React from "react"
import { Controller, useForm } from "react-hook-form"
import { useMutation } from "react-query"
import * as yup from "yup"
import { useSearchParams } from "next/navigation"
import { notifySuccess } from "@/utils/notification"

const schema = yup.object().shape({
  email: yup
    .string()
    .email("You must enter a valid email")
    .required("You must enter a email"),
  token: yup.string().required("Please enter your token."),
  password: yup.string().required("Please enter your new password."),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), ""], "Passwords must match")
    .required("Please confirm your password."),
})

// Props
type forgotPassProps = {
  email: string
  token: string
  password: string
  confirmPassword: string
}

type Props = {
  modal?: boolean
}
const ForgotPasswordComponent = (props: Props) => {
  const { modal = false } = props
  const searchParams = useSearchParams()
  const dispatch = React.useContext(AppDpx)
  const router = useRouter()
  const [al, setAlert] = React.useState<{
    show: boolean
    msg: string
  } | null>(null)

  const userEmail = searchParams?.get("userEmail")

  const defaultValues = {
    email: userEmail || "",
    token: "",
    password: "",
    confirmPassword: "",
  }

  const {
    control,
    handleSubmit,
    getValues,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  })

  const tokenMutation = useMutation(doToken, {
    onSuccess: () => {
      router.push("?userEmail=" + getValues("email"))
      notifySuccess("Password reset token sent to your email")
      return
    },
    onError: (error: any) => {
      setAlert({ show: true, msg: "Reset Password Failed, Please Try Again!" })
      console.log(error)
    },
  })

  const resetMutation = useMutation(resetPass, {
    onSuccess: (data: any) => {
      notifySuccess("Password reset successful!")
      if (modal) {
        dispatch({
          type: MODAL_SET,
          data: { open: true, type: "login" },
        })
      } else {
        router.push("/login")
      }
      reset(defaultValues)
    },
    onError: (error: any) => {
      setAlert({ show: true, msg: "Reset Password Failed, Please Try Again!" })
    },
  })

  const onSubmit = (data: forgotPassProps) => {
    resetMutation.mutate({
      email: data.email,
      token: data.token,
      password: data.password,
      type: "USER",
    })
  }

  const handleChangeTab = () => {
    if (modal) {
      dispatch({ type: MODAL_SET, data: { open: true, type: "signup" } })
      return
    }
    router.push("/sign-up")
  }

  return (
    <Box sx={loginStyles.right}>
      <Typography variant="h4" sx={[loginStyles.center, loginStyles.title]}>
        Forgot Password <Image src={yeah} alt="yeah" width={30} height={30} />
      </Typography>

      {al?.show && (
        <Alert
          severity="error"
          onClose={() => setAlert(null)}
          sx={loginStyles.alert}
        >
          {al.msg}
        </Alert>
      )}
      <Box component="form" id="login-form" sx={loginStyles.form}>
        <Controller
          name="email"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              error={!!error}
              id="email"
              label="Email"
              variant="outlined"
              size="small"
              type="email"
              fullWidth
              sx={loginStyles.input}
              helperText={error?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <MailOutlineIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        {userEmail && (
          <>
            <Controller
              name="token"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  error={!!error}
                  id="token"
                  label="Token"
                  variant="outlined"
                  size="small"
                  type="token"
                  fullWidth
                  sx={loginStyles.input}
                  helperText={error?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton>
                          <PasswordRounded />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  sx={loginStyles.input}
                  size="small"
                  fullWidth
                  type="password"
                  label="Password"
                  error={!!errors.password}
                  helperText={errors?.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <VpnKeyIcon />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  required
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  sx={loginStyles.input}
                  size="small"
                  fullWidth
                  type="password"
                  label="Confirm Password"
                  error={!!errors.confirmPassword}
                  helperText={errors?.confirmPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <VpnKeyIcon />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  required
                />
              )}
            />
          </>
        )}

        <Typography
          variant="body1"
          sx={{
            textAlign: "right",
            width: "100%",
            paddingRight: "1rem",
          }}
        >
          <Link href="/login" underline="hover">
            Remember Password?
          </Link>{" "}
        </Typography>

        <Button
          sx={[loginStyles.button, loginStyles.submit]}
          variant="contained"
          fullWidth
          onClick={
            userEmail
              ? handleSubmit(onSubmit)
              : () =>
                  tokenMutation.mutate({
                    email: getValues("email"),
                    type: "USER",
                  })
          }
        >
          {userEmail ? "Submit" : "Send Reset Token"}
        </Button>
      </Box>
      <Typography
        component={"button"}
        onClick={handleChangeTab}
        variant="body1"
        color="primary"
        sx={loginStyles.changeTab}
      >
        Don't have an account? Sign Up
      </Typography>
    </Box>
  )
}

export default ForgotPasswordComponent
