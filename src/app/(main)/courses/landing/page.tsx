"use client"

import { Box, Container } from "@mui/material"
import type { NextPage } from "next"
import { useQuery } from "react-query"
import styles from "@/styles/Home.module.css"
import { useContext, useEffect } from "react"
import { AppDpx } from "@/context/AppContext"
import { featuredCourses, fetchCourses } from "@/app/api/rest"
import { COURSES_SET } from "@/context/actions"
import Header from "@/components/Header"
import Hero from "@/components/home/Hero"
import Benefits from "@/components/home/Benefits"
import PopularCourses from "@/components/home/PopularCourses"
import Footer from "@/components/Footer"
import { useSession } from "next-auth/react"
import { tCourseLte } from "@/types/types"

const Home: NextPage = () => {
  const dispatch = useContext(AppDpx)
  const { data: session } = useSession()
  const userID = session?.user?.id

  const { data, isLoading } = useQuery(
    "usersAdddoc",
    userID ? () => fetchCourses(userID, 0, 10) : () => featuredCourses(),
    {
      staleTime: 5000,
      cacheTime: 10,
    }
  )
  useEffect(() => {
    if (data) {
      dispatch({ type: COURSES_SET, data: data?.content })
    }
  }, [data, dispatch])

  return (
    <div className={styles.container}>
      <Box>
        <Header />
        <Container>
          <Hero />
          <Benefits />
          <PopularCourses
            data={data?.content as tCourseLte[]}
            isLoading={isLoading}
          />
        </Container>
        <Footer />
      </Box>
    </div>
  )
}

export default Home
