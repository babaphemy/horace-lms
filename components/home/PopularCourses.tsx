import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import Batch from './Batch';
import { useState, useEffect } from 'react';
import PopularCard from './PopularCard';
import img1 from '../../assets/img/1.png';
import img2 from '../../assets/img/2.png';
import img3 from '../../assets/img/3.png';
import img4 from '../../assets/img/4.png';
import img5 from '../../assets/img/5.png';
import img6 from '../../assets/img/6.png';
import { tCourse } from '../../types/types';

const cardImage = [img1, img2, img3, img4, img5, img6];

const PopularCourses = ({ data, isLoading }: any) => {
  const [active, setActive] = useState('all');
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    if (active === 'all') {
      setFilteredData(data);
    } else {
      const filtered = data?.filter((course: tCourse) =>
        course?.category?.split(',').includes(active.toLowerCase())
      );
      // const filtered = data?.filter((course: tCourse) => {
      //   if (course.category === active) {
      //     return course;
      //   } else {
      //     return course.category?.split(',').includes(active.toLowerCase());
      //   }
      // });
      setFilteredData(filtered);
    }
  }, [active]);

  if (isLoading) return <CircularProgress />;

  return (
    <Box>
      <Box sx={popularStyles.top}>
        <Typography variant="h4">Popular Courses</Typography>
        <Box>
          {filters.map((filter, i) => (
            <Batch
              key={i}
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
          {filteredData?.map((course: any, index: number) => {
            return (
              <Grid item xs={12} sm={6} md={4}>
                <PopularCard data={course} img={cardImage[index]} />
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
    label: 'Programming',
    value: 'programming',
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
  {
    label: 'Mobile',
    value: 'mobile',
  },
  {
    label: 'Devops',
    value: 'devops',
  },
  {
    label: 'web',
    value: 'web',
  },
];
