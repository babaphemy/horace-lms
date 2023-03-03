import { Box, Typography } from '@mui/material';
import Batch from './Batch';
import { useState } from 'react';

const PopularCourses = () => {
  const [active, setActive] = useState('all');
  return (
    <Box sx={popularStyles.container}>
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
  );
};

export default PopularCourses;
const popularStyles = {
  container: {
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
