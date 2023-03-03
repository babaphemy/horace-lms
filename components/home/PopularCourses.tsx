import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import Batch from './Batch';
import { useState, useEffect } from 'react';
import PopularCard from './PopularCard';

const PopularCourses = ({ data, isLoading }: any) => {
  const [active, setActive] = useState('all');
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    if (active === 'all') {
      setFilteredData(data);
    } else {
      const filtered = data?.filter((course: any) => {
        if (course.category === active) {
          return course;
        } else {
          return course.courseName.toLowerCase().includes(active.toLowerCase());
        }
      });
      setFilteredData(filtered);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

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
          {filteredData?.map((course: any) => {
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
    flexWrap: 'wrap',

    '@media (max-width: 600px)': {
      '& > *': {
        width: '100%',
        my: '5px',
      },
    },
  },
};

const filters = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Kotlin',
    value: 'kotlin',
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
    label: 'Civic',
    value: 'civic',
  },
];
