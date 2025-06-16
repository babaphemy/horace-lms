"use client"

import {
  coursesByAuthor,
  manageDraft,
  myRegisteredCourses,
} from "@/app/api/rest"
import CourseData from "@/components/courses/CourseData"
import CoursesSearch from "@/components/courses/CoursesSearch"
import Drafts from "@/components/courses/Drafts"
import { COURSES_SET } from "@/context/actions"
import { AppDpx } from "@/context/AppContext"
import { tCourse, tCourseLte } from "@/types/types"
import { notifyInfo } from "@/utils/notification"
import { coursefilter } from "@/utils/util"
import { Box, Container } from "@mui/material"
import Fuse, { FuseResult } from "fuse.js"
import { debounce } from "lodash"
import { useParams } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"

const MyCourses = () => {
  const params = useParams()
  const { userid } = params
  const dispatch = useContext(AppDpx)
  const queryClient = useQueryClient()
  const [filteredData, setFilteredData] = useState<tCourseLte[] | []>([])
  const [currentFilter, setCurrentFilter] = useState(coursefilter[8])
  const [allCourses, setAllCourses] = useState([])
  const { data, isLoading } = useQuery({
    queryKey: ["myCourses", userid],
    queryFn: () => myRegisteredCourses(userid as string),
    enabled: !!userid,
  })
  const { data: drafts, isLoading: draftsLoading } = useQuery({
    queryKey: ["allusercourses", userid],
    queryFn: () => coursesByAuthor(userid as string),
    enabled: !!userid,
  })

  const { mutate } = useMutation({
    mutationFn: manageDraft,
    onSuccess: () => {
      notifyInfo("Published status updated")
      queryClient.invalidateQueries(["allusercourses", userid])
    },
  })
  const handlePublish = (id: string, draft: boolean) => {
    mutate({ id, draft, courseName: "", user: userid as string })
  }

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
        <Drafts
          data={drafts}
          loading={draftsLoading}
          onPublish={handlePublish}
        />
      </Container>
    </Box>
  )
}
export default MyCourses
