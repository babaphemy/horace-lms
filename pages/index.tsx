import { Box, Container } from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useQuery } from 'react-query';
import { fetchCourses } from '../api/rest';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Benefits from '../components/home/Benefits';
import Hero from '../components/home/Hero';
import PopularCourses from '../components/home/PopularCourses';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const { data, isLoading } = useQuery('usersAdddoc', fetchCourses, {
    staleTime: 5000,
    cacheTime: 10,
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Horace Learning</title>
        <meta
          name="description"
          content="In Horace learning, We are building the best global education network"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
