"use client"
import { commonStyles } from "@/styles/common"
import { dashboardStyles } from "@/styles/dashboard"
import { Add } from "@mui/icons-material"
import {
  Box,
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableContainer,
  TextField,
} from "@mui/material"
import { useState } from "react"
import GeneralTableHeader from "../table/GeneralTableHeader"
import SubjectsTableBody from "../table/SubjectsTableBody"
import GeneralTableFooter, { DataItem } from "../table/GeneralTableFooter"
import { CourseCreate, TableClickType, tCourse } from "@/types/types"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
export const categories = ["web"]
const isStudent = false
const tableHeaderCells: string[] = ["Subject", "Class", "Lessons", "Action"]
const processedSubjects: tCourse[] = [
  {
    id: "course-001",
    author: {
      id: "user-001",
      firstname: "Alice Smith",
      email: "alice@example.com",
      roles: ["admin"],
    },
    courseName: "Advanced Math",
    category: "web",
    target: "High School Students",
    description: "An advanced course on mathematical concepts.",
    image: "https://dummyimage.com/600x400/000/fff",
    price: 99.99,
    status: true,
    curriculum: {
      section: [],
      objective: [],
    },
    brief: "A brief overview of the Advanced Math course.",
    tax: 5.0,
    createdOn: "2025-05-14T12:00:00Z",
    thumbnail: "https://dummyimage.com/150x150/000/fff",
    updatedOn: "2025-05-14T12:00:00Z",
    totalSteps: 10,
    draft: false,
    posts: [], // add dummy posts if required
    assetCount: {
      topicCount: 5,
      lessonCount: 20,
      labCount: 3,
      quizCount: 4,
      downloadCount: 2,
      noteCount: 10,
    },
  },
]
const defaultValues: CourseCreate = {
  user: "",
  overview: "",
  courseName: "",
}
export const schema = yup.object({
  user: yup.string().required("User is required"),
  courseName: yup.string().required("Course name is required"),
  overview: yup.string().required("Overview is required"),
})
const CourseDashboard = () => {
  const router = useRouter()
  const [searchInput, setSearchInput] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("web")
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)

  const [isLoading] = useState<boolean>(false)
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchInput(event.target.value)
  }
  const [sortValue, setSortValue] = useState<string>("")
  const form = useForm<CourseCreate>({
    mode: "all",
    defaultValues,
    resolver: yupResolver(schema),
  })
  const handleSort = (event: SelectChangeEvent<string>): void => {
    setSortValue(event.target.value)
  }
  const handleFilterCategory = (event: SelectChangeEvent<string>): void => {
    const filter = event.target.value
    setSelectedCategory(filter)
  }
  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ): void => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  const emptyRows: number =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - (processedSubjects.length || 0))
      : 0
  const handleTableClick = (subject: tCourse, type: TableClickType): void => {
    if (type === "delete") {
    }
    if (type === "edit") {
      form.reset(subject)
    }
    if (type === "view") {
      router.push(`/subject/${subject.id}`)
    }
  }
  return (
    <div>
      <Card sx={commonStyles.card}>
        <Box sx={dashboardStyles.container}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            fullWidth
            value={searchInput}
            onChange={handleSearch}
            sx={dashboardStyles.textField}
          />

          <Box sx={dashboardStyles.buttonContainer}>
            <FormControl size="small" sx={dashboardStyles.formControl}>
              <InputLabel sx={dashboardStyles.select}>Sort</InputLabel>
              <Select
                value={sortValue}
                onChange={handleSort}
                label="Sort"
                sx={dashboardStyles.select}
              >
                <MenuItem value={""} sx={dashboardStyles.menuItem}>
                  None
                </MenuItem>
                <MenuItem value={"asc"} sx={dashboardStyles.menuItem}>
                  Ascending (A-Z)
                </MenuItem>
                <MenuItem value={"desc"} sx={dashboardStyles.menuItem}>
                  Descending (Z-A)
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={dashboardStyles.formControl}>
              <InputLabel sx={dashboardStyles.select}>
                Filter by Category
              </InputLabel>
              <Select
                value={selectedCategory}
                onChange={handleFilterCategory}
                label="Filter by Class"
                sx={dashboardStyles.select}
              >
                <MenuItem value={""} sx={dashboardStyles.menuItem}>
                  All
                </MenuItem>
                {categories.map((item) => (
                  <MenuItem
                    key={item}
                    value={String(item || "")}
                    sx={dashboardStyles.menuItem}
                  >
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {!isStudent && (
              <Button
                variant="text"
                startIcon={<Add />}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: { xs: "8px 12px", md: "8px 16px" },
                  whiteSpace: "nowrap",
                }}
                href={"/dashboard/courses/add"}
              >
                Add Course
              </Button>
            )}
          </Box>
        </Box>
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: "none",
          }}
        >
          <Table
            sx={{ minWidth: 850 }}
            aria-label="custom pagination table"
            className="dark-table"
          >
            <GeneralTableHeader cells={tableHeaderCells} />
            <SubjectsTableBody
              rowsPerPage={rowsPerPage}
              page={page}
              filteredData={processedSubjects}
              emptyRows={emptyRows}
              handleUserClick={handleTableClick}
              isLoading={isLoading}
            />
            <GeneralTableFooter
              data={processedSubjects as DataItem[]}
              rowsPerPage={rowsPerPage}
              page={page}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Table>
        </TableContainer>
      </Card>
      {/* <ModalComponent
        open={openModal}
        onClose={handleClose}
        title="Add/Edit Subjects"
      >
        <SubjectForm
          form={form}
          isLoading={
            addSubjectMutation.isPending || editSubjectMutation.isPending
          }
          onSubmit={handleSubmit}
        />
      </ModalComponent> */}
    </div>
  )
}
export default CourseDashboard
