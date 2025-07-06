"use client"
import React, { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert,
  CircularProgress,
  Container,
} from "@mui/material"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from "@mui/icons-material"
import { useSession } from "next-auth/react"
import { AccessRoles } from "@/utils/util"
import {
  fetchOrganizationMembers,
  fetchUserOrganization, 
} from "@/app/api/rest"
import { OrganizationMember } from "@/types/types"
import { notifyError } from "@/utils/notification"


const OrgMembers: React.FC = () => {
  const { data: session } = useSession()
  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [loading, setLoading] = useState(true)
  const [orgId, setOrgId] = useState<string | null>(null) // 👈 store org ID
  const [openDialog, setOpenDialog] = useState(false)
  const [editingMember, setEditingMember] = useState<OrganizationMember | null>(null)
  const [memberForm, setMemberForm] = useState({
    name: "",
    email: "",
    role: AccessRoles.USER,
  })

  // ✅ Step 1: Get organization ID for the user
  useEffect(() => {
    const getOrgAndMembers = async () => {
      if (!session?.user?.id) {
        notifyError("User is not logged in")
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        // 👇 Fetch organization by user ID
        const org = await fetchUserOrganization(session.user.id)
        if (!org || !org.id) {
          notifyError("No organization found for this user")
          setLoading(false)
          return
        }
        setOrgId(org.id)

        // ✅ Step 2: Fetch members by org ID
        const data = await fetchOrganizationMembers(org.id)
        console.log(data);
        
        const transformedMembers = data.map((member: any) => ({
          id: member.id,
          name: `${member.firstname} ${member.lastname}`,
          email: member.email,
          role: member.roles || member.roles as keyof typeof AccessRoles,
          joinedDate: member.createdOn || new Date().toISOString().split("T")[0],
          status: member.status,
          avatar: member.dp,
          logo: member.logo || "",
          website: member.website || "",
          phone: member.phone || "",
          createdBy: member.createdBy || "",
        }))

        setMembers(transformedMembers)
      } catch (error) {
        console.error("Error loading organization data:", error)
        notifyError("Error loading organization or members")
      } finally {
        setLoading(false)
      }
    }

    getOrgAndMembers()
  }, [session])

  const handleOpenDialog = (member?: OrganizationMember) => {
    if (member) {
      setEditingMember(member)
      setMemberForm({
        name: member.name,
        email: member.email,
        role: AccessRoles.USER
      })
    } else {
      setEditingMember(null)
      setMemberForm({
        name: "",
        email: "",
        role: AccessRoles.USER,
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingMember(null)
    setMemberForm({
      name: "",
      email: "",
      role: AccessRoles.USER,
    })
  }

  const handleSubmit = async () => {
    try {
      if (editingMember) {
        setMembers((prev) =>
          prev.map((member) =>
            member.id === editingMember.id
              ? { ...member, ...memberForm }
              : member
          )
        )
      } else {
        const newMember: OrganizationMember = {
          id: Date.now().toString(),
          ...memberForm,
          joinedDate: new Date().toISOString().split("T")[0],
          status: "pending",
          logo: "", 
          website: "", 
          phone: "", 
          createdBy: session?.user?.id || "", 
        }
        setMembers((prev) => [...prev, newMember])
      }
      handleCloseDialog()
    } catch (error) {
      console.error("Error saving member:", error)
    }
  }

  const handleDeleteMember = async (memberId: string) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      try {
        setMembers((prev) => prev.filter((member) => member.id !== memberId))
      } catch (error) {
        console.error("Error deleting member:", error)
      }
    }
  }

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
  <Box sx={{ p: 3 }}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
      }}
    >
      <Typography variant="h4" component="h1">
        Organization Members
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => handleOpenDialog()}
      >
        Add Member
      </Button>
    </Box>

    <Alert severity="info" sx={{ mb: 3 }}>
      Manage your organization members. Only administrators can view and
      modify member information.
    </Alert>

    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Member</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Joined Date</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar sx={{ mr: 2 }}>
                    {member.dp ? (
                      <img src={member.dp} alt={member.name} />
                    ) : (
                      <PersonIcon />
                    )}
                  </Avatar>
                  <Typography variant="body1">{member.name}</Typography>
                </Box>
              </TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {(Array.isArray(member.role) ? member.role : [member.role]).map((role: string) => (
                    <Chip key={role} label={role} size="small" />
                  ))}
                </Box>
              </TableCell>
              <TableCell>
                {new Date(member.joinedDate).toLocaleDateString()}
              </TableCell>
              <TableCell align="right">
                <IconButton
                  onClick={() => handleOpenDialog(member)}
                  color="primary"
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteMember(member.id)}
                  color="error"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {editingMember ? "Edit Member" : "Add New Member"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            label="Full Name"
            value={memberForm.name}
            onChange={(e) =>
              setMemberForm((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={memberForm.email}
            onChange={(e) =>
              setMemberForm((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={memberForm.role}
              label="Role"
              onChange={(e) =>
                setMemberForm((prev) => ({ ...prev, role: e.target.value }))
              }
            >
              <MenuItem value={AccessRoles.USER}>User</MenuItem>
              <MenuItem value={AccessRoles.INSTRUCTOR}>Instructor</MenuItem>
              <MenuItem value={AccessRoles.ADMIN}>Admin</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {editingMember ? "Update" : "Add"} Member
        </Button>
      </DialogActions>
    </Dialog>
  </Box>
</Container>

  )
}

export default OrgMembers
