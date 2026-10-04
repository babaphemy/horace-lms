"use client"

import { featuredCourses, fetchCourses } from "@/app/api/rest"
import Footer from "@/components/Footer"
import CourseData from "@/components/courses/CourseData"
import CoursesSearch from "@/components/courses/CoursesSearch"
import { AppDpx } from "@/context/AppContext"
import { COURSES_SET } from "@/context/actions"
import { tCourseLte } from "@/types/types"
import { coursefilter } from "@/utils/util"
import {
  Alert,
  Box,
  Container,
  Pagination,
  Stack,
  Typography,
} from "@mui/material"
import Fuse, { FuseResult } from "fuse.js"
import { debounce } from "lodash"
import { useSession } from "next-auth/react"
import { useContext, useEffect, useMemo, useState } from "react"
import { useQuery } from "react-query"

export type FilterItem = {
  label: string
  value: string
}

const Courses = () => {
  const [allCourses, setAllCourses] = useState<tCourseLte[]>([])
  const [filteredData, setFilteredData] = useState<tCourseLte[]>([])
  const [currentFilter, setCurrentFilter] = useState(coursefilter[0])
  const [currentPage, setCurrentPage] = useState(0)
  const { data: session } = useSession()
  const userId = session?.user?.id
  const dispatch = useContext(AppDpx)

  const { data, isLoading, isError } = useQuery({
    queryKey: ["courses-catalog", userId, currentPage],
    queryFn: userId
      ? () => fetchCourses(userId, currentPage, 10)
      : () => featuredCourses(),
    refetchOnWindowFocus: false,
  })

  const courses: tCourseLte[] = useMemo(
    () => (Array.isArray(data?.content) ? data.content : []),
    [data]
  )

  useEffect(() => {
    setAllCourses(courses)
    setFilteredData(courses)
    if (courses.length > 0) {
      dispatch({ type: COURSES_SET, data: courses })
    }
  }, [courses, dispatch])

  const handleSearch = useMemo(
    () =>
      debounce((query: string) => {
        const filteredCourses =
          currentFilter.value === "all"
            ? allCourses
            : allCourses.filter(
                (course) =>
                  course?.category
                    ?.split(",")
                    .includes(currentFilter.value.toLowerCase()) ||
                  course?.courseName
                    ?.toLowerCase()
                    .includes(currentFilter.value.toLowerCase())
              )
        if (!query.trim()) {
          setFilteredData(filteredCourses)
          return
        }
        const fuse = new Fuse<tCourseLte>(filteredCourses, {
          keys: ["category", "courseName"],
          includeMatches: true,
          minMatchCharLength: 3,
        })
        const results: FuseResult<tCourseLte>[] = fuse.search(query)
        setFilteredData(results.map((item) => item.item))
      }, 700),
    [allCourses, currentFilter]
  )

  useEffect(() => () => handleSearch.cancel(), [handleSearch])

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page - 1)
  }

  return (
    <Box sx={{ bgcolor: "#f6fafb" }}>
      <Box
        component="section"
        sx={{
          bgcolor: "#062d3a",
          color: "white",
          py: { xs: 8, md: 11 },
        }}
      >
        <Container maxWidth="lg">
          <Typography
            component="p"
            sx={{
              color: "#74e4ef",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: 0,
              mb: 2,
            }}
          >
            Course catalog
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 40, md: 64 },
              lineHeight: 1,
              fontWeight: 900,
              maxWidth: 780,
            }}
          >
            Browse practical courses with hands-on labs.
          </Typography>
          <Typography
            sx={{
              mt: 3,
              color: "rgba(255,255,255,0.82)",
              fontSize: { xs: 18, md: 22 },
              maxWidth: 720,
            }}
          >
            See the outcome, labs, prerequisites, and portfolio proof before you
            enroll.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
        <CoursesSearch
          handleSearch={handleSearch}
          setCurrentFilter={setCurrentFilter}
          setFilteredData={setFilteredData}
          allCourses={allCourses}
        />

        {(isError || data?.error) && (
          <Alert severity="error" sx={{ mb: 3 }}>
            We couldn&apos;t load courses right now. Please try again shortly.
          </Alert>
        )}

        <CourseData
          currentFilter={currentFilter}
          isLoading={isLoading}
          filteredData={filteredData}
        />

        {data?.totalPages > 1 && (
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
