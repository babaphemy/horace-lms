import React from 'react';
import { Box, Typography } from '@mui/material';
import { detailStyles } from '../styles/courseStyles';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <Box sx={detailStyles.sidebar}>
      <Box margin={4}>
        <p>Author image</p>
        <p>Author Bio</p>
        <p>Buy or Join class</p>
        <Typography variant="body1">share on social media</Typography>
        <Link href="/course/classroom">Start | Continue | Buy</Link>
      </Box>
    </Box>
  );
};

export default Sidebar;
