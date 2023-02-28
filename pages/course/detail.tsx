import { Alert, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { useQuery } from 'react-query';
import { fetchCourse } from '../../api/rest';
import CourseObjectives from '../../components/courses/CourseObjectives';
import DashboardHoc from '../../components/DashboardHoc';
import CourseHeader from '../../components/layout/CourseHeader';
import { tSection } from '../../types/types';

const detail = () => {
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
	course?.curriculum.section.forEach((section: tSection) => {
		lessonCount += section.lecture.length;
	});
	return (
		<DashboardHoc
			curriculum={course?.curriculum}
			courseName={course?.courseName}
		>
			<CourseHeader
				id={cid}
				name={course?.courseName}
				lessonCount={lessonCount}
				category={course?.category}
				brief={course?.brief || ''}
				ratings={course?.ratings}
				reviews={course?.reviews}
				author={author}
			/>
			{isLoading && <CircularProgress />}
			{isError && (
				<Alert severity="error">
					Something went wrong {JSON.stringify(isError)}
				</Alert>
			)}
			<CourseObjectives />

			<p>similar courses</p>
		</DashboardHoc>
	);
};

export default detail;
