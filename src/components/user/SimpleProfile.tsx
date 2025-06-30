"use client"

import React, { useState, useRef, ChangeEvent, useEffect } from "react"
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Grid,
  Divider,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardHeader,
  Backdrop,
  CircularProgress,
  MenuItem,
} from "@mui/material"
import {
  PhotoCamera,
  Edit,
  Save,
  Cancel,
  Lock,
  Person,
  Email,
  Phone,
  LocationOn,
  Work,
  CalendarToday,
} from "@mui/icons-material"
import HomeIcon from "@mui/icons-material/Home"
import { styled } from "@mui/material/styles"
import { useMutation, useQuery, useQueryClient } from "react-query"
import {
  doEdit,
  getUserById,
  resetOwnPass,
  uploadImageToS3,
} from "@/app/api/rest"
import { useSession } from "next-auth/react"
import { notifyError, notifyInfo, notifySuccess } from "@/utils/notification"
import * as yup from "yup"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { tUser } from "@/types/types"
import { useRouter } from "next/navigation"

interface PasswordFormData {
  current: string
  new: string
  confirm: string
}
const profileSchema = yup.object({
  firstname: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastname: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email")
    .defined(),
  phone: yup
    .string()
    .matches(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"),
  organization: yup
    .string()
    .max(100, "Organization name must be less than 100 characters"),
  roles: yup.array().of(yup.string()).required(),
  type: yup.string().required("User type is required"),
  bio: yup.string().max(500, "Bio must be less than 500 characters"),
  address: yup.string().optional(),
  country: yup.string().optional(),
  city: yup.string().optional(),
  state: yup.string().optional(),
  zip: yup.string().optional(),
})

const passwordSchema = yup.object({
  current: yup.string().required("Current password is required"),
  new: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirm: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("new")], "Passwords do not match"),
})
interface NotificationProps {
  open: boolean
  message: string
  severity: "success" | "info" | "warning" | "error"
}

const ProfileContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}))

const ProfileHeader = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: "white",
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(3),
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
  },
}))

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[8],
}))

const PhotoUploadButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  bottom: -8,
  right: -8,
  backgroundColor: theme.palette.primary.main,
  color: "white",
  width: 40,
  height: 40,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}))

const SectionCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[2],
  transition: "box-shadow 0.3s ease-in-out",
  "&:hover": {
    boxShadow: theme.shadows[4],
  },
}))

