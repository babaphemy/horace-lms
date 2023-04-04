import { Check, TextSnippet } from '@mui/icons-material';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { ReactElement, useState } from 'react';
import { tCurriculum } from '../../types/types';
import CourseReview from './CourseReview';
import Curriculumb from './Curriculumb';

const styles = {
  button: {
    border: '1px solid',
    borderColor: 'primary',
    px: 4,
    my: 2,
  },
};

const ranges = {
  content: 'Content',
  reviews: 'Reviews',
};
interface Props {
  category?: string;
  target?: string;
  modified?: string;
  courseName?: string;
  curriculum?: tCurriculum;
  brief: string;
  posts?: any[];
  ratings?: number | null;
  handleJoinClass: () => void;
  regCourse?: boolean;
}
const CourseObjectives: React.FC<Props> = (props: Props): ReactElement => {
  const {
    target,
    category,
    modified,
    courseName,
    curriculum,
    brief,
    posts,
    ratings,
    handleJoinClass,
    regCourse,
  } = props;
  const [tabValue, setTabValue] = useState(0);

  return (
    <>
      <Box className="flex space-x-6 items-center my-5 mx-5">
        <Typography variant="subtitle1" className="text-gray-500 font-semibold">
          {regCourse ? 'Enrolled' : 'Not Enrolled'}
        </Typography>
        {!regCourse && (
          <Button
            variant="contained"
            className="bg-[#00A9C1] text-white rounded-full px-5 py-2 hover:bg-[#00A9C1] capitalize"
            onClick={handleJoinClass}
          >
            Enroll For Course
          </Button>
        )}
      </Box>
      <Paper className="flex flex-col py-10 px-4 md:p-10 w-full shadow rounded-2xl overflow-hidden border-2 border-[#F9AD56]">
        <div className="flex sm:flex-row items-start justify-between">
          <Tabs
            value={tabValue}
            onChange={(ev, value) => setTabValue(value)}
            indicatorColor="secondary"
            textColor="inherit"
            variant="scrollable"
            scrollButtons={false}
            className="-mx-4 min-h-40 "
            classes={{
              indicator: 'flex justify-center bg-transparent w-full h-full',
            }}
            TabIndicatorProps={{
              children: (
                <Box
                  sx={{ bgcolor: 'text.disabled', color: 'white' }}
                  className="w-full h-full rounded-full bg-[#F9AD56] opacity-50"
                />
              ),
            }}
          >
            {Object.entries(ranges).map(([key, label]) => (
              <Tab
                className="font-semibold px-6 mx-4  md:px-12"
                disableRipple
                key={key}
                label={label}
              />
            ))}
          </Tabs>
        </div>
        <div className="w-full mt-5">
          {tabValue === 0 && (
            <div>
              <Typography variant="h6" className="mb-4">
                Overview
              </Typography>
              <Typography gutterBottom>{brief}</Typography>
              <Typography variant="subtitle1" gutterBottom>
                Target Audience: {target || 'Beginner'}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Category: {category?.toString() || 'web'}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Last Updated: {modified || 'N/A'}
              </Typography>
              <Button
                onClick={handleJoinClass}
                variant="contained"
                className="bg-[#00A9C1] text-white rounded-full px-10 py-2 my-5 hover:bg-[#00A9C1]"
              >
                Join Class
              </Button>
            </div>
          )}
          {tabValue === 1 && (
            <div className="flex flex-col">
              <CourseReview posts={posts} ratings={ratings} />
            </div>
          )}
        </div>
      </Paper>
      {curriculum?.objective && (
        <Paper className="p-10 mt-8 rounded-2xl border-2 border-[#16C79A]">
          <Typography
            variant="h6"
            className="mb-4 text-[#16C79A] font-semibold"
          >
            What you will learn
          </Typography>
          <Typography variant="subtitle1" className="mb-4">
            AT the end of this course, you will:
          </Typography>
          <List>
            {curriculum?.objective?.map((obj, index) => (
              <ListItem key={index + obj}>
                <ListItemIcon>
                  <TextSnippet />
                </ListItemIcon>
                <ListItemText primary={obj} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
      {curriculum?.requirement && (
        <Paper className="p-10 mt-8 rounded-2xl border-2 border-[#FF5E78]">
          <Typography
            variant="h6"
            className="mb-4 text-[#FF5E78] font-semibold"
          >
            Requirements
          </Typography>
          <Typography variant="subtitle1" className="mb-4">
            Good to have the following skills before taking this course:
          </Typography>
          <List>
            {curriculum?.requirement?.map((req, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <Check />
                </ListItemIcon>
                <ListItemText primary={req} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      <Paper className="py-10 px-4 md:p-10 mt-8 rounded-2xl border-2 border-t-red-500">
        <Typography variant="h6" className="mb-4">
          Syllabus
        </Typography>
        <Curriculumb courseName={courseName} curriculum={curriculum} />
      </Paper>
    </>
  );
};

export default CourseObjectives;
