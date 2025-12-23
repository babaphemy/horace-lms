"use client"
import Footer from "@/components/Footer"
import CoursesSearch from "@/components/courses/CoursesSearch"
import { AppDpx } from "@/context/AppContext"
import { COURSES_SET } from "@/context/actions"
import { tCourseLte } from "@/types/types"
import {
  Box,
  Container,
  Pagination,
  Stack,
  Typography,
  Divider,
  Grid,
  CircularProgress,
} from "@mui/material"
import { Star } from "@mui/icons-material"
import Fuse, { FuseResult } from "fuse.js"
import { debounce } from "lodash"
import { useContext, useEffect, useState } from "react"
import { useQuery } from "react-query"
import { fetchCourses, fetchFeaturedCourses } from "../../api/rest"

import CourseData from "@/components/courses/CourseData"
import { coursefilter } from "@/utils/util"
import { useSession } from "next-auth/react"
import PopularCard from "@/components/home/PopularCard"

export type FilterItem = {
  label: string
  value: string
}
const Courses = () => {
  const [allCourses, setAllCourses] = useState<tCourseLte[]>([])
  const [filteredData, setFilteredData] = useState<tCourseLte[] | []>([])
  const [featuredCourses, setFeaturedCourses] = useState<tCourseLte[]>([])
  const [currentFilter, setCurrentFilter] = useState(coursefilter[0])
  const { data: session } = useSession()
  const [currentPage, setCurrentPage] = useState(0)

  const dispatch = useContext(AppDpx)
  const { data, isLoading } = useQuery({
    queryKey: ["usersRegisteredCourses", session?.user?.id, currentPage],
    queryFn: () => fetchCourses(undefined, currentPage, 10),
    refetchOnWindowFocus: false,
    enabled: !!session?.user?.id,
  })

  const { data: featuredData, isLoading: isLoadingFeatured } = useQuery({
    queryKey: ["featuredCourses", session?.user?.id],
    queryFn: () => fetchFeaturedCourses(session?.user?.id, 0, 10),
    refetchOnWindowFocus: false,
    enabled: !!session?.user?.id,
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

  useEffect(() => {
    if (
      Array.isArray(featuredData?.content) &&
      featuredData?.content?.length > 0
    ) {
      setFeaturedCourses(featuredData.content)
    }
  }, [featuredData])

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page - 1)
  }

  return (
    <Box>
      <Container>
        {/* Featured Courses Section */}
        {(featuredCourses.length > 0 || isLoadingFeatured) && (
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 3,
              }}
            >
              <Star sx={{ color: "warning.main", fontSize: 28 }} />
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                Featured Courses
              </Typography>
            </Box>
            {isLoadingFeatured ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  py: 4,
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Grid container spacing={5}>
                  {featuredCourses.map((course: tCourseLte, index: number) => {
                    return (
                      <Grid
                        key={`featured-${index}`}
                        size={{ xs: 12, sm: 6, md: 4 }}
                      >
                        <PopularCard data={course} />
                      </Grid>
                    )
                  })}
                </Grid>
                {featuredCourses.length > 0 && (
                  <Divider sx={{ mt: 4, mb: 4 }} />
                )}
              </>
            )}
          </Box>
        )}

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
