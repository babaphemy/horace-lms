import React from 'react';
import { Box, Container, Typography, Button, TextField } from '@mui/material';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Image from 'next/image';
import subtract from '../../assets/img/subtract.png';
import thumb from '../../assets/img/thumb.png';
import woman from '../../assets/img/woman.png';
import Link from 'next/link';
import { loginStyles } from '../../styles/loginStyles';

const SignUp = () => {
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
									Sign Up{' '}
									<Image src={thumb} alt="thumb" width={30} height={30} />
								</Typography>

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

									<Button
										sx={[loginStyles.button, loginStyles.submit]}
										variant="contained"
										fullWidth
									>
										Sign Up
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
										the best courses you will find here sign up now
									</Typography>
									<Image
										src={woman}
										alt="woman standing"
										width={'300rem'}
										height={'300rem'}
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

export default SignUp;
