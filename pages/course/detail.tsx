import { useRouter } from 'next/router';
import React from 'react';
import CourseObjectives from '../../components/courses/CourseObjectives';
import CourseReview from '../../components/courses/CourseReview';
import DashboardHoc from '../../components/DashboardHoc';
import CourseHeader from '../../components/layout/CourseHeader';

const detail = () => {
	const router = useRouter();
	const cid = router.query.cid as string;
	return (
		<DashboardHoc>
			<CourseHeader id={cid} />
			<CourseObjectives />

			<CourseReview />
			<p>similar courses</p>
		</DashboardHoc>
	);
};

export default detail;
