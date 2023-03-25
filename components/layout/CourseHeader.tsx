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
      <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 my-3">
        <div className="flex flex-col-reverse sm:flex-row flex-auto items-center min-w-0  ">
          <div className="box-border h-48 border-2 rounded-lg">
            <video
              controls
              className="h-full w-full"
              src={`https://essl.b-cdn.net/${preview}`}
            />
          </div>

          <div className="flex flex-col self-start my-3 sm:my-0 min-w-0 mx-4 lg:mx-12">
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

              <Typography
                className="mx-2 sm:mx-6 tracking-tight leading-6 sm:truncate"
                color="graytext"
              >
                {brief}
              </Typography>
            </div>
          </div>
        </div>
        <div className="flex items-center mt-4 sm:mt-0 mx-4 space-x-12">
          <Box width={'100%'} display="flex">
            <Rating
              name="read-only"
              value={Number(ratings?.toFixed(1)) || 5}
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
