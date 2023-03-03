import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import Batch from './Batch';
import { useState } from 'react';
import PopularCard from './PopularCard';

const PopularCourses = ({ data, isLoading }: any) => {
  const [active, setActive] = useState('all');

  if (isLoading) return <CircularProgress />;

  return (
    <Box>
      <Box sx={popularStyles.top}>
        <Typography variant="h4">Popular Courses</Typography>
        <Box>
          {filters.map((filter) => (
            <Batch
              label={filter.label}
              onClick={() => {
                setActive(filter.value);
                console.log(filter.value);
              }}
              active={active === filter.value ? true : false}
            />
          ))}
        </Box>
      </Box>
      <Box>
        <Grid container spacing={5}>
          {data?.map((course: any) => {
            return (
              <Grid item xs={12} sm={6} md={4}>
                <PopularCard data={course} />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default PopularCourses;
const popularStyles = {
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    my: '50px',
  },
};

const filters = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Python',
    value: 'python',
  },
  {
    label: 'Javascript',
    value: 'javascript',
  },
  {
    label: 'React',
    value: 'react',
  },
  {
    label: 'Node',
    value: 'node',
  },
];
