import React from 'react';
import ClassLayout from '../components/layout/ClassLayout';
import { Paper, Typography } from '@mui/material';

const Random = () => {
  return (
    <ClassLayout>
      <Paper
        sx={{
          width: '100%',
          height: '100vh',
          borderRadius: 20,
        }}
      >
        <h1>Random</h1>
        <Typography variant="body2" mb={'20px'}>
          Transform Your Career with Horace: Gain Job-Ready Skills through Our
          Immersive Courses and Hands-On Labs.
        </Typography>
      </Paper>
    </ClassLayout>
  );
};

export default Random;
