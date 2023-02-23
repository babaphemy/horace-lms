import React from 'react';
import DashboardHoc from '../../components/DashboardHoc';
const videoLink = `https://essl.b-cdn.net/budgeting.mp4`;
const detail = () => {
	// get selected course and put in context
	return (
		<DashboardHoc>
			<p>
				header: thumbnail, course name, brief, lessons count, reviews, stars,
				call to action (check doorpicker), cost | free | inProgress
			</p>
			<h1>Detail</h1>
			<p>Progress bar if inProgress</p>
			<p>Course Description</p>
			<p>Course Objectives</p>
			<p>Student reviews</p>
			<p>similar courses</p>

			{/* <video width="750" height="500" controls>
					<source src={`${videoLink}`} type="video/mp4" />
				</video> */}
		</DashboardHoc>
	);
};

export default detail;
