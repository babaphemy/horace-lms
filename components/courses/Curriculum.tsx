import React, { useState } from 'react';
import {
	Collapse,
	Divider,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Theme,
	Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { tCourse, tLecture } from '../../types/types';
import { ExpandLess, ExpandMore, StarBorder } from '@mui/icons-material';
import { sample } from '../../api/data';

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		width: '100%',
		maxWidth: 360,
		backgroundColor: theme.palette.background.paper,
	},
	nested: {
		paddingLeft: theme.spacing(4),
	},
	navBox: {
		'& > *': {
			padding: '0.8 0.5',
			height: '100%',
			cursor: 'pointer',
			backgroundColor: 'darkblue',
			'&:hover': {
				backgroundColor: '#f5f5f5',
				color: 'darkblue',
				transform: 'translateX(2px)',
			},
			'&__navItem': {
				display: 'flex',
				alignItems: 'center',
				alignSelf: 'stretch',
				'&__navText': {
					marginLeft: '0.5rem',
				},
				'&__icon': {
					fontsize: '1.5rem',
				},
			},
		},
	},
}));
const Curriculum = () => {
	const classes = useStyles();
	const sidebar = true;
	const [open, setOpen] = useState(true);
	const [selected, setSel] = useState({
		courseName: 'Course 1',
	});
	const handleClick = (sl: tCourse) => {
		setSel(sl);
		setOpen(!open);
	};
	return (
		<>
			<List
				component="nav"
				aria-labelledby="nested-list-subheader"
				// className={classes.root}
				className={classes.navBox}
			>
				{sample.map((course: any, index: number) => (
					<div key={index + course.courseName}>
						<ListItem
							button
							onClick={() => handleClick(course)}
							className={classes.navBox__navItem}
						>
							<ListItemIcon>
								{course.courseName === selected?.courseName ? (
									<ExpandLess />
								) : (
									<ExpandMore />
								)}
							</ListItemIcon>

							<ListItemText
								disableTypography
								primary={
									<Typography
										className={
											sidebar
												? 'font-normal text-sm'
												: 'font-semibold text-md md:font-bold md:text-lg'
										}
										variant="h6"
									>
										{course.courseName}
									</Typography>
								}
							/>

							{!sidebar && (
								<Typography
									className="text-grey-700"
									variant="body2"
									component="p"
								>
									{course.lecture.length}{' '}
									{course.lecture.length === 1 ? 'lecture' : 'lectures'}
								</Typography>
							)}
						</ListItem>
						<Divider />
						<Collapse
							in={course.courseName === selected?.courseName}
							timeout="auto"
							unmountOnExit
						>
							<List component="div" disablePadding>
								{course?.curriculum?.section?.map(
									(lec: tLecture, idx: number) => (
										<ListItem
											key={lec.title + idx}
											button
											className={classes.nested}
										>
											<ListItemIcon>
												<StarBorder />
											</ListItemIcon>
											<ListItemText
												primary={
													<Typography className="text-grey-700">
														{lec.title}
													</Typography>
												}
											/>
											{!sidebar && (
												<ListItemIcon>
													{lec.open ? <VisibilityIcon /> : <LockIcon />}
												</ListItemIcon>
											)}
										</ListItem>
									)
								)}
							</List>
						</Collapse>
					</div>
				))}
			</List>
		</>
	);
};

export default Curriculum;