const SimpleProfile = () => {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const router = useRouter()

  const [editMode, setEditMode] = useState(false)
  const [passwordDialog, setPasswordDialog] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [notification, setNotification] = useState<NotificationProps>({
    open: false,
    message: "",
    severity: "success",
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    control: profileControl,
    handleSubmit: handleProfileSubmit,
    reset: resetProfileForm,
    formState: { errors: profileErrors, isDirty: isProfileDirty },
    watch,
  } = useForm<tUser>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      organization: "",
      roles: [""],
      type: "",
      bio: "",
      address: "",
      country: "",
      city: "",
      state: "",
      zip: "",
    },
  })

  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      current: "",
      new: "",
      confirm: "",
    },
  })

  const { data: userData, isLoading } = useQuery({
    queryKey: ["user", session?.user?.id],
    queryFn: () => getUserById(session?.user?.id as string),
    enabled: !!session?.user?.id,
    onSuccess: (data) => {
      resetProfileForm({
        firstname: data.firstname || "",
        lastname: data.lastname || "",
        email: data.email || "",
        phone: data.phone || "",
        organization: data.organizationId || "",
        roles: data.roles || [""],
        type: data.roles[0] || "",
        bio: data.bio || "",
        address: data.address || "",
        country: data.country || "",
        city: data.city || "",
        state: data.state || "",
        zip: data.zip || "",
      })
    },
  })

  useEffect(() => {
    if (session?.user?.id && userData) {
      resetProfileForm({
        firstname: userData.firstname || "",
        lastname: userData.lastname || "",
        email: userData.email || "",
        phone: userData.phone || "",
        organization: userData.organizationId || "",
        roles: userData.roles || [""],
        type: userData.roles[0] || "",
        bio: userData.bio || "",
        address: userData.address || "",
        country: userData.country || "",
        city: userData.city || "",
        state: userData.state || "",
        zip: userData.zip || "",
      })
    }
  }, [session?.user?.id, userData, resetProfileForm])

  const { mutate: resetPassword, isLoading: isResetting } = useMutation(
    resetOwnPass,
    {
      onSuccess: () => {
        notifySuccess("Password changed successfully")
        setPasswordDialog(false)
        resetPasswordForm()
      },
      onError: () => {
        notifyError("Failed to change password!")
      },
    }
  )
  const { mutate: editUser, isLoading: isEditing } = useMutation(doEdit, {
    onSuccess: () => {
      queryClient.invalidateQueries(["user", session?.user?.id])
      notifySuccess("Profile updated successfully")
      setEditMode(false)
    },
    onError: () => {
      notifyError("Failed to update profile!")
    },
  })

  const handleEditToggle = () => {
    if (editMode) {
      if (userData) {
        resetProfileForm({
          firstname: userData.firstname || "",
          lastname: userData.lastname || "",
          email: userData.email || "",
          phone: userData.phone || "",
          organization: userData.organizationId || "",
          roles: userData.roles || [""],
          type: userData.roles[0] || "",
          bio: userData.bio || "",
          address: userData.address || "",
          country: userData.country || "",
          city: userData.city || "",
          state: userData.state || "",
          zip: userData.zip || "",
        })
      }
    }
    setEditMode(!editMode)
  }

  const onProfileSubmit: SubmitHandler<tUser> = (data) => {
    if (!userData) return

    const orgId = data.organizationId ? data.organizationId.split("_")[0] : ""

    const updatedUser: tUser = {
      ...userData,
      ...data,
      organizationId: orgId,
    }

    editUser(updatedUser)
  }

  const onPasswordSubmit = (data: PasswordFormData) => {
    resetPassword({
      token: data.current,
      email: userData?.email || "",
      password: data.new,
    })
  }
  const handlePhotoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    setLoading(true)
    const file = event.target.files ? event.target.files[0] : null
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        notifyInfo("File size must be less than 5MB")
        return
      }
      if (!file.type.startsWith("image/")) {
        notifyInfo("Please select a valid image file")
        return
      }
      try {
        const uploadUrl = await uploadImageToS3(file)
        if (userData) {
          userData.type = userData?.roles[0] || ""
          editUser({ ...userData, dp: uploadUrl })
          notifySuccess("Profile photo updated!")
        }
      } catch {
        notifyError("Failed to upload image")
      }
    }
    setLoading(false)
  }

  const watchedValues = watch()
  const displayUser = editMode ? { ...userData, ...watchedValues } : userData

  if (isLoading) {
    return (
      <Backdrop open={true} sx={{ color: "#fff", zIndex: 9999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  }
  if (!userData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Failed to load user data</Alert>
        <Button variant="text" onClick={() => router.push("/")}>
          <HomeIcon sx={{ mr: 1 }} />
          Go to Home
        </Button>
      </Container>
    )
  }

  return (
    <ProfileContainer maxWidth="lg">
      <ProfileHeader elevation={0}>
        <Box
          display="flex"
          alignItems="center"
          gap={3}
          position="relative"
          zIndex={1}
        >
          <Box position="relative">
            <StyledAvatar
              src={displayUser?.dp}
              alt={`${displayUser?.firstname} ${displayUser?.lastname}`}
            >
              {`${displayUser?.firstname?.[0] || ""}${displayUser?.lastname?.[0] || ""}`}
            </StyledAvatar>
            {loading && <CircularProgress />}
            <PhotoUploadButton
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              size="small"
            >
              <PhotoCamera fontSize="small" />
            </PhotoUploadButton>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              style={{ display: "none" }}
            />
          </Box>

          <Box flex={1}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {`${displayUser?.firstname || ""} ${displayUser?.lastname || ""}`}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }} gutterBottom>
              {displayUser?.organization || ""} {displayUser?.roles[0]}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>
              {displayUser?.bio}
            </Typography>
          </Box>
        </Box>
      </ProfileHeader>

      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid size={{ xs: 12, md: 8 }}>
          <SectionCard>
            <CardHeader
              title="Personal Information"
              avatar={<Person color="primary" />}
              action={
                <Button
                  startIcon={editMode ? <Cancel /> : <Edit />}
                  onClick={handleEditToggle}
                  variant={editMode ? "outlined" : "contained"}
                >
                  {editMode ? "Cancel" : "Edit"}
                </Button>
              }
            />
            <CardContent>
              <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="firstname"
                      control={profileControl}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="First Name"
                          disabled={!editMode}
                          variant="outlined"
                          error={!!profileErrors.firstname}
                          helperText={profileErrors.firstname?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="lastname"
                      control={profileControl}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Last Name"
                          disabled={!editMode}
                          variant="outlined"
                          error={!!profileErrors.lastname}
                          helperText={profileErrors.lastname?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="email"
                      control={profileControl}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Email"
                          type="email"
                          disabled
                          variant="outlined"
                          error={!!profileErrors.email}
                          helperText={profileErrors.email?.message}
                          InputProps={{
                            startAdornment: (
                              <Email color="action" sx={{ mr: 1 }} />
                            ),
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="phone"
                      control={profileControl}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Phone"
                          disabled={!editMode}
                          variant="outlined"
                          error={!!profileErrors.phone}
                          helperText={profileErrors.phone?.message}
                          InputProps={{
                            startAdornment: (
                              <Phone color="action" sx={{ mr: 1 }} />
                            ),
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="organization"
                      control={profileControl}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Organization"
                          disabled={!editMode}
                          variant="outlined"
                          error={!!profileErrors.organization}
                          helperText={profileErrors.organization?.message}
                          InputProps={{
                            startAdornment: (
                              <LocationOn color="action" sx={{ mr: 1 }} />
                            ),
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="roles.0"
                      control={profileControl}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Role"
                          disabled={!editMode}
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <Work color="action" sx={{ mr: 1 }} />
                            ),
                          }}
                        >
                          <MenuItem value="INSTRUCTOR">INSTRUCTOR</MenuItem>
                          <MenuItem value="STUDENT">STUDENT</MenuItem>
                          <MenuItem value="SCHOOL">SCHOOL</MenuItem>
                          <MenuItem value="CORPORATE">CORPORATE</MenuItem>
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                      name="address"
                      control={profileControl}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Address"
                          disabled={!editMode}
                          variant="outlined"
                          error={!!profileErrors.address}
                          helperText={profileErrors.address?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Controller
                      name="city"
                      control={profileControl}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="City"
                          disabled={!editMode}
                          variant="outlined"
                          error={!!profileErrors.city}
                          helperText={profileErrors.city?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Controller
                      name="state"
                      control={profileControl}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="State"
                          disabled={!editMode}
                          variant="outlined"
                          error={!!profileErrors.state}
                          helperText={profileErrors.state?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Controller
                      name="zip"
                      control={profileControl}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Zip Code"
                          disabled={!editMode}
                          variant="outlined"
                          error={!!profileErrors.zip}
                          helperText={profileErrors.zip?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Controller
                      name="country"
                      control={profileControl}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Country"
                          disabled={!editMode}
                          variant="outlined"
                          error={!!profileErrors.country}
                          helperText={profileErrors.country?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Controller
                      name="bio"
                      control={profileControl}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Bio"
                          multiline
                          rows={3}
                          disabled={!editMode}
                          variant="outlined"
                          error={!!profileErrors.bio}
                          helperText={profileErrors.bio?.message}
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                {editMode && (
                  <Box mt={3} display="flex" gap={2} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      onClick={handleEditToggle}
                      startIcon={<Cancel />}
                      disabled={isEditing}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<Save />}
                      disabled={isEditing || !isProfileDirty}
                    >
                      {isEditing ? "Saving..." : "Save Changes"}
                    </Button>
                  </Box>
                )}
              </form>
            </CardContent>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <SectionCard>
            <CardHeader
              title="Account Settings"
              avatar={<Lock color="primary" />}
            />
            <CardContent>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <CalendarToday color="action" />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Member since
                    </Typography>
                    <Typography variant="body1">
                      {userData?.createdOn
                        ? new Date(userData.createdOn).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : "Unknown"}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Lock />}
                  onClick={() => setPasswordDialog(true)}
                  sx={{ mb: 2 }}
                >
                  Change Password
                </Button>
              </Box>
            </CardContent>
          </SectionCard>
        </Grid>
      </Grid>

      {/* Password Change Dialog */}
      <Dialog
        open={passwordDialog}
        onClose={() => setPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Password</DialogTitle>

        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={3} mt={1}>
              <Controller
                name="current"
                control={passwordControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="password"
                    label="Current Password"
                    variant="outlined"
                    error={!!passwordErrors.current}
                    helperText={passwordErrors.current?.message}
                  />
                )}
              />
              <Controller
                name="new"
                control={passwordControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="password"
                    label="New Password"
                    variant="outlined"
                    error={!!passwordErrors.new}
                    helperText={
                      passwordErrors.new?.message ||
                      "Password must contain uppercase, lowercase, and number"
                    }
                  />
                )}
              />
              <Controller
                name="confirm"
                control={passwordControl}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="password"
                    label="Confirm New Password"
                    variant="outlined"
                    error={!!passwordErrors.confirm}
                    helperText={passwordErrors.confirm?.message}
                  />
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setPasswordDialog(false)
                resetPasswordForm()
              }}
              disabled={isResetting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isResetting}>
              {isResetting ? "Changing..." : "Change Password"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Backdrop
        open={isEditing || isResetting}
        sx={{ color: "#fff", zIndex: 9999 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </ProfileContainer>
  )
}

export default SimpleProfile
