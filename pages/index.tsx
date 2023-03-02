import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import styles from '../styles/Home.module.css';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import { useQuery } from 'react-query';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchCourses } from '../api/rest';
import Coursecard from '../components/courses/Coursecard';

const Home: NextPage = () => {
	const { data, isLoading } = useQuery('usersAdddoc', fetchCourses, {
		staleTime: 5000,
		cacheTime: 10,
	});
	return (
		<div className={styles.container}>
			<Head>
				<title>Horace Learning</title>
				<meta
					name="description"
					content="In Horace learning, We are building the best global education network"
				/>
				<link rel="icon" href="/favicon.ico" />
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,400i,700,700i,900,900i|Playfair+Display:400,400i,700,700i,900,900i"
				/>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css?family=Mulish:100,100i,300,300i,400,400i,700,700i,900,900i|Playfair+Display:400,400i,700,700i,900,900i"
				/>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/icon?family=Material+Icons"
				/>
			</Head>

			<Box>
				<Header />
				<Container>
					{isLoading && <CircularProgress />}
					<Typography variant="h1">Horace Learning</Typography>
					{data?.map((course: any, idx: number) => (
						<Coursecard course={course} key={idx + course.id} />
					))}
				</Container>
				<Footer />
			</Box>
		</div>
	);
};

export default Home;
