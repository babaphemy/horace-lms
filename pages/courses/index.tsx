import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import React from 'react';
import PopularCard from '../../components/home/PopularCard';
import { useQuery } from 'react-query';
import { fetchCourses } from '../../api/rest';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

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
          {isLoading && <CircularProgress />}
          <Grid container spacing={5}>
            {data?.map((course: any, index: number) => {
              return (
                <Grid item xs={12} sm={6} md={4}>
                  <PopularCard data={course} />
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
