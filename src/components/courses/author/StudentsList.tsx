import React, { useMemo, useState } from "react"
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
} from "@mui/material"
import { Search, MoreVert, Visibility, TrendingUp } from "@mui/icons-material"

import { useRouter } from "next/navigation"
import { LessonDto, ProgressData, Quiz, tCourse, tUser } from "@/types/types"
import { getUserProgress, userQuizScores } from "@/app/api/rest"
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

  const { courseQuiz } = useQuizSummary({ courseId: courseId as string })

  const filteredStudents = students?.filter(
    (student) =>
      `${student?.firstname} ${student?.lastname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

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

  return (
    <Box>
      {/* Search and Filters */}
      <Box sx={{ mb: 3 }}>
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
              <TableCell>Progress</TableCell>
              <TableCell>Completed</TableCell>
              <TableCell>Average Score</TableCell>
              <TableCell>Last Activity</TableCell>
              <TableCell>Enrollment Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents?.map((student, index) => (
              <StudentRow
                courseQuiz={courseQuiz}
                course={course}
                handleMenuOpen={handleMenuOpen}
                student={student}
                key={index}
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
            No students found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria
          </Typography>
        </Box>
      )}
    </Box>
  )
}

function StudentRow({
  student,
  course,
  courseQuiz,
  handleMenuOpen,
}: {
  courseQuiz: Quiz[]
  course: tCourse
  student: tUser
  handleMenuOpen: (_e: React.MouseEvent<HTMLElement>, _student: tUser) => void
}) {
  const { data: userScores } = useQuery({
    queryFn: () => userQuizScores(student?.id as string),
    queryKey: ["userQuizScores", student?.id],
    enabled: !!student?.id,
  })

  const { data: progress } = useQuery({
    queryKey: ["progress", student?.id],
    queryFn: () => getUserProgress(student?.id ?? ""),
    enabled: !!student?.id,
  })

  //? Calculate progress metrics
  const { lessonProgress, completedLessons, averageScore } = useMemo(() => {
    let calculatedLessonProgress = 0
    let calculatedCompletedLessons = 0
    let calculatedAverageScore = 0

    if (!course || !progress || !userScores) {
      return {
        lessonProgress: calculatedLessonProgress,
        completedLessons: calculatedCompletedLessons,
        averageScore: calculatedAverageScore,
      }
    }

    try {
      const lessons =
        course.curriculum?.topic?.flatMap(
          (topic) => topic.lessons as LessonDto[]
        ) || []

      const totalLessons = lessons.length

      if (totalLessons === 0) {
        return {
          lessonProgress: 0,
          completedLessons: 0,
          averageScore: 0,
        }
      }

      let totalCompletionPercentage = 0
      let completedCount = 0

      lessons.forEach((lesson: LessonDto) => {
        const lessonProgressData = progress?.progress?.find(
          (p: ProgressData) => p.lessonId === lesson.id
        )

        if (lessonProgressData) {
          totalCompletionPercentage +=
            lessonProgressData.completionPercentage || 0

          if (lessonProgressData.completionPercentage === 100) {
            completedCount++
          }
        }
      })

      calculatedLessonProgress =
        totalLessons > 0
          ? Math.round(totalCompletionPercentage / totalLessons)
          : 0

      calculatedCompletedLessons = completedCount

      const quizzes = courseQuiz || []
      let totalQuizScore = 0
      let quizCount = 0

      quizzes.forEach((quiz: Quiz) => {
        const quizScore = userScores?.find(
          (score) => String(score.quizId) === String(quiz.id)
        )

        if (quizScore) {
          const maxScore =
            quiz.passingScore || quiz.content?.passingScore || 100

          if (maxScore > 0) {
            const percentageScore = (quizScore.score / maxScore) * 100

            totalQuizScore += percentageScore
            quizCount++
          }
        }
      })

      calculatedAverageScore =
        quizCount > 0 ? Math.round(totalQuizScore / quizCount) : 0

      if (calculatedAverageScore > 100) {
        calculatedAverageScore = 100
      }
    } catch {
      throw "Error calculating student progress:"
    }

    return {
      lessonProgress: calculatedLessonProgress,
      completedLessons: calculatedCompletedLessons,
      averageScore: calculatedAverageScore,
    }
  }, [course, progress, userScores, courseQuiz])

  const totalLessons = useMemo(() => {
    if (course) {
      const lessons =
        course.curriculum?.topic?.flatMap(
          (topic) => topic.lessons as LessonDto[]
        ) || []
      return lessons.length
    }
    return 0
  }, [course])

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

  // Format last activity date safely
  const lastActivityDate = progress?.progress?.updatedAt
    ? new Date(progress.progress.updatedAt).toLocaleDateString()
    : "No activity"

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
        <Box sx={{ width: "100%", mr: 1 }}>
          <Box display="flex" alignItems="center">
            <TrendingUp
              sx={{ mr: 1, color: `${getProgressColor(lessonProgress)}.main` }}
            />
            <Typography variant="body2" sx={{ minWidth: 35 }}>
              {lessonProgress}%
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Chip
          label={`${completedLessons}/${totalLessons}`}
          size="small"
          color={completedLessons === totalLessons ? "success" : "default"}
        />
      </TableCell>
      <TableCell>
        <Chip
          label={`${averageScore}%`}
          size="small"
          color={getScoreColor(averageScore)}
          variant={averageScore === 0 ? "outlined" : "filled"}
        />
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
