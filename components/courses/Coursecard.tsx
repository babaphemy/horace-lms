import { Button, Typography } from '@mui/material';
import Link from 'next/link';
import React, { ReactElement } from 'react';
import { tCourse } from '../../types/types';
interface Props {
	course: tCourse;
}
const Coursecard: React.FC<Props> = (props: Props): ReactElement => {
	const { course } = props;
	return (
		<div>
			<Link href={`/course/detailb?cid=${course.id}`}>
				<Typography variant="body1">{course.courseName}</Typography>
			</Link>
			<Button>Join</Button>
			<Button>View</Button>
		</div>
	);
};

export default Coursecard;
