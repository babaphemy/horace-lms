import { fetchCourse } from "@/app/api/rest"
import { useQuery } from "react-query"

const useCourse = (courseId: string, userId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["course", courseId, userId],
    queryFn: () => fetchCourse(courseId, userId),
    refetchOnWindowFocus: false,
    enabled: !!userId && !!courseId,
  })
  return { data, isLoading, error }
}

export default useCourse
