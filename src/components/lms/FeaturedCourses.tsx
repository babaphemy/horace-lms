"use client"

import { featuredCourses } from "@/app/api/rest"
import PopularCard from "@/components/home/PopularCard"
import { tCourseLte } from "@/types/types"
import { Alert, CircularProgress, Grid, Typography } from "@mui/material"
import { useQuery } from "react-query"

const FeaturedCourses = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["featured-courses"],
    queryFn: featuredCourses,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
  const courses: tCourseLte[] = Array.isArray(data?.content) ? data.content : []

  if (isLoading) return <CircularProgress aria-label="Loading courses" />

  if (isError || data?.error) {
    return (
      <Alert severity="error">
        We couldn&apos;t load featured courses. Please try again shortly.
      </Alert>
    )
  }

  if (courses.length === 0) {
    return (
      <Typography color="text.secondary">
        No featured courses are available yet.
      </Typography>
    )
  }

  return (
    <Grid container spacing={3}>
      {courses.map((course) => (
        <Grid key={course.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <PopularCard data={course} />
        </Grid>
      ))}
    </Grid>
  )
}

export default FeaturedCourses
