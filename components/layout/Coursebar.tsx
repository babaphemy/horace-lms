import React from 'react';
import { Paper, Toolbar, Typography } from '@mui/material';

const Coursebar = () => {
  return (
    <Paper className="flex flex-auto w-full shadow rounded-2xl overflow-hidden">
      <Toolbar className="w-full">
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Build Native Android & iOS App Using EXPO
        </Typography>
      </Toolbar>
    </Paper>
  );
};

export default Coursebar;
