import {
	Avatar,
	Breadcrumbs,
	Button,
	Container,
	Divider,
	Link,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Paper,
	Rating,
	Typography,
} from '@mui/material';
import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import GrainIcon from '@mui/icons-material/Grain';
import DashboardHeader from '../../components/layout/DashboardHeader';
import CourseHeader from '../../components/layout/CourseHeader';
import CourseObjectives from '../../components/courses/CourseObjectives';
import {
	Code,
	Download,
	NoteAddRounded,
	PlayCircle,
	QuizRounded,
	School,
	ShoppingCart,
} from '@mui/icons-material';
import FooterLte from '../../components/layout/FooterLte';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { fetchCourse } from '../../api/rest';
import { tSection } from '../../types/types';
const Detailb = () => {
	function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
		event.preventDefault();
		console.info('You clicked a breadcrumb.');
	}
	const router = useRouter();
	const cid = router.query.cid as string;
	const { data, isLoading, isError } = useQuery(
		['acourse', cid],
		() => fetchCourse(cid),
		{
			staleTime: 5000,
			cacheTime: 10,
			enabled: !!cid,
		}
	);
	let lessonCount = 0;
	const { course } = data || {};
	const author = `${course?.author?.firstname} ${course?.author?.lastname}`;
	const preview = course?.curriculum?.section[0]?.lecture[0]?.video;
	course?.curriculum.section.forEach((section: tSection) => {
		lessonCount += section.lecture.length;
	});
	const headerProps = {
		id: course?.id,
		name: course?.courseName,
		lessonCount,
		category: course?.category,
		brief: course?.brief || '',
		ratings: course?.ratings,
		reviews: course?.reviews,
		author,
		preview,
		updatedOn: course?.updatedOn,
	};
	const objProps = {
		target: course?.target,
		courseName: course?.courseName,
		curriculum: course?.curriculum,
		category: course?.category,
		modified: course?.updatedOn,
		brief: course?.brief || '',
	};
	return (
		<>
			<DashboardHeader />
			<Container maxWidth="xl" className="px-32">
				<CourseHeader courseProps={headerProps} />
				<div role="presentation" onClick={handleClick} className="my-4">
					<Breadcrumbs aria-label="breadcrumb">
						<Link
							underline="hover"
							sx={{ display: 'flex', alignItems: 'center' }}
							color="inherit"
							href="/"
						>
							<HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
							Home
						</Link>
						<Link
							underline="hover"
							sx={{ display: 'flex', alignItems: 'center' }}
							color="inherit"
							href="/courses"
						>
							<School sx={{ mr: 0.5 }} fontSize="inherit" />
							Courses
						</Link>
						<Typography
							sx={{ display: 'flex', alignItems: 'center' }}
							color="text.primary"
						>
							<GrainIcon sx={{ mr: 0.5 }} fontSize="inherit" />
							Course
						</Typography>
					</Breadcrumbs>
				</div>
				<div className="flex">
					<div className="w-2/3">
						<CourseObjectives {...objProps} />
					</div>
					<div className="w-1/3 ml-6">
						<Paper className="p-8 rounded border-2 border-t-red-500">
							<Typography variant="h6" className="mb-4">
								${(course?.price || 0) - (course?.tax || 0)}
							</Typography>
							<Button variant="outlined" fullWidth endIcon={<ShoppingCart />}>
								Join Class
							</Button>
							<Divider />
							<Typography variant="h6" className="mt-4">
								This course contains
							</Typography>
							<nav>
								<List>
									<ListItem>
										<ListItemIcon>
											<PlayCircle />
										</ListItemIcon>
										<ListItemText primary={`${lessonCount} Lessons`} />
									</ListItem>
									<ListItem>
										<ListItemIcon>
											<QuizRounded />
										</ListItemIcon>
										<ListItemText primary="5 Quizes" />
									</ListItem>
									<ListItem>
										<ListItemIcon>
											<Code />
										</ListItemIcon>
										<ListItemText primary="4 Handson Labs" />
									</ListItem>
									<ListItem>
										<ListItemIcon>
											<Download />
										</ListItemIcon>
										<ListItemText primary="40 Downloads" />
									</ListItem>
									<ListItem>
										<ListItemIcon>
											<NoteAddRounded />
										</ListItemIcon>
										<ListItemText primary="12 Notes" />
									</ListItem>
								</List>
							</nav>
							<Divider />
							<Typography variant="h6" className="mt-4">
								Meet the Instructor
							</Typography>
							<div className="flex mt-4">
								<Avatar
									alt="instructor"
									src="https://material-ui.com/static/images/avatar/1.jpg"
									sx={{ width: 56, height: 56 }}
								/>
								<div className="ml-4">
									<Typography variant="subtitle1">Femi Adigun</Typography>
									<Typography variant="caption">
										Senior Software Engineer
									</Typography>
								</div>
							</div>
							<div className="flex justify-between mt-4">
								<Typography variant="body2">5.0</Typography>
								<Rating name="author-rating" value={5} readOnly />
								<Typography variant="body2">12 Courses</Typography>
								<Typography variant="body2">12 Reviews</Typography>
							</div>
						</Paper>
					</div>
				</div>
			</Container>
			<FooterLte />
		</>
	);
};

export default Detailb;
