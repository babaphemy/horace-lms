import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const Login = () => {
	return (
		<Box>
			<Header />
			<Container maxWidth="lg">
				<Typography variant="h1">Login</Typography>
			</Container>
			<Footer />
		</Box>
	);
};

export default Login;
