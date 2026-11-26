"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import RefreshIcon from "@mui/icons-material/Refresh"
import { AccessRoles } from "@/utils/roles"
import { LmsAuthorization } from "@/utils/lmsAuthorization"
import { normalizeRoles } from "@/utils/userRoles"
import {
  changeUserRoles,
  fetchOrganizationMembers,
  fetchUserOrganization,
} from "@/app/api/rest"

interface MemberRow {
  id: string
  name: string
  email: string
  roles: string[]
}
const roleLabel = (role: string) => role.replace(/^ROLE_/, "").toLowerCase()

export default function OrgMembers() {
  const { data: session, status } = useSession()
  const userId = session?.user?.id
  const isAdmin = new LmsAuthorization(session?.user).isAdmin()
  const [members, setMembers] = useState<MemberRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [emptyMessage, setEmptyMessage] = useState("")
  const [reload, setReload] = useState(0)
  const [editing, setEditing] = useState<MemberRow | null>(null)
  const [roles, setRoles] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    let disposed = false
    setMembers([])
    setEditing(null)
    if (status !== "authenticated" || !isAdmin || !userId) return
    setLoading(true)
    setError("")
    setEmptyMessage("")
    const load = async () => {
      try {
        const org = await fetchUserOrganization(userId)
        if (disposed) return
        if (!org?.id) {
          setEmptyMessage("No organization is associated with this account.")
          return
        }
        const data = await fetchOrganizationMembers(org.id)
        if (disposed) return
        setMembers(
          data.map((member) => ({
            id: member.id,
            name:
              [member.firstname, member.lastname].filter(Boolean).join(" ") ||
              member.name ||
              member.email,
            email: member.email,
            roles: normalizeRoles(member.roles ?? member.role),
          }))
        )
        if (!data.length) setEmptyMessage("No organization members found.")
      } catch (cause) {
        if (!disposed)
          setError(
            cause instanceof Error
              ? cause.message
              : "Could not load organization members."
          )
      } finally {
        if (!disposed) setLoading(false)
      }
    }
    void load()
    return () => {
      disposed = true
    }
  }, [userId, status, isAdmin, reload])

  const save = async () => {
    if (!editing || !isAdmin || saving || !roles.length) return
    setSaving(true)
    setSaveError("")
    try {
      await changeUserRoles(editing.id, roles)
      if (editing.id === userId) {
        await signOut({ callbackUrl: "/login" })
        return
      }
      setSuccess(
        `Roles updated for ${editing.name}. The member must sign in again to refresh their session.`
      )
      setEditing(null)
      setReload((current) => current + 1)
    } catch (cause) {
      setSaveError(
        cause instanceof Error ? cause.message : "Could not save roles."
      )
    } finally {
      setSaving(false)
    }
  }

  if (status === "loading")
    return (
      <Container sx={{ py: 6 }}>
        <CircularProgress aria-label="Checking administrator access" />
      </Container>
    )
  if (!isAdmin)
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">
          Administrator access is required to manage roles.
        </Alert>
      </Container>
    )

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Typography variant="h4">Organization members</Typography>
        <Button
          startIcon={<RefreshIcon />}
          disabled={loading || saving}
          onClick={() => setReload((current) => current + 1)}
        >
          Refresh
        </Button>
      </Stack>
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert
          severity="error"
          action={
            <Button onClick={() => setReload((current) => current + 1)}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}
      {loading ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <CircularProgress aria-label="Loading members" />
        </Box>
      ) : !error && !members.length ? (
        <Alert severity="info">{emptyMessage || "No members found."}</Alert>
      ) : (
        !error && (
          <TableContainer>
            <Table size="small" aria-label="Organization member roles">
              <TableHead>
                <TableRow>
                  <TableCell>Member</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Roles</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell component="th" scope="row">
                      {member.name}
                    </TableCell>
                    <TableCell sx={{ overflowWrap: "anywhere" }}>
                      {member.email}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" flexWrap="wrap" gap={0.5}>
                        {member.roles.map((role) => (
                          <Chip
                            size="small"
                            key={role}
                            label={roleLabel(role)}
                          />
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit roles">
                        <IconButton
                          aria-label={`Edit roles for ${member.name}`}
                          onClick={() => {
                            setEditing(member)
                            setRoles(member.roles)
                            setSaveError("")
                            setSuccess("")
                          }}
                        >
                          <EditOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}
      <Dialog
        open={!!editing}
        onClose={() => {
          if (!saving) setEditing(null)
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit roles: {editing?.name}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {saveError && <Alert severity="error">{saveError}</Alert>}
            <FormControl fullWidth disabled={saving}>
              <InputLabel id="member-roles-label">Roles</InputLabel>
              <Select
                multiple
                labelId="member-roles-label"
                label="Roles"
                value={roles}
                renderValue={(selected) => selected.map(roleLabel).join(", ")}
                onChange={(event) =>
                  setRoles(
                    typeof event.target.value === "string"
                      ? event.target.value.split(",")
                      : event.target.value
                  )
                }
              >
                {[...new Set([...Object.values(AccessRoles), ...roles])].map(
                  (role) => (
                    <MenuItem key={role} value={role}>
                      <Checkbox checked={roles.includes(role)} />
                      <ListItemText primary={roleLabel(role)} />
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
            {roles.includes(AccessRoles.MENTOR) &&
              (roles.includes(AccessRoles.ADMIN) ||
                roles.includes(AccessRoles.INSTRUCTOR)) && (
                <Alert severity="warning">
                  Admin and instructor roles retain their broader permissions.
                  Remove them for mentor-only access.
                </Alert>
              )}
            {editing?.id === userId && (
              <Alert severity="warning">
                Changing your own roles will sign you out.
              </Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button disabled={saving} onClick={() => setEditing(null)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={saving || !roles.length}
            onClick={save}
          >
            {saving ? "Saving..." : "Save roles"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
