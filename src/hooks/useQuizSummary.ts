import { allCourseQuiz } from "@/app/api/rest"
import { useQuery } from "react-query"

const useQuizSummary = ({
  courseId,
  enabled = true,
}: {
  courseId: string
  enabled?: boolean
}) => {
  const { data: courseQuiz } = useQuery({
    queryKey: ["quiz", courseId],
    queryFn: () => allCourseQuiz(courseId),
    refetchOnWindowFocus: false,
    enabled: enabled && !!courseId,
  })
  return { courseQuiz }
}

export default useQuizSummary
