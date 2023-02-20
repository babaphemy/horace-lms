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
import man from '../../assets/img/man.png';
import { loginStyles } from '../../styles/loginStyles';

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
									height={'550rem'}
									style={{
										position: 'absolute',
										bottom: 0,
										right: 0,
									}}
								/>
								<Box sx={loginStyles.glass}>
									<Typography variant="h5" sx={loginStyles.note}>
										the best courses you will find here login to get started
									</Typography>
									<Image
										src={man}
										alt="man holding a laptop"
										width={'420rem'}
										height={'400rem'}
									/>
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
