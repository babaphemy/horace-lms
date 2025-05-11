"use client"

import { myRegisteredCourses } from "@/app/api/rest"
import CoursesSearch from "@/components/courses/CoursesSearch"
import Header from "@/components/Header"
import { tCourse, tCourseLte } from "@/types/types"
import { Box, Container } from "@mui/material"
import Fuse, { FuseResult } from "fuse.js"
import { debounce } from "lodash"
import { useParams } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { useQuery } from "react-query"
import { coursefilter } from "../page"
import { COURSES_SET } from "@/context/actions"
import { AppDpx } from "@/context/AppContext"
import CourseData from "@/components/courses/CourseData"

const MyCourses = () => {
  const params = useParams()
  const { userid } = params
  const dispatch = useContext(AppDpx)
  const [filteredData, setFilteredData] = useState<tCourseLte[] | []>([])
  const [currentFilter, setCurrentFilter] = useState(coursefilter[0])
  const [allCourses, setAllCourses] = useState([])
  const { data, isLoading } = useQuery({
    queryKey: ["myCourses", userid],
    queryFn: () => myRegisteredCourses(userid as string),
    enabled: !!userid,
  })
  useEffect(() => {
    if (data?.length > 0) {
      setFilteredData(data)
      setAllCourses(data)
      dispatch({ type: COURSES_SET, data })
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])
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
  return (
    <Box>
      <Header />
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
    </Box>
  )
}
export default MyCourses
