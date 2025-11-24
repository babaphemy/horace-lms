"use client"

import Footer from "@/components/Footer"
import Benefits from "@/components/home/Benefits"
import Hero from "@/components/home/Hero"
import PopularCourses from "@/components/home/PopularCourses"
import { COURSES_SET } from "@/context/actions"
import { AppDpx } from "@/context/AppContext"
import styles from "@/styles/Home.module.css"
import { Box, Container } from "@mui/material"
import type { NextPage } from "next"
import { useContext, useEffect } from "react"
import { useQuery } from "react-query"
import { fetchCourses } from "../../api/rest"
import { useSession } from "next-auth/react"

const Home: NextPage = () => {
  const dispatch = useContext(AppDpx)
  const { data: session } = useSession()

  const { data, isLoading } = useQuery(
    "usersAdddoc",
    () => fetchCourses(session?.user?.id, 0, 10),
    {
      staleTime: 5000,
      cacheTime: 10,
    }
  )

  useEffect(() => {
    if (data) {
      dispatch({ type: COURSES_SET, data })
    }
  }, [data, dispatch])

  return (
    <div className={styles.container}>
      <Box>
        <Container>
          <Hero />
          <Benefits />
          <PopularCourses data={data} isLoading={isLoading} />
        </Container>
        <Footer />
      </Box>
    </div>
  )
}

export default Home
