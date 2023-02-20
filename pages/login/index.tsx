import React from 'react';
import {
	Box,
	Container,
	Typography,
	Button,
	Divider,
	TextField,
} from '@mui/material';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Image from 'next/image';
import subtract from '../../assets/img/subtract.png';
import fb from '../../assets/img/fbcolor.png';
import google from '../../assets/img/ggcolor.png';
import yeah from '../../assets/img/yeah.png';
import Link from 'next/link';

const Login = () => {
	return (
		<Box>
			<Header />
			<Box sx={loginStyles.body}>
				<Container maxWidth="lg">
					<Box sx={loginStyles.center}>
						<Box sx={loginStyles.box}>
							<Box sx={loginStyles.right}>
								<Typography
									variant="h4"
									sx={[loginStyles.center, loginStyles.title]}
								>
									Login <Image src={yeah} alt="yeah" width={30} height={30} />
								</Typography>
								<Box sx={loginStyles.socials}>
									<Button
										variant="outlined"
										sx={[loginStyles.center, loginStyles.button]}
										fullWidth
									>
										<Image src={google} alt="google" width={20} height={20} />
										Login with Google
									</Button>
									<Button
										variant="outlined"
										sx={[loginStyles.center, loginStyles.button]}
										fullWidth
									>
										<Image src={fb} alt="fb" width={25} height={25} />
										Login with Facebook
									</Button>
								</Box>
								<Box sx={loginStyles.dividerContainer}>
									<Divider sx={loginStyles.divider} />{' '}
									<Typography variant="body1" sx={{ mx: 2 }}>
										{' '}
										or{' '}
									</Typography>
									<Divider sx={loginStyles.divider} />
								</Box>
								<Box component="form" sx={loginStyles.form}>
									<TextField
										sx={loginStyles.input}
										label="Email"
										variant="outlined"
										fullWidth
									/>
									<TextField
										sx={loginStyles.input}
										label="Password"
										variant="outlined"
										fullWidth
									/>
									<Link href="/forgot-password" passHref>
										<Typography variant="body1" sx={{ textAlign: 'right' }}>
											Forgot Password?
										</Typography>
									</Link>

									<Button
										sx={[loginStyles.button, loginStyles.submit]}
										variant="contained"
										fullWidth
									>
										Login
									</Button>
								</Box>
							</Box>
							<Box sx={loginStyles.subtract}>
								<Image
									src={subtract}
									alt="logo"
									width={'450rem'}
									height={'400rem'}
									style={{
										position: 'absolute',
										bottom: 0,
										right: 0,
									}}
								/>
								<Box sx={loginStyles.glass}>
									<Typography variant="h1">Login</Typography>
								</Box>
							</Box>
						</Box>
					</Box>
				</Container>
			</Box>
			<Footer />
		</Box>
	);
};

export default Login;

const loginStyles = {
	title: {
		fontWeight: 700,
		mb: 3,
	},
	body: {
		background:
			'linear-gradient(90deg, rgba(245,155,155,0.04254201680672265) 0%, rgba(245,155,155,0.10136554621848737) 35%, rgba(157,220,235,0.10136554621848737) 100%)',
		width: '100%',
	},
	center: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	box: {
		background: 'white',
		boxShadow: '0px 0px 15px 0px rgba(0,0,0,0.25)',
		borderRadius: 2,
		my: 3,
		display: 'flex',
		justifyContent: 'center',
		minWidth: '80%',
		alignItems: 'center',
	},
	subtract: {
		position: 'relative',
		margin: 0,
		height: '100%',
		background:
			'linear-gradient(197.86deg, #F59B9B 17.24%, #1B9CC3 69.35%, #107797 83.49%)',

		'@media (max-width: 900px)': {
			display: 'none',
		},
	},
	glass: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: '80%',
		background:
			'linear-gradient(0deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), linear-gradient(197.86deg, #F59B9B 17.24%, #2295B8 52.62%, #0F5E76 61.46%)',
		mixBlendMode: 'normal',
		opacity: 0.7,
		backdropFilter: 'blur(2px)',
		borderRadius: '30px',
	},
	button: {
		m: 1,
		marginBottom: 2,
		color: 'black',
		borderColor: '#a1a1a1',
		borderWidth: 2,
		borderRadius: 5,
		fontSize: '16px',
		fontWeight: 400,
		textTransform: 'none',
		display: 'flex',
		justifyContent: 'space-evenly',
		alignItems: 'center',
	},
	socials: {
		minWidth: '70%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
	},
	right: {
		flexGrow: 1,
		p: 3,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	dividerContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		mt: 2,
		mb: 2,
		width: '100%',
	},
	divider: {
		background: '#1A055F',
		height: '1px',
		width: '100px',
	},
	form: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		minWidth: '70%',

		'& .MuiTextField-root': {
			m: 1,
		},
	},
	input: {
		borderRadius: 10,

		'& .MuiOutlinedInput-root': {
			borderRadius: 10,
		},
		'& .MuiOutlinedInput-input': {
			padding: '14px 15px',
			fontSize: '16px',
			fontWeight: 400,
		},
	},
	submit: {
		background: '#1A055F',
		color: 'white',
		'&:hover': {
			background: '#000000',
		},
	},
};
