"use client";

import { Box, Container } from "@mui/material";
import type { NextPage } from "next";
import { useQuery } from "react-query";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Benefits from "../components/home/Benefits";
import Hero from "../components/home/Hero";
import PopularCourses from "../components/home/PopularCourses";
import styles from "../styles/Home.module.css";
import { useContext } from "react";
import { AppDpx } from "../context/AppContext";
import { COURSES_SET } from "../context/actions";
import { fetchCourses } from "./api/rest";

const Home: NextPage = () => {
  const dispatch = useContext(AppDpx);

  const { data, isLoading } = useQuery("usersAdddoc", fetchCourses, {
    staleTime: 5000,
    cacheTime: 10,
  });

  if (data) {
    dispatch({ type: COURSES_SET, data });
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
  );
};

export default Home;
