import React, { useEffect, useState } from 'react';
import ClassLayout from '../layout/ClassLayout';
import {
  Box,
  Chip,
  Container,
  IconButton,
  Paper,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import NextPrev from './NextPrev';
import { tCourse } from '../../types/types';
import { ThumbUpAltOutlined, ThumbDownAltOutlined } from '@mui/icons-material';
import Image from 'next/image';

type SkipLectureProps = {
  handleNext: (id: number | undefined) => void;
  handlePrev: () => void;
  playId: any;
  course: tCourse;
};

const SkipLecture = ({
  handleNext,
  handlePrev,
  playId,
  course,
}: SkipLectureProps) => {
  const [lessonCount, setLessonCount] = useState(1);
  const { assetCount, brief, courseName, category, posts, author } =
    course || {};

  useEffect(() => {
    if (assetCount) {
      setLessonCount(assetCount.lessonCount);
    }
  }, [assetCount]);
  const calculatedRating = () => {
    let total = 0;
    posts?.forEach((post: any) => {
      total += post.rating;
    });
    return total / posts?.length;
  };
  return (
    <ClassLayout>
      <Paper
        sx={{
          width: '100%',
          borderRadius: 7,
          padding: { xs: '15px', md: '40px' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '30rem',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" textAlign={'center'} my={5}>
            Go to the next lecture, this lecture page is still under development
          </Typography>
          <NextPrev
            handlePrev={handlePrev}
            playId={playId}
            course={course}
            handleNext={handleNext}
            lessonCount={0} // to do
          />
          <Paper className="flex flex-col p-10 w-full shadow rounded-2xl mt-3 lg:mt-8 overflow-hidden border-2 border-[#F9AD56]">
            <Box>
              <Stack
                spacing={2}
                sx={{
                  maxWidth: '40rem',
                }}
              >
                <Stack direction={'row'} spacing={1}>
                  {category?.split(',').map((x: string) => (
                    <Chip
                      key={x}
                      label={x}
                      variant="outlined"
                      className=" border-black"
                    />
                  ))}
                </Stack>
                <Typography variant="h3">{courseName}</Typography>
                <Typography variant="subtitle1">{brief}</Typography>
                <Stack direction={'row'} spacing={1}>
                  <Typography variant="caption">
                    {Number(calculatedRating()?.toFixed(1)) || 5}
                  </Typography>
                  <Rating
                    size="small"
                    name="read-only"
                    value={Number(calculatedRating()?.toFixed(1)) || 5}
                    readOnly
                  />
                  <Typography variant="caption">
                    How Students Rate This Course
                  </Typography>
                </Stack>

                <Typography variant="caption" className=" text-[14px]">
                  Taught by: {author?.firstname || 'Horace'}
                  {author?.lastname || 'Instructor'}, Instructor |{' '}
                  {lessonCount || ''} Lesson(s)
                </Typography>
              </Stack>
              <Stack direction={'row'} spacing={1} mt={3}>
                <IconButton>
                  <ThumbUpAltOutlined />
                </IconButton>
                <IconButton>
                  <ThumbDownAltOutlined />
                </IconButton>
                <IconButton>
                  <Image
                    src={'/img/shareLight.webp'}
                    alt="download icon"
                    width={20}
                    height={20}
                  />
                </IconButton>
                <IconButton>
                  <Image
                    src={'/img/downloadLight.webp'}
                    alt="download icon"
                    width={20}
                    height={20}
                  />
                </IconButton>
              </Stack>
            </Box>
          </Paper>
        </Container>
      </Paper>
    </ClassLayout>
  );
};

export default SkipLecture;
