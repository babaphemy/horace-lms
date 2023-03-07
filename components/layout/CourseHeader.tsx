import React from 'react';
import { Badge, Box, Chip, Rating, Stack, Typography } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ReviewsIcon from '@mui/icons-material/Reviews';

import ProgressWithLabel from '../common/ProgressWithLabel';
interface Props {
  courseProps: {
    id: string;
    name: string;
    author: string;
    lessonCount: number;
    category: string;
    brief: string;
    ratings?: number | null;
    reviews?: number | null;
    preview?: string;
    posts?: any[];
  };
}
const CourseHeader = (props: Props) => {
  const {
    name,
    brief,
    category,
    lessonCount,
    ratings,
    author,
    preview,
    posts,
  } = props?.courseProps || {};
  const isRegd = false;
  return (
    <div className="flex flex-col w-full *px-24 *sm:px-20">
      <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 my-32 sm:my-2">
        <div className="flex flex-auto items-center min-w-0">
          <div className="box-border h-40 w-42 border-2 rounded-lg">
            <video
              controls
              className="h-full w-full"
              src={`https://essl.b-cdn.net/${preview}`}
            />
          </div>

          <div className="flex flex-col min-w-0 mx-16">
            <Stack direction={'row'} spacing={1}>
              {category?.split(',').map((x) => (
                <Chip key={x} label={x} variant="outlined" color="primary" />
              ))}
            </Stack>
            <Typography className="text-2xl md:text-5xl font-semibold tracking-tight leading-7 md:leading-snug truncate">
              {name}
            </Typography>
            <Typography variant="caption" color="graytext">
              by {author}. | {lessonCount} Lessons
            </Typography>
            <div className="flex items-center mt-4">
              <NotificationsActiveIcon />

              <Typography className="mx-6 leading-6 truncate" color="graytext">
                {brief}
              </Typography>
            </div>
          </div>
        </div>
        <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
          <Box width={'100%'} display="flex">
            <Rating
              name="read-only"
              value={ratings || 5}
              readOnly
              color="primary"
            />
          </Box>

          <Badge badgeContent={posts?.length || 4} color="secondary">
            <ReviewsIcon color="action" />
          </Badge>
        </div>
      </div>
      {isRegd && <ProgressWithLabel value={30} />}
    </div>
  );
};

export default CourseHeader;
