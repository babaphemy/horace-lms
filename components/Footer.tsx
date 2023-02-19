import React from 'react';
import {
	Container,
	Box,
	Typography,
	Grid,
	IconButton,
	List,
	ListItem,
	TextField,
	Button,
	Divider,
} from '@mui/material';
import Image from 'next/image';
import logo from '../assets/img/logo.png';

type SocialProps = {
	name: string;
	link: string;
	icon: string | any;
};

const Footer = () => {
	return (
		<Box sx={footerStyles.container}>
			<Container maxWidth="lg">
				<Grid container columnSpacing={2}>
					<Grid item sm={12} md={3}>
						<Image src={logo} alt="logo" width={120} height={50} />
						<Box>
							<Typography variant="body1">
								This is a mobile and web-based application that aims to increase
								kids’ interest
							</Typography>
							<Typography variant="body1">
								in technology and get them to love tech-related courses early in
								life
							</Typography>
						</Box>
						<Box>
							{socials.map((social: SocialProps) => {
								return (
									<IconButton
										key={social.name}
										href={social.link}
										target="_blank"
										rel="noreferer noopener"
									>
										<Image
											src={social.icon}
											alt={social.name}
											width={30}
											height={30}
											style={footerStyles.socialLogo}
										/>
									</IconButton>
								);
							})}
						</Box>
					</Grid>
					<Grid item sm={6} md={3}>
						<Typography variant="h6">Quick Links</Typography>
						<Box>
							<List sx={footerStyles.noLeftPadding}>
								<ListItem>Home</ListItem>
								<ListItem>About</ListItem>
								<ListItem>Courses</ListItem>
								<ListItem>Contact</ListItem>
							</List>
						</Box>
					</Grid>
					<Grid item sm={6} md={3}>
						<Typography variant="h6">Quick Links</Typography>
						<Box>
							<List sx={footerStyles.noLeftPadding}>
								<ListItem>Help Center</ListItem>
								<ListItem>Ask Questions</ListItem>
								<ListItem>Send Feedback</ListItem>
								<ListItem>Terms of Use</ListItem>
								<ListItem>Privacy Policy</ListItem>
							</List>
						</Box>
					</Grid>
					<Grid item sm={12} md={3}>
						<Typography variant="h6">Newsletter</Typography>
						<Box>
							<Typography variant="body1">
								Subscribe for latest updates
							</Typography>
							<TextField
								label="Email"
								variant="outlined"
								fullWidth
								sx={footerStyles.rounded}
							/>
							<Button variant="contained" sx={footerStyles.rounded}>
								Subscribe
							</Button>
						</Box>
					</Grid>
				</Grid>
				<Divider sx={footerStyles.divider} />
				<Typography variant="body1" sx={footerStyles.center}>
					Created By Horace | All Rights Reserved!
				</Typography>
			</Container>
		</Box>
	);
};

export default Footer;

const footerStyles = {
	container: {
		marginTop: 5,
	},
	socialLogo: {
		aspectRatio: 1,
		width: 40,
	},
	rounded: {
		borderRadius: 10,

		'& .MuiOutlinedInput-root': {
			borderRadius: 10,
		},
	},
	noLeftPadding: {
		'& > :not(style)': { paddingLeft: 0 },
	},
	center: { textAlign: 'center', py: 2 },
	divider: {
		background: '#1A055F',
		height: '3px',
		my: 2,
	},
};

// Socials icon and links
const socials = [
	{
		name: 'facebook',
		link: 'https://www.facebook.com/',
		icon: require('../assets/img/facebook.png'),
	},
	{
		name: 'twitter',
		link: 'https://www.twitter.com/',
		icon: require('../assets/img/twitter.png'),
	},
	{
		name: 'instagram',
		link: 'https://www.instagram.com/',
		icon: require('../assets/img/instagram.png'),
	},
	{
		name: 'linkedin',
		link: 'https://www.linkedin.com/',
		icon: require('../assets/img/linkedin.png'),
	},
];
