"use client"
import {
  courseReport,
  registeredStudents,
  usersQuizScores,
  fetchCourse,
} from "@/app/api/rest"
import { useParams } from "next/navigation"
import { useQuery } from "react-query"
import { useMemo } from "react"
import { tUser } from "@/types/types"
import { TUserScore } from "@/types/types"
import * as XLSX from "xlsx"
import { Download, ArrowLeft } from "lucide-react"
import { notifyError, notifySuccess } from "@/utils/notification"
import Link from "next/link"

interface ProgressReport {
  courseId: string
  email: string
  courseName: string
  thumbnail: string
  progressPercentage: number
  completedLessons: number
  totalLessons: number
  completedTopics: number
  totalTopics: number
  completed: boolean
  enrolledOn: string | null
  lastAccessedOn: string | null
  completedOn: string | null
  topics: Array<{
    topicId: string
    title: string
    progressPercentage: number
    completedLessons: number
    totalLessons: number
    completed: boolean
  }>
  totalQuizScore: number | null
  totalMaxQuizScore: number | null
  averageQuizScorePercentage: number | null
  totalQuizzesTaken: number | null
}

interface StudentReport {
  student: tUser
  quizScores: TUserScore[]
  progress: ProgressReport | null
  averageQuizScore: number
  totalQuizzesCompleted: number
}

const formatDate = (dateString: string | null): string => {
  if (!dateString) return "N/A"
  try {
    const date = new Date(dateString)
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ]
    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    return `${day} ${month} ${year}`
  } catch {
    return "N/A"
  }
}

