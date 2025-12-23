"use client"
import Footer from "@/components/Footer"
import CoursesSearch from "@/components/courses/CoursesSearch"
import { AppDpx } from "@/context/AppContext"
import { COURSES_SET } from "@/context/actions"
import { tCourseLte } from "@/types/types"
import { Box, Container, Pagination, Stack } from "@mui/material"
import Fuse, { FuseResult } from "fuse.js"
import { debounce } from "lodash"
import { useContext, useEffect, useState } from "react"
import { useQuery } from "react-query"
import { featuredCourses, fetchCourses } from "../../api/rest"

import CourseData from "@/components/courses/CourseData"
import { coursefilter } from "@/utils/util"
import { useSession } from "next-auth/react"

export type FilterItem = {
  label: string
  value: string
}
const Courses = () => {
  const [allCourses, setAllCourses] = useState<tCourseLte[]>([])
  const [filteredData, setFilteredData] = useState<tCourseLte[] | []>([])
  const [currentFilter, setCurrentFilter] = useState(coursefilter[0])
  const { data: session } = useSession()
  const userId = session?.user?.id
  const [currentPage, setCurrentPage] = useState(0)

  const dispatch = useContext(AppDpx)
  const { data, isLoading } = useQuery({
    queryKey: [
      "usersRegisteredCourses-featured",
      session?.user?.id,
      currentPage,
    ],
    queryFn: userId
      ? () => fetchCourses(session?.user?.id, currentPage, 10)
      : () => featuredCourses(),
    refetchOnWindowFocus: false,
  })

  const handleSearch = debounce(async (query: string) => {
    if (currentPage !== 0) {
      setCurrentPage(0)
    }
    const fuse = new Fuse<tCourseLte>(data?.content ?? [], {
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
    if (Array.isArray(data?.content) && data?.content?.length > 0) {
      setFilteredData(data?.content)
      setAllCourses(data?.content)
      dispatch({ type: COURSES_SET, data: data?.content })
      return
    }
  }, [data, dispatch])

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page - 1)
  }

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

        {data && data.totalPages > 1 && (
          <Stack spacing={2} alignItems="center" sx={{ mt: 4, mb: 4 }}>
            <Pagination
              count={data.totalPages}
              page={currentPage + 1}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Stack>
        )}
      </Container>
      <Footer />
    </Box>
  )
}

export default Courses
