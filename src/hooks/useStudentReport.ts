import { useQuery } from "react-query"

const mockStudentReport = {
  student: {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/avatars/1.jpg",
  },
  courseProgress: {
    studentId: "1",
    courseId: "course-1",
    totalLessons: 20,
    completedLessons: 15,
    progress: 75,
    totalDuration: 1200,
    completedDuration: 850,
    averageScore: 85,
    lastActivity: "2024-01-15T10:30:00Z",
    startDate: "2024-01-01T00:00:00Z",
  },
  lessons: [
    {
      id: "1",
      title: "Introduction to Course",
      duration: 45,
      completed: true,
      completionDate: "2024-01-02",
      score: 90,
    },
    {
      id: "2",
      title: "Basic Concepts",
      duration: 60,
      completed: true,
      completionDate: "2024-01-03",
      score: 85,
    },
    {
      id: "3",
      title: "Advanced Topics",
      duration: 75,
      completed: true,
      completionDate: "2024-01-05",
      score: 80,
    },
    { id: "4", title: "Practical Exercises", duration: 90, completed: false },
    { id: "5", title: "Final Assessment", duration: 120, completed: false },
  ],
  quizScores: [
    {
      quizId: "quiz-1",
      quizTitle: "Module 1 Quiz",
      score: 18,
      maxScore: 20,
      percentage: 90,
      completedAt: "2024-01-03",
      passed: true,
    },
    {
      quizId: "quiz-2",
      quizTitle: "Module 2 Quiz",
      score: 16,
      maxScore: 20,
      percentage: 80,
      completedAt: "2024-01-05",
      passed: true,
    },
    {
      quizId: "quiz-3",
      quizTitle: "Mid-term Exam",
      score: 42,
      maxScore: 50,
      percentage: 84,
      completedAt: "2024-01-10",
      passed: true,
    },
  ],
  overallPerformance: {
    completionRate: 75,
    averageQuizScore: 84.7,
    timeSpent: 850,
    estimatedTimeRemaining: 350,
  },
}

export const useStudentReport = (studentId: string, courseId: string) => {
  return useQuery({
    queryKey: ["studentReport", studentId, courseId],
    queryFn: () => mockStudentReport,
    enabled: !!studentId && !!courseId,
  })
}
