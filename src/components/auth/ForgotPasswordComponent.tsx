import { yupResolver } from "@hookform/resolvers/yup"
import {
  Box,
  Typography,
  Button,
  Divider,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
  Link,
} from "@mui/material"
import { useRouter } from "next/navigation"
import React from "react"
import { useForm, Controller } from "react-hook-form"
import { useMutation } from "react-query"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import MailOutlineIcon from "@mui/icons-material/MailOutline"
import fb from "@/assets/img/fbcolor.webp"
import google from "@/assets/img/ggcolor.webp"
import yeah from "@/assets/img/yeah.webp"
import * as yup from "yup"
import Image from "next/image"
import { AppDpx } from "@/context/AppContext"
import { loginUser } from "@/app/api/rest"
import { MODAL_SET, USER_ADD } from "@/context/Action"
import { loginStyles } from "@/styles/loginStyles"

const schema = yup.object().shape({
  email: yup
    .string()
    .email("You must enter a valid email")
    .required("You must enter a email"),
})

const defaultValues = {
  email: "",
}

// Props
type forgotPassProps = {
  email: string
}

type Props = {
  modal?: boolean
}
const ForgotPasswordComponent = (props: Props) => {
  const { modal = false } = props
  const dispatch = React.useContext(AppDpx)
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const [al, setAlert] = React.useState<{
    show: boolean
    msg: string
  } | null>(null)

  const {
    control,
    handleSubmit,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  })

  const forgotPass = async () => {
    return
  }

  const { mutate } = useMutation(forgotPass, {
    onSuccess: (data: any) => {
      localStorage.setItem("horaceUser", JSON.stringify(data))
      dispatch({ type: USER_ADD, payload: data })
      if (modal) {
        dispatch({
          type: MODAL_SET,
          data: { open: false, type: "forgotPassword" },
        })
      } else {
        router.push("/")
      }
      reset(defaultValues)
    },
    onError: (error: any) => {
      setAlert({ show: true, msg: "Reset Password Failed, Please Try Again!" })
    },
  })

  const onSubmit = (data: forgotPassProps) => {
    mutate(data as any)
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
          type="submit"
        >
          Send Email
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
