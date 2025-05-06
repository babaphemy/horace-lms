import { useState } from "react"
import { notifyError, notifySuccess } from "@/utils/notification"
import { portalAuth } from "@/app/api/rest"
import { Box, Button, Stack, TextField, Typography } from "@mui/material"
import { ArrowRightAlt } from "@mui/icons-material"

interface LoginFormData {
  email: string
  password: string
}
interface Props {
  callback?: (_user_id: string) => void
}

const CheckoutLogin: React.FC<Props> = ({ callback }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      notifyError("Please fill in all fields.")
      return
    }
    try {
      const response = await portalAuth({
        email: formData.email,
        password: formData.password,
        type: "ADMIN",
      })
      if (response?.id) {
        notifySuccess("Login successful")
        if (callback) {
          callback(response.id)
        }
      } else {
        notifyError("Login failed! Invalid credentials")
      }
    } catch {
      const err = "An error occurred! invalid account."
      notifyError(err)
    }
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }
  return (
    <Box sx={{ pt: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography
            component="label"
            htmlFor="login-email"
            variant="body2"
            sx={{ mb: 1, display: "block" }}
          >
            Email
          </Typography>
          <TextField
            id="login-email"
            type="email"
            name="email"
            onChange={handleInputChange}
            placeholder="Enter your email"
            fullWidth
            size="medium"
            variant="outlined"
          />
        </Box>
        <Box>
          <Typography
            component="label"
            htmlFor="login-password"
            variant="body2"
            sx={{ mb: 1, display: "block" }}
          >
            Password
          </Typography>
          <TextField
            id="login-password"
            name="password"
            onChange={handleInputChange}
            type="password"
            placeholder="Enter your password"
            fullWidth
            size="medium"
            variant="outlined"
          />
        </Box>
        <Button
          variant="contained"
          fullWidth
          onClick={handleLogin}
          endIcon={<ArrowRightAlt />}
        >
          Sign In
        </Button>
      </Stack>
    </Box>
  )
}
export default CheckoutLogin
