import React from 'react';
import { Box, Typography } from '@mui/material';
import { detailStyles } from '../styles/courseStyles';

const ClassroomSidebar = () => {
	return (
		<Box sx={detailStyles.sidebar}>
			<Box margin={4}>
				<Typography>Curriculum</Typography>
			</Box>
		</Box>
	);
};

export default ClassroomSidebar;
