import { allCourseQuiz } from "@/app/api/rest"
import { useQuery } from "react-query"

const useQuizSummary = ({ courseId }: { courseId: string }) => {
  const { data: courseQuiz } = useQuery({
    queryKey: ["quiz", courseId],
    queryFn: () => allCourseQuiz(courseId),
    refetchOnWindowFocus: false,
    enabled: !!courseId,
  })
  return { courseQuiz }
}

export default useQuizSummary
