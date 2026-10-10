import { fetchCourse } from "@/app/api/rest"
import { useQuery } from "react-query"

const useCourse = (courseId: string, userId?: string | null) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["course", courseId, userId],
    queryFn: () => fetchCourse(courseId, userId || undefined),
    refetchOnWindowFocus: false,
    enabled: !!courseId,
  })
  return { data, isLoading, error }
}

export default useCourse
