import { Box, LinearProgress, Typography } from '@mui/material';
import React from 'react';
interface Props {
  value: number;
}
const ProgressWithLabel = (props: Props) => {
  return (
    <Box display="flex" alignItems="center" py={3}>
      <Box width="100%" mr={3}>
        <LinearProgress
          variant="determinate"
          {...props}
          color="secondary"
          className="h-2 rounded-2xl"
        />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
};
export default ProgressWithLabel;
