import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const SignUp = () => {
	return (
		<Box>
			<Header />
			<Container maxWidth="lg">
				<Typography variant="h1" height={'50vh'}>
					Sign Up
				</Typography>
			</Container>
			<Footer />
		</Box>
	);
};

export default SignUp;
