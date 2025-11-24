"use client"
import Footer from "@/components/Footer"
import CoursesSearch from "@/components/courses/CoursesSearch"
import { AppDpx } from "@/context/AppContext"
import { COURSES_SET } from "@/context/actions"
import { tCourse, tCourseLte } from "@/types/types"
import { Box, Container } from "@mui/material"
import Fuse, { FuseResult } from "fuse.js"
import { debounce } from "lodash"
import { useContext, useEffect, useState } from "react"
import { useQuery } from "react-query"
import { myRegisteredCourses } from "../../api/rest"

import CourseData from "@/components/courses/CourseData"
import { coursefilter } from "@/utils/util"
import { useSession } from "next-auth/react"

export type FilterItem = {
  label: string
  value: string
}

const Courses = () => {
  const [allCourses, setAllCourses] = useState([])
  const [filteredData, setFilteredData] = useState<tCourseLte[] | []>([])
  const [currentFilter, setCurrentFilter] = useState(coursefilter[0])
  const { data: session } = useSession()

  const dispatch = useContext(AppDpx)
  const { data, isLoading } = useQuery({
    queryKey: ["usersRegisteredCourses", session?.user?.id],
    queryFn: () => myRegisteredCourses(session?.user?.id as string),
    refetchOnWindowFocus: false,
    enabled: !!session?.user?.id,
  })

  const handleSearch = debounce(async (query: string) => {
    const fuse = new Fuse<tCourse>(data, {
      keys: ["category", "courseName"],
      includeScore: false,
      includeMatches: true,
      minMatchCharLength: 3,
    })

    const searchResults: FuseResult<tCourseLte>[] = fuse.search(query)
    const result: tCourseLte[] = searchResults.map((item) => item.item)

    if (result.length < 1) {
      setFilteredData(allCourses)
      return
    }
    setFilteredData(result)
  }, 700)

  useEffect(() => {
    if (data?.length > 0) {
      setFilteredData(data)
      setAllCourses(data)
      dispatch({ type: COURSES_SET, data: data })
      return
    }
  }, [data, dispatch])

  return (
    <Box>
      <Container>
        <CoursesSearch
          handleSearch={handleSearch}
          setCurrentFilter={setCurrentFilter}
          setFilteredData={setFilteredData}
          allCourses={allCourses}
        />
        <CourseData
          currentFilter={currentFilter}
          isLoading={isLoading}
          filteredData={filteredData}
        />
      </Container>
      <Footer />
    </Box>
  )
}

export default Courses
