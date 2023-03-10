import { Box, Container, Grid, Typography } from '@mui/material';
import React from 'react';
import PopularCard from '../../components/home/PopularCard';
import { useQuery } from 'react-query';
import { fetchCourses } from '../../api/rest';

import img1 from '../../assets/img/1.jpg';
import img2 from '../../assets/img/2.png';
import img3 from '../../assets/img/3.jpg';
import img4 from '../../assets/img/4.jpg';
import img5 from '../../assets/img/5.jpg';
import img6 from '../../assets/img/6.png';
import { tCourse } from '../../types/types';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const cardImage = [img1, img2, img3, img4, img5, img6];

const Courses = () => {
  const { data, isLoading } = useQuery('usersAdddoc', fetchCourses, {
    staleTime: 5000,
    cacheTime: 10,
  });
  return (
    <Box>
      <Header />
      <Container>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 'bold', my: 4 }}>
            All Courses
          </Typography>
          <Grid container spacing={5}>
            {data?.map((course: any, index: number) => {
              return (
                <Grid item xs={12} sm={6} md={4}>
                  <PopularCard data={course} img={cardImage[index]} />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default Courses;
