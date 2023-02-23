import React from 'react';
import { Box, Typography } from '@mui/material';
import { detailStyles } from '../styles/courseStyles';

const Sidebar = () => {
	return (
		<Box sx={detailStyles.sidebar}>
			<Box margin={4}>
				<p>Author image</p>
				<p>Author Bio</p>
				<Typography>Curriculum</Typography>
			</Box>
		</Box>
	);
};

export default Sidebar;
