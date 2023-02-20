import React from 'react';
import {
	Box,
	Container,
	List,
	Link as MuiLink,
	Typography,
	Button,
} from '@mui/material';
import Image from 'next/image';
import NextLink from 'next/link';
import logo from '../assets/img/logo.png';
import LanguageIcon from '@mui/icons-material/Language';
import TopBg from './TopBg';

const Header = () => {
	return (
		<>
			<TopBg />
			<Box sx={headerStyles.container}>
				<Container maxWidth="lg">
					<Box sx={headerStyles.flexHeader}>
						<Box sx={headerStyles.flexHeader}>
							<Image
								src={logo}
								alt="logo"
								width={150}
								height={50}
								style={headerStyles.logo}
							/>
							<List sx={headerStyles.flexList}>
								<NextLink href="/" passHref>
									<MuiLink>Home</MuiLink>
								</NextLink>
								<NextLink href="/" passHref>
									<MuiLink>About</MuiLink>
								</NextLink>
								<NextLink href="/" passHref>
									<MuiLink>Courses</MuiLink>
								</NextLink>
								<NextLink href="/" passHref>
									<MuiLink>Contact</MuiLink>
								</NextLink>
							</List>
						</Box>
						<Box sx={headerStyles.auth}>
							<Typography variant="body1" sx={headerStyles.language}>
								<LanguageIcon />
								English
							</Typography>
							<NextLink href="/login" passHref>
								<MuiLink>Login</MuiLink>
							</NextLink>
							<NextLink href="/sign-up" passHref>
								<MuiLink>
									<Button variant="contained" sx={headerStyles.authButton}>
										Sign Up
									</Button>
								</MuiLink>
							</NextLink>
						</Box>
					</Box>
				</Container>
			</Box>
		</>
	);
};

export default Header;
const headerStyles = {
	container: {
		marginTop: 5,
		position: 'relative',
	},
	flexHeader: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		px: 0,
	},
	flexList: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		px: 0,

		'& > :not(style)': {
			listStyle: 'none',
			marginRight: 2,
			textDecoration: 'none',
			color: 'black',

			'&:hover': {
				fontWeight: 'bolder',
			},
		},
	},
	logo: {
		marginRight: 5,
		marginTop: '-3px',
		marginLeft: '-10px',
	},
	language: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		'& > :not(style)': {
			marginRight: 1,
		},
	},
	auth: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		fontWeight: 'bold',

		'& > :not(style)': {
			marginRight: 2,
			listStyle: 'none',
			textDecoration: 'none',
			color: 'black',
		},
	},
	authButton: {
		background: '#00A9C1',
		color: '#fff',
		px: 3,
		borderRadius: 10,
		textTransform: 'capitalize',

		'&:hover': {
			background: '#000',
		},
	},
};
