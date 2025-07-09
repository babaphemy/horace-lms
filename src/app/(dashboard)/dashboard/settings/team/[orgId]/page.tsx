"use client"

import { use, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "react-query"
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { addUserToOrganization, getTeamMembers } from "@/app/api/rest"
import { notifyError, notifySuccess } from "@/utils/notification"

interface User {
  id: string
  firstname: string
  lastname: string
  email: string
  roles: string[]
  createdOn: string
}

interface OrganizationUsersResponse {
  content: User[]
  pageable: {
    pageNumber: number
    pageSize: number
  }
  totalElements: number
  totalPages: number
  last: boolean
  first: boolean
}

const OrganizationUsersPage = ({
  params,
}: {
  params: Promise<{ orgId: string }>
}) => {
  const { orgId } = use(params)
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)

  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [email, setEmail] = useState("")

  const { data, isLoading, isError } = useQuery<OrganizationUsersResponse>({
    queryKey: ["organizationUsers", orgId, page],
    queryFn: () => getTeamMembers(orgId as string, page),
    enabled: !!orgId,
    keepPreviousData: true,
  })

  const addUserMutation = useMutation({
    mutationFn: () => addUserToOrganization(email, orgId as string),
    onSuccess: () => {
      queryClient.invalidateQueries(["organizationUsers", orgId])
      notifySuccess("User added to organization successfully")
      handleCloseAddDialog()
    },
    onError: () => {
      notifyError("Failed to add user to organization")
    },
  })

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true)
  }

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false)
    setEmail("")
  }

  const handleAddUser = () => {
    if (!email || !orgId) return
    addUserMutation.mutate()
  }

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    )
  }

  if (isError) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Typography color="error">Failed to load organization users</Typography>
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 6,
        }}
      >
        <Typography variant="h5" component="h1">
          Organization Users
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
          sx={{ ml: 2 }}
        >
          Add User
        </Button>
      </Box>

      {data?.content.length === 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <Typography variant="h6" gutterBottom>
            No users in this organization yet
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{ mt: 2 }}
          >
            Add User to Organization
          </Button>
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date Added</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Roles</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.content.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {new Date(user.createdOn).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{`${user.firstname} ${user.lastname}`}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.roles.join(", ")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {data && (
            <TablePagination
              rowsPerPageOptions={[10]}
              component="div"
              count={data.totalElements}
              rowsPerPage={10}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={() => {}}
            />
          )}
        </>
      )}

      {/* Add User Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Add User to Organization</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
            Enter the user&apos;s email to add them to your organization
          </Typography>
          <TextField
            label="User Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button
            onClick={handleAddUser}
            disabled={!email || addUserMutation.isLoading}
            variant="contained"
          >
            {addUserMutation.isLoading ? (
              <CircularProgress size={24} />
            ) : (
              "Add User"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default OrganizationUsersPage
