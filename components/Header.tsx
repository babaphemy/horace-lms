import React from 'react';
import { Box, Container } from '@mui/material';

const Header = () => {
	return (
		<Box sx={headerStyles.container}>
			<Container maxWidth="lg">
				<h1>Header</h1>
			</Container>
		</Box>
	);
};

export default Header;
const headerStyles = {
	container: {
		marginTop: 5,
	},
};
