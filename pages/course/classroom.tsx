import React from 'react';
import DashboardHoc from '../../components/DashboardHoc';

const classroom = () => {
	return (
		<DashboardHoc isClass={true}>
			<p>
				header: thumbnail, course name, brief, lessons count, reviews, stars,
				call to action (check doorpicker), cost | free | inProgress
			</p>
			<h1>Classroom</h1>
			<p>Progress bar if inProgress</p>
			<p>Course Description</p>
			<p>Course Objectives</p>
			<p>Student reviews</p>
			<p>similar courses</p>
		</DashboardHoc>
	);
};

export default classroom;
