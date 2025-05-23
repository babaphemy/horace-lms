"use client"
import { Box, Container } from "@mui/material"
import React, { useState, useEffect, useContext } from "react"
import { useQuery } from "react-query"
import { debounce } from "lodash"
import Fuse, { FuseResult } from "fuse.js"
import { fetchCourses } from "../api/rest"
import { AppDpx } from "@/context/AppContext"
import { COURSES_SET } from "@/context/actions"
import Header from "@/components/Header"
import { tCourse, tCourseLte } from "@/types/types"
import Footer from "@/components/Footer"
import CoursesSearch from "@/components/courses/CoursesSearch"

import CourseData from "@/components/courses/CourseData"
import { coursefilter } from "@/utils/util"

export type FilterItem = {
  label: string
  value: string
}

// export const metadata = generateMetadata({
//   title: "Horace Learning Management Solution | Horace Courses",
//   description:
//     "Horace Online Courses. STEM focused online courses for all ages",
// });
const Courses = () => {
  const [allCourses, setAllCourses] = useState([])
  const [filteredData, setFilteredData] = useState<tCourseLte[] | []>([])
  const [currentFilter, setCurrentFilter] = useState(coursefilter[0])

  const dispatch = useContext(AppDpx)

  const { data, isLoading } = useQuery("usersRegisteredCourses", fetchCourses, {
    staleTime: 5000,
    cacheTime: 10,
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
      dispatch({ type: COURSES_SET, data })
      return
    }
  }, [data, dispatch])

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
      <Footer />
    </Box>
  )
}

export default Courses
