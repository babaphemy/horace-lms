import React from 'react';
import blue from '../assets/img/blue.png';
import Image from 'next/image';
import { Box } from '@mui/material';

const bgStyles = {
	container: {
		position: 'absolute',
		top: 0,
		right: 0,
		zIndex: -1,
	},
};
const TopBg = () => {
	return (
		<Box sx={bgStyles.container}>
			<Image src={blue} alt="blue" width={1920} height={1080} />
		</Box>
	);
};

export default TopBg;
