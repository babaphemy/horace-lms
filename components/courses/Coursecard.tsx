import { Button, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { tCourse } from '../../types/types';
interface Props {
	course: tCourse;
}
const Coursecard: React.FC<Props> = (props: Props): ReactElement => {
	const { course } = props;
	const gotoDetial = (course: tCourse) => {
		// dispatch to store selected
		//router.push(`/course/detail/${course.id}`);
	};
	return (
		<div>
			<Link href={`/course/detail?cid=${course.id}`}>
				<Typography variant="body1">{course.courseName}</Typography>
			</Link>
			<Button>Join</Button>
			<Button>View</Button>
		</div>
	);
};

export default Coursecard;
