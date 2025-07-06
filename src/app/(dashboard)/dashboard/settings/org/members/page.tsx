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
import {OrganizationMember} from "@/types/types"


const OrgMembers: React.FC = () => {
  const { data: session } = useSession()
  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingMember, setEditingMember] = useState<OrganizationMember | null>(
    null
  )
  const [memberForm, setMemberForm] = useState<{
    name: string
    email: string
    role: string
  }>({
    name: "",
    email: "",
    role: AccessRoles.USER,
  })

  const orgId = session?.user?.id

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setTimeout(() => {
          setMembers([
           // Mock data
           {
              id: '1',
              name: 'Tobi Adeyemi',
              email: 'tobiade@example.com',
              role: AccessRoles.ADMIN,
              joinedDate: '2025-01-15',
              status: 'active',
              logo: '',
              website: '',
              phone: '',
              createdBy: '',
            },
            {
              id: '2',
              name: 'John Joseph',
              email: 'john.joseph@example.com',
              role: AccessRoles.INSTRUCTOR,
              joinedDate: '2025-02-20',
              status: 'active',
              logo: '',
              website: '',
              phone: '',
              createdBy: '',
            },
            {
              id: '3',
              name: 'Esher Johnson',
              email: 'esther.johnson@example.com',
              role: AccessRoles.USER,
              joinedDate: '2025-03-10',
              status: 'pending',
              logo: '',
              website: '',
              phone: '',
              createdBy: '',
            },
          ])
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error fetching members:', error)
        setLoading(false)
      }
    }

    fetchMembers()
  }, [])
  
  const handleOpenDialog = (member?: OrganizationMember) => {
    if (member) {
      setEditingMember(member)
      setMemberForm({
        name: member.name,
        email: member.email,
        role: member.role,
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
                <TableCell>Status</TableCell>
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
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} />
                        ) : (
                          <PersonIcon />
                        )}
                      </Avatar>
                      <Typography variant="body1">{member.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {member.email}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={member.role} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip label={member.status} size="small" />
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
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
            >
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
