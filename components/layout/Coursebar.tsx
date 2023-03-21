import React from 'react';
import { Box, Toolbar, Typography } from '@mui/material';

const Coursebar = () => {
  return (
    <Box className="flex flex-auto w-full text-center rounded-2xl overflow-hidden">
      <Toolbar className="w-full mb-1">
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Build Native Android & iOS App Using EXPO
        </Typography>
      </Toolbar>
    </Box>
  );
};

export default Coursebar;