const CourseReportPage = () => {
  const params = useParams()
  const { id } = params

  const { data: students, isLoading: studentsLoading } = useQuery({
    queryKey: ["students-course-report", id],
    queryFn: () => registeredStudents(id as string),
    enabled: !!id,
  })
  const { data: userScores, isLoading: scoresLoading } = useQuery({
    queryFn: () =>
      usersQuizScores(
        students
          ?.map((student) => student.id)
          .filter((id): id is string => !!id) || []
      ),
    queryKey: [
      "userQuizScores",
      id,
      students?.map((s) => s.id).filter((id): id is string => !!id) || [],
    ],
    enabled: !!id && !!students && students.length > 0,
  })

  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ["progress", id],
    queryFn: () => courseReport(id as string),
    enabled: !!id,
  })

  const { data: course } = useQuery({
    queryKey: ["course", id],
    queryFn: () => fetchCourse(id as string),
    enabled: !!id,
  })

  // Map students to their quiz scores and progress
  const studentReports: StudentReport[] = useMemo(() => {
    if (!students || !userScores || !progress) {
      return []
    }

    return students.map((student) => {
      // Find quiz scores for this student
      const studentQuizScores = userScores.filter(
        (score) => score.userId === student.id
      )

      // Find progress report for this student by email
      const studentProgress = Array.isArray(progress)
        ? progress.find((p: ProgressReport) => p.email === student.email)
        : null

      // Calculate average quiz score percentage
      const averageQuizScore =
        studentQuizScores.length > 0
          ? Math.round(
              studentQuizScores.reduce((sum, score) => {
                const maxScore = score.maxScore > 0 ? score.maxScore : 100
                const percentage = (score.score / maxScore) * 100
                return sum + Math.min(percentage, 100)
              }, 0) / studentQuizScores.length
            )
          : 0

      return {
        student,
        quizScores: studentQuizScores,
        progress: studentProgress || null,
        averageQuizScore,
        totalQuizzesCompleted: studentQuizScores.length,
      }
    })
  }, [students, userScores, progress])

  const isLoading = studentsLoading || scoresLoading || progressLoading

  if (!id) {
    return <div className="p-4">Loading...</div>
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!students || students.length === 0) {
    return (
      <div className="p-6">
        <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
          <p className="text-sm text-blue-800">
            No students found for this course.
          </p>
        </div>
      </div>
    )
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-100 text-green-800 border-green-200"
    if (progress >= 50) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800 border-green-200"
    if (score >= 70) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  const getLessonsColor = (completed: number, total: number) => {
    if (completed === total)
      return "bg-green-100 text-green-800 border-green-200"
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  const handleExportToExcel = () => {
    try {
      if (!studentReports || studentReports.length === 0) {
        notifyError("No data to export")
        return
      }

      // Prepare export data
      const exportData = studentReports.map((report) => {
        const progressPercentage = report.progress?.progressPercentage || 0
        const completedLessons = report.progress?.completedLessons || 0
        const totalLessons = report.progress?.totalLessons || 0
        const lastActivity = report.progress?.lastAccessedOn
          ? formatDate(report.progress.lastAccessedOn)
          : "No activity"
        const enrollmentDate = report.student?.createdOn
          ? formatDate(report.student.createdOn)
          : "N/A"

        return {
          "Student Name": `${report.student.firstname} ${report.student.lastname}`,
          Email: report.student.email || "N/A",
          "Course Progress (%)": progressPercentage,
          "Lessons Completed": `${completedLessons}/${totalLessons}`,
          "Average Quiz Score (%)": report.averageQuizScore,
          "Quizzes Completed": report.totalQuizzesCompleted,
          "Last Activity": lastActivity,
          "Enrollment Date": enrollmentDate,
        }
      })

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(exportData)

      // Auto-size columns
      if (exportData.length > 0) {
        const maxWidth = 20
        const wscols = Object.keys(exportData[0] || {}).map((key) => ({
          wch: Math.min(
            Math.max(
              key.length,
              ...exportData.map(
                (row) => String(row[key as keyof typeof row] || "").length
              )
            ),
            maxWidth
          ),
        }))
        ws["!cols"] = wscols
      }

      XLSX.utils.book_append_sheet(wb, ws, "Students")

      // Generate filename with course name and date
      const courseName =
        progress && Array.isArray(progress) && progress[0]?.courseName
          ? progress[0].courseName
          : "Course"
      const sanitizedCourseName = courseName.replace(/[^a-z0-9]/gi, "_")
      const dateStr = new Date().toISOString().split("T")[0]
      const fileName = `${sanitizedCourseName}_Report_${dateStr}.xlsx`

      // Write file
      XLSX.writeFile(wb, fileName)
      notifySuccess("Course report exported successfully")
    } catch {
      notifyError("Failed to export course report")
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {course?.courseName || "Course Report"}
            </h1>
            <p className="text-gray-600">
              Student Progress Overview
              {students && students.length > 0 && (
                <span className="ml-2 font-medium">
                  ({students.length}{" "}
                  {students.length === 1 ? "student" : "students"})
                </span>
              )}
            </p>
          </div>
          <button
            onClick={handleExportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Export to Excel
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Course Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Lessons Completed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Average Quiz Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Quizzes Completed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Last Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Enrollment Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {studentReports.map((report) => {
                const progressPercentage =
                  report.progress?.progressPercentage || 0
                const completedLessons = report.progress?.completedLessons || 0
                const totalLessons = report.progress?.totalLessons || 0
                const lastActivity = report.progress?.lastAccessedOn
                  ? formatDate(report.progress.lastAccessedOn)
                  : "No activity"
                const enrollmentDate = report.student?.createdOn
                  ? formatDate(report.student.createdOn)
                  : "N/A"

                return (
                  <tr
                    key={report.student.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
                          {report.student.firstname?.charAt(0)}
                          {report.student.lastname?.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {report.student.firstname} {report.student.lastname}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getProgressColor(
                          progressPercentage
                        )}`}
                      >
                        {progressPercentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getLessonsColor(
                          completedLessons,
                          totalLessons
                        )}`}
                      >
                        {completedLessons}/{totalLessons}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          report.averageQuizScore === 0
                            ? "bg-gray-50 text-gray-600 border-gray-200 border-dashed"
                            : getScoreColor(report.averageQuizScore)
                        }`}
                      >
                        {report.averageQuizScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.totalQuizzesCompleted}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lastActivity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {enrollmentDate}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CourseReportPage
