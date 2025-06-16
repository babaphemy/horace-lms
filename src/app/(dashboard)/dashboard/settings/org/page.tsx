"use client"
import { createOrg } from "@/app/api/rest"
import { orgDto } from "@/types/types"
import { notifyError } from "@/utils/notification"
import {
  Business,
  Email,
  Language,
  LocationOn,
  Phone,
  PhotoCamera,
  Save,
} from "@mui/icons-material"
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material"
import React, { useState } from "react"
import { Controller, useForm } from "react-hook-form"

const OrgPage = () => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  // Initialize with the provided data
  const defaultValues: Partial<orgDto> = {
    id: "684e58d4df81cc6605736c85",
    name: "ESSL",
    description: "Everlasting Systems and Solutions",
    logo: "",
    website: "",
    address: "12603 Mill Ridge Cypress",
    phone: "",
    email: "office@myeverlasting.net",
    country: "USA",
    state: "TX",
    city: "Fulshear",
    zip: "77429",
    createdBy: "admin@essl.net",
  }

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<orgDto>({
    defaultValues,
    mode: "onBlur",
  })

  const onSubmit = async (data: orgDto) => {
    setLoading(true)
    setSuccess(false)
    await createOrg(data)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      notifyError("Error saving organization:")
    } finally {
      setLoading(false)
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleReset = () => {
    reset()
    setLogoPreview(null)
    setSuccess(false)
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3, bgcolor: "primary.main", color: "white" }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Business sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Organization Settings
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Manage your organization&apos;s profile and contact information
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Success Alert */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Organization settings updated successfully!
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Logo and Basic Info */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Organization Logo
                </Typography>

                <Box
                  sx={{ position: "relative", display: "inline-block", mb: 2 }}
                >
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      mx: "auto",
                      bgcolor: "primary.light",
                      fontSize: "2rem",
                    }}
                    src={logoPreview || undefined}
                  >
                    {!logoPreview && watch("name")?.charAt(0)}
                  </Avatar>

                  <IconButton
                    component="label"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      bgcolor: "primary.main",
                      color: "white",
                      "&:hover": { bgcolor: "primary.dark" },
                    }}
                  >
                    <PhotoCamera />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                  </IconButton>
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Upload a logo for your organization
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Form Fields */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Business /> Basic Information
                </Typography>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="name"
                      control={control}
                      rules={{
                        required: "Organization name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters",
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Organization Name"
                          error={!!errors.name}
                          helperText={errors.name?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="email"
                      control={control}
                      rules={{
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Email Address"
                          type="email"
                          InputProps={{
                            startAdornment: (
                              <Email sx={{ mr: 1, color: "text.secondary" }} />
                            ),
                          }}
                          error={!!errors.email}
                          helperText={errors.email?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Description"
                          multiline
                          rows={3}
                          placeholder="Brief description of your organization"
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Phone Number"
                          InputProps={{
                            startAdornment: (
                              <Phone sx={{ mr: 1, color: "text.secondary" }} />
                            ),
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="website"
                      control={control}
                      rules={{
                        pattern: {
                          value:
                            /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                          message: "Invalid website URL",
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Website"
                          placeholder="https://www.example.com"
                          InputProps={{
                            startAdornment: (
                              <Language
                                sx={{ mr: 1, color: "text.secondary" }}
                              />
                            ),
                          }}
                          error={!!errors.website}
                          helperText={errors.website?.message}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Address Information */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <LocationOn /> Address Information
                </Typography>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                    <Controller
                      name="address"
                      control={control}
                      rules={{ required: "Address is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Street Address"
                          error={!!errors.address}
                          helperText={errors.address?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Controller
                      name="city"
                      control={control}
                      rules={{ required: "City is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="City"
                          error={!!errors.city}
                          helperText={errors.city?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Controller
                      name="state"
                      control={control}
                      rules={{ required: "State is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="State"
                          error={!!errors.state}
                          helperText={errors.state?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Controller
                      name="zip"
                      control={control}
                      rules={{ required: "ZIP code is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="ZIP Code"
                          error={!!errors.zip}
                          helperText={errors.zip?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Controller
                      name="country"
                      control={control}
                      rules={{ required: "Country is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Country"
                          error={!!errors.country}
                          helperText={errors.country?.message}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Action Buttons */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                onClick={handleReset}
                disabled={loading || !isDirty}
              >
                Reset Changes
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={loading || !isDirty}
                startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                sx={{ minWidth: 140 }}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default OrgPage
