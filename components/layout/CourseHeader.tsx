import React from 'react';
import {
  Badge,
  Box,
  Chip,
  Container,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ReviewsIcon from '@mui/icons-material/Reviews';

import ProgressWithLabel from '../common/ProgressWithLabel';
import { tPost } from '../../types/types';
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
    students?: number;
    totalSteps?: number;
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
    <Box
      sx={{
        background:
          'linear-gradient(197.86deg, #F59B9B 17.24%, #1B9CC3 69.35%, #107797 83.49%)',
        minHeight: '300px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        p: 5,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          px: { xs: 0, sm: 2, md: 4 },
        }}
      >
        <Box>
          <Stack
            spacing={2}
            sx={{
              maxWidth: '40rem',
            }}
          >
            <Stack direction={'row'} spacing={1}>
              {category?.split(',').map((x) => (
                <Chip
                  key={x}
                  label={x}
                  variant="outlined"
                  className="text-white border-white"
                />
              ))}
            </Stack>
            <Typography variant="h3" className="text-white">
              {name}
            </Typography>
            <Typography variant="subtitle1" className="text-white">
              {brief}
            </Typography>
            <Stack direction={'row'} spacing={1}>
              {ratings && (
                <Typography variant="caption" className="text-white">
                  {Number(ratings?.toFixed(1) || 5)}
                </Typography>
              )}
              <Rating
                size="small"
                className="text-white "
                name="read-only"
                value={Number(ratings?.toFixed(1) || 5)}
                readOnly
              />
              <Typography variant="caption" className="text-white">
                How Students Rate This Course
              </Typography>
            </Stack>

            <Typography variant="caption" className="text-white text-[14px]">
              Taught by: {author}, Instructor | {lessonCount} Lesson(s)
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );

  // return (
  //   <div className="flex flex-col w-full *px-24 *sm:px-20">
  //     <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 my-3">
  //       <div className="flex flex-col-reverse sm:flex-row flex-auto items-center min-w-0  ">
  //         <div className="box-border h-48 border-2 rounded-lg">
  //           <video
  //             controls
  //             className="h-full w-full"
  //             src={`https://essl.b-cdn.net/${preview}`}
  //           />
  //         </div>

  //         <div className="flex flex-col self-start my-3 sm:my-0 min-w-0 mx-4 lg:mx-12">
  //           <Stack direction={'row'} spacing={1}>
  //             {category?.split(',').map((x) => (
  //               <Chip key={x} label={x} variant="outlined" color="primary" />
  //             ))}
  //           </Stack>
  //           <Typography
  //             variant="h2"
  //             gutterBottom
  //             className="text-2xl md:text-5xl font-bold tracking-tight leading-7 md:leading-snug truncate"
  //           >
  //             {name}
  //           </Typography>
  //           <Typography variant="caption" color="graytext">
  //             by {author}. | {lessonCount} Lesson(s)
  //           </Typography>

  //           <div className="flex items-center mt-4">
  //             <NotificationsActiveIcon />

  //             <Typography
  //               className="mx-2 sm:mx-6 tracking-tight leading-6 sm:truncate"
  //               color="graytext"
  //             >
  //               {brief}
  //             </Typography>
  //           </div>
  //         </div>
  //       </div>
  //       <div className="flex items-center mt-4 sm:mt-0 mx-4 space-x-12">
  //         <Box width={'100%'} display="flex">
  //           <Rating
  //             name="read-only"
  //             value={Number(ratings?.toFixed(1)) || 5}
  //             readOnly
  //             color="primary"
  //           />
  //         </Box>

  //         <Badge badgeContent={posts?.length || 4} color="secondary">
  //           <ReviewsIcon color="action" />
  //         </Badge>
  //       </div>
  //     </div>
  //     {isRegd && <ProgressWithLabel value={30} />}
  //   </div>
  // );
};

export default CourseHeader;
