import React, { useMemo, useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Typography,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material"
import { Search, MoreVert, Visibility, CheckCircle } from "@mui/icons-material"

import { useRouter } from "next/navigation"
import { Quiz, tCourse, tUser, CourseProgressResponse } from "@/types/types"
import { getCourseProgressForStudent, userQuizScores } from "@/app/api/rest"
import { useQuery } from "react-query"
import useQuizSummary from "@/hooks/useQuizSummary"

interface StudentsListProps {
  students: tUser[]
  courseId: string
  course: tCourse
}

export const StudentsList: React.FC<StudentsListProps> = ({
  students,
  courseId,
  course,
}) => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedStudent, setSelectedStudent] = useState<tUser | null>(null)
  const [showCompletedOnly, setShowCompletedOnly] = useState(false)

  const { courseQuiz } = useQuizSummary({ courseId: courseId as string })
  const [studentCompletionMap, setStudentCompletionMap] = useState<
    Map<string, boolean>
  >(new Map())

  // Track completion status for all students
  // We'll update this map as progress data loads in StudentRow components
  useEffect(() => {
    const map = new Map<string, boolean>()
    students?.forEach((student) => {
      if (student.id) {
        map.set(student.id, false) // Initialize as not completed
      }
    })
    setStudentCompletionMap(map)
  }, [students])

  // Filter students based on search term and completion status
  const filteredStudents = useMemo(() => {
    let filtered =
      students?.filter(
        (student) =>
          `${student?.firstname} ${student?.lastname}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())
      ) || []

    // Apply completion filter if enabled
    if (showCompletedOnly) {
      filtered = filtered.filter(
        (student) => student.id && studentCompletionMap.get(student.id) === true
      )
    }

    return filtered
  }, [students, searchTerm, showCompletedOnly, studentCompletionMap])

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    student: tUser
  ) => {
    setAnchorEl(event.currentTarget)
    setSelectedStudent(student)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedStudent(null)
  }

  const handleViewReport = () => {
    if (selectedStudent) {
      router.push(
        `/dashboard/students/${selectedStudent.id}/courses/${courseId}/report`
      )
    }
    handleMenuClose()
  }

  const handleFilterChange = (
    _event: React.MouseEvent<HTMLElement>,
    newFilter: string | null
  ) => {
    if (newFilter !== null) {
      setShowCompletedOnly(newFilter === "completed")
    }
  }

  const completedCount = useMemo(() => {
    return (
      students?.filter(
        (student) => student.id && studentCompletionMap.get(student.id) === true
      ).length || 0
    )
  }, [students, studentCompletionMap])

  return (
    <Box>
      {/* Search and Filters */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          gap: 2,
          alignItems: "start",
          flexDirection: "column",
        }}
      >
        <ToggleButtonGroup
          value={showCompletedOnly ? "completed" : "all"}
          exclusive
          onChange={handleFilterChange}
          aria-label="student filter"
        >
          <ToggleButton value="all" aria-label="all students">
            All Students ({students?.length || 0})
          </ToggleButton>
          <ToggleButton value="completed" aria-label="completed students">
            <CheckCircle sx={{ mr: 1 }} />
            Completed ({completedCount})
          </ToggleButton>
        </ToggleButtonGroup>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search students by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Students Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Course Progress</TableCell>
              <TableCell>Lessons Completed</TableCell>
              <TableCell>Avg Quiz Score</TableCell>
              <TableCell>Quiz Progress</TableCell>
              <TableCell>Quiz Completion Rate</TableCell>
              <TableCell>Last Activity</TableCell>
              <TableCell>Enrollment Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents?.map((student) => (
              <StudentRow
                courseQuiz={courseQuiz}
                course={course}
                handleMenuOpen={handleMenuOpen}
                student={student}
                courseId={courseId}
                key={student.id}
                onCompletionStatusChange={(studentId, isCompleted) => {
                  setStudentCompletionMap((prev) => {
                    const newMap = new Map(prev)
                    newMap.set(studentId, isCompleted)
                    return newMap
                  })
                }}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewReport}>
          <Visibility sx={{ mr: 1 }} />
          View Detailed Report
        </MenuItem>
      </Menu>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <Box textAlign="center" py={6}>
          <Typography variant="h6" color="text.secondary">
            {showCompletedOnly
              ? "No completed students found"
              : "No students found"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {showCompletedOnly
              ? "No students have completed all lessons yet"
              : "Try adjusting your search criteria"}
          </Typography>
        </Box>
      )}
    </Box>
  )
}

function StudentRow({
  student,
  courseQuiz,
  handleMenuOpen,
  courseId,
  onCompletionStatusChange,
}: {
  courseQuiz: Quiz[]
  course: tCourse
  student: tUser
  courseId: string
  handleMenuOpen: (_e: React.MouseEvent<HTMLElement>, _student: tUser) => void
  onCompletionStatusChange?: (_studentId: string, _isCompleted: boolean) => void
}) {
  const { data: userScores } = useQuery({
    queryFn: () => userQuizScores(student?.id as string),
    queryKey: ["userQuizScores", student?.id],
    enabled: !!student?.id,
  })

  const { data: courseProgress } = useQuery<CourseProgressResponse | null>({
    queryKey: ["courseProgress", courseId, student?.id],
    queryFn: () => getCourseProgressForStudent(courseId, student?.id ?? ""),
    enabled: !!courseId && !!student?.id,
  })

  const { lessonProgress, completedLessons, totalLessons } = useMemo(() => {
    if (!courseProgress) {
      return {
        lessonProgress: 0,
        completedLessons: 0,
        totalLessons: 0,
      }
    }

    return {
      lessonProgress: Math.round(courseProgress.overallProgressPercentage || 0),
      completedLessons: courseProgress.completedLessons || 0,
      totalLessons: courseProgress.totalLessons || 0,
    }
  }, [courseProgress])

  // Notify parent of completion status when progress data changes
  useEffect(() => {
    if (courseProgress && onCompletionStatusChange && student.id) {
      const isCompleted =
        courseProgress.completedLessons === courseProgress.totalLessons &&
        courseProgress.totalLessons > 0
      onCompletionStatusChange(student.id, isCompleted)
    }
  }, [courseProgress, onCompletionStatusChange, student.id])

  // Quiz metrics
  const { averageScore, quizCompletionRate, quizProgress } = useMemo(() => {
    if (!courseQuiz || !userScores) {
      return {
        averageScore: 0,
        quizCompletionRate: 0,
        quizProgress: 0,
      }
    }

    try {
      const quizzes = courseQuiz || []
      const totalQuizzes = quizzes.length

      if (totalQuizzes === 0) {
        return {
          averageScore: 0,
          quizCompletionRate: 0,
          quizProgress: 0,
        }
      }

      let totalScorePercentage = 0
      let completedQuizCount = 0

      // Calculate average score including ALL quizzes (unattempted = 0%)
      quizzes.forEach((quiz: Quiz) => {
        const quizScore = userScores?.find(
          (score) => String(score.quizId) === String(quiz.id)
        )

        if (quizScore) {
          completedQuizCount++
          const maxScore = quizScore.maxScore > 0 ? quizScore.maxScore : 100
          const scorePercentage =
            maxScore > 0 ? (quizScore.score / maxScore) * 100 : 0
          totalScorePercentage += Math.min(scorePercentage, 100)
        } else {
          totalScorePercentage += 0
        }
      })

      const calculatedAverageScore =
        totalQuizzes > 0 ? Math.round(totalScorePercentage / totalQuizzes) : 0

      const calculatedQuizCompletionRate =
        totalQuizzes > 0
          ? Math.round((completedQuizCount / totalQuizzes) * 100)
          : 0

      const calculatedQuizProgress = calculatedQuizCompletionRate

      return {
        averageScore: calculatedAverageScore,
        quizCompletionRate: calculatedQuizCompletionRate,
        quizProgress: calculatedQuizProgress,
      }
    } catch {
      return {
        averageScore: 0,
        quizCompletionRate: 0,
        quizProgress: 0,
      }
    }
  }, [courseQuiz, userScores])

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "success"
    if (progress >= 50) return "warning"
    return "error"
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "success"
    if (score >= 70) return "warning"
    return "error"
  }

  const lastActivityDate = useMemo(() => {
    if (!courseProgress?.lastAccessedAt) return "No activity"

    try {
      return new Date(courseProgress.lastAccessedAt).toLocaleDateString()
    } catch {
      return "No activity"
    }
  }, [courseProgress])

  // Format enrollment date safely
  const enrollmentDate = student?.createdOn
    ? new Date(student.createdOn).toLocaleDateString()
    : "N/A"

  return (
    <TableRow key={student.id} hover>
      <TableCell>
        <Box display="flex" alignItems="center">
          <Avatar sx={{ mr: 2 }}>
            {student.firstname?.charAt(0)}
            {student.lastname?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body1" fontWeight="medium">
              {student.firstname} {student.lastname}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {student.email}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Chip
          label={`${lessonProgress}%`}
          size="small"
          color={getProgressColor(lessonProgress)}
          title="Overall course progress"
        />
      </TableCell>
      <TableCell>
        <Chip
          label={`${completedLessons}/${totalLessons}`}
          size="small"
          color={completedLessons === totalLessons ? "success" : "default"}
          title="Lessons completed"
        />
      </TableCell>
      <TableCell>
        <Chip
          label={`${averageScore}%`}
          size="small"
          color={getScoreColor(averageScore)}
          variant={averageScore === 0 ? "outlined" : "filled"}
          title="Average quiz score across all quizzes (unattempted = 0%)"
        />
      </TableCell>
      <TableCell>
        <Chip
          label={`${quizProgress}%`}
          size="small"
          color={getProgressColor(quizProgress)}
          title="Quiz progress"
        />
      </TableCell>
      <TableCell>
        <Chip
          label={`${quizCompletionRate}%`}
          size="small"
          color={quizCompletionRate === 100 ? "success" : "default"}
          title="Quiz completion rate"
        />
        {courseQuiz && courseQuiz.length > 0 && (
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ mt: 0.5 }}
          >
            {userScores?.filter((score) =>
              courseQuiz.some(
                (quiz: Quiz) => String(quiz.id) === String(score.quizId)
              )
            ).length || 0}
            /{courseQuiz.length} quizzes
          </Typography>
        )}
      </TableCell>
      <TableCell>{lastActivityDate}</TableCell>
      <TableCell>{enrollmentDate}</TableCell>
      <TableCell align="center">
        <IconButton size="small" onClick={(e) => handleMenuOpen(e, student)}>
          <MoreVert />
        </IconButton>
      </TableCell>
    </TableRow>
  )
}
