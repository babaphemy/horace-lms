"use client"
import fb from "@/assets/img/fbcolor.webp"
import google from "@/assets/img/ggcolor.webp"
import { MODAL_SET } from "@/context/Action"
import { AppDpx } from "@/context/AppContext"
import useUser from "@/hooks/useUser"
import { loginStyles } from "@/styles/loginStyles"
import { notifyError, notifySuccess } from "@/utils/notification"
import { yupResolver } from "@hookform/resolvers/yup"
import MailOutlineIcon from "@mui/icons-material/MailOutline"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import {
  Alert,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material"
import { signIn, useSession } from "next-auth/react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import React, { Suspense, useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import * as yup from "yup"

const schema = yup.object().shape({
  email: yup
    .string()
    .email("A valid email is required")
    .required("You must enter a email"),
  password: yup
    .string()
    .required("Password is required!.")
    .min(4, "Password is too short - should be 4 chars minimum."),
})

const defaultValues = {
  email: "",
  password: "",
}

type loginProps = {
  email: string
  password: string
  type?: string
}

type Props = {
  modal?: boolean
}
const Login = (props: Props) => {
  const { data: session, status } = useSession()
  const params = useSearchParams()
  const { setUser } = useUser()
  const { modal = false } = props
  const dispatch = React.useContext(AppDpx)
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [al, setAlert] = React.useState<{
    show: boolean
    msg: string
  } | null>(null)
  const redirectFrom = params.get("redirect")

  useEffect(() => {
    // @ts-expect-error: next auth already defined this correctly
    if (status === "authenticated" || session?.user?.email) {
      notifySuccess("Login successful! Redirecting...")
      if (
        session?.user?.roles?.includes("ADMIN") ||
        session?.user?.roles?.includes("INSTRUCTOR")
      ) {
        router.push("/dashboard")
      } else {
        router.push(redirectFrom || "/courses")
      }
    }
  }, [status, session?.user?.email, session?.user?.roles, router, redirectFrom])

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  })

  const onSubmit = async (data: loginProps) => {
    setIsLoading(true)

    try {
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (response?.status === 200) {
        setUser()
        router.push("/")
      } else {
        notifyError("Invalid credentials or account not active!")
      }
    } catch (error) {
      notifyError("An error occurred. Please try again.")
      throw new Error(error instanceof Error ? error.message : String(error))
    } finally {
      setIsLoading(false)
      reset()
    }
  }

  const handleChangeTab = () => {
    if (modal) {
      dispatch({ type: MODAL_SET, data: { open: true, type: "signup" } })
      return
    }
    router.push("/sign-up")
  }

  const styles = {
    socials: {
      minWidth: modal ? "100%" : "70%",
    },
  }

  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn("google", { redirect: false })

      if (result?.error) {
        switch (result.error) {
          case "AccessDenied":
            notifyError(
              "Access denied. You may not be authorized to access this application."
            )
            break
          case "OAuthSignin":
          case "OAuthCallback":
            notifyError(
              "Error occurred during Google authentication. Please try again."
            )
            break
          default:
            notifyError(`Login failed: ${result.error}`)
        }
      }
    } catch {
      notifyError(`An error occurred during Google login`)
    }
  }

  return (
    <Box sx={loginStyles.right}>
      {Object.keys(errors).length > 0 && (
        <Alert severity="error">Form error</Alert>
      )}
      <Typography variant="h4" sx={[loginStyles.center, loginStyles.title]}>
        Login <Image src="/icons/yeah.svg" alt="yeah" width={30} height={30} />
      </Typography>

      <Box sx={{ ...loginStyles.socials, ...styles.socials }}>
        <Button
          onClick={handleGoogleSignIn}
          variant="outlined"
          sx={[loginStyles.center, loginStyles.button]}
          fullWidth
        >
          <Image src={google} alt="google" width={20} height={20} />
          Login with Google
        </Button>
        <Button
          variant="outlined"
          sx={[loginStyles.center, loginStyles.button]}
          fullWidth
        >
          <Image src={fb} alt="fb" width={25} height={25} />
          Login with Facebook
        </Button>
      </Box>
      <Box sx={loginStyles.dividerContainer}>
        <Divider sx={loginStyles.divider} />{" "}
        <Typography variant="body1" sx={{ mx: 2 }}>
          {" "}
          or{" "}
        </Typography>
        <Divider sx={loginStyles.divider} />
      </Box>
      {al?.show && (
        <Alert
          severity="error"
          onClose={() => setAlert(null)}
          sx={loginStyles.alert}
        >
          {al.msg}
        </Alert>
      )}
      <Box
        component="form"
        id="login-form"
        sx={loginStyles.form}
        onSubmit={handleSubmit(onSubmit)}
      >
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
        <Controller
          name="password"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              error={!!error}
              id="password"
              label="Password"
              variant="outlined"
              size="small"
              fullWidth
              sx={loginStyles.input}
              helperText={error?.message}
              InputProps={{
                type: showPassword ? "text" : "password",
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        <Typography
          variant="body1"
          sx={{
            textAlign: "right",
            width: "100%",
            paddingRight: "1rem",
          }}
        >
          <Link href="/forgot-password" underline="hover">
            Forgot Password?
          </Link>{" "}
        </Typography>

        <Button
          sx={[loginStyles.button, loginStyles.submit]}
          variant="contained"
          fullWidth
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Login in..." : "Login"}
        </Button>
      </Box>
      <Typography
        component={"button"}
        onClick={handleChangeTab}
        variant="body1"
        color="primary"
        sx={loginStyles.changeTab}
      >
        Don&apos;t have an account? Sign Up
      </Typography>
    </Box>
  )
}

const LoginComponent = (props: Props) => {
  return (
    <Suspense fallback={<Typography>Loading...</Typography>}>
      <Login {...props} />
    </Suspense>
  )
}

export default LoginComponent
