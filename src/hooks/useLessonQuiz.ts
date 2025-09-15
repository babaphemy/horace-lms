import { lessonQuiz } from "@/app/api/rest"
import { useQuery } from "react-query"

const useLessonQuiz = ({ lid }: { lid: string }) => {
  const {
    data: quiz,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["lessonQuiz", lid],
    queryFn: () => lessonQuiz(lid),
    refetchOnWindowFocus: false,
    enabled: !!lid,
  })
  return { quiz, isLoading, error }
}

export default useLessonQuiz
