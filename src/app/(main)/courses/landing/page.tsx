"use client"

import { Box, Container } from "@mui/material"
import type { NextPage } from "next"
import { useQuery } from "react-query"
import styles from "@/styles/Home.module.css"
import { useContext } from "react"
import { AppDpx } from "@/context/AppContext"
import { fetchCourses } from "@/app/api/rest"
import { COURSES_SET } from "@/context/actions"
import Header from "@/components/Header"
import Hero from "@/components/home/Hero"
import Benefits from "@/components/home/Benefits"
import PopularCourses from "@/components/home/PopularCourses"
import Footer from "@/components/Footer"
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

  if (data) {
    dispatch({ type: COURSES_SET, data })
  }

  return (
    <div className={styles.container}>
      <Box>
        <Header />
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
