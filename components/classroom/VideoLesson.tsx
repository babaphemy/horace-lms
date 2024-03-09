import { ThumbDownAltOutlined, ThumbUpAltOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Rating,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import ReactPlayer from 'react-player';
import Curriculumb from '../../components/courses/Curriculumb';
import ClassLayout from '../../components/layout/ClassLayout';
import { AppDpx, Appcontext } from '../../context/AppContext';
import { tCurriculum, tNextPrev } from '../../types/types';
interface Props {
  handleNext: (id: number | undefined) => void;
  handlePrev: () => void;
  handleOpenExercise: () => void;
}

export function countLectureItems(curriculum: tCurriculum): number {
  let lectureCount = 0;

  for (const section of curriculum.section) {
    lectureCount += section.lecture.length;
  }

  return lectureCount;
}
const ClassroomB = ({ handleNext, handlePrev, handleOpenExercise }: Props) => {
  const { course, playId, user }: any = useContext(Appcontext);
  const router = useRouter();
  const dispatch = useContext(AppDpx);

  const { curriculum, brief, courseName, category, posts, author } =
    course || {};
  const playing = playId || curriculum?.section[0]?.lecture[0];

  const lessonCount =
    curriculum?.section?.length > 0 ? countLectureItems(curriculum) : 0;

  useEffect(() => {
    if (!course) {
      router.push('/courses');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (playId?.video === '' && playId?.id && playId.id > 1)
      handleNext(playId?.id - 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course, playId]);

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
          display: { xs: 'block', md: 'flex' },
        }}
      >
        <div className="w-full md:w-4/6">
          <Box className="flex justify-between items-end">
            <Box>
              <Typography variant="h4" mb={'5px'}>
                Classroom
              </Typography>
              <Typography variant="subtitle1" className="text-gray-600 text-md">
                <span className="text-[#EE3B59] font-bold text-xl">
                  Week {playing?.id}
                </span>
                : {courseName} / {playing?.title}
              </Typography>
            </Box>
            <Button
              variant="contained"
              className="bg-[#00A9C1] text-white py-2 px-10 rounded-full hover:bg-[#00A9C1]"
              onClick={handleOpenExercise}
            >
              Exercise
            </Button>
          </Box>
          {playing?.video && (
            <>
              <Box my={'10px'} className="min-h-[25rem]">
                {playing?.video ? (
                  <ReactPlayer
                    url={`https://essl.b-cdn.net/${playing?.video}`}
                    width="100%"
                    height="100%"
                    controls={true}
                    loop={true}
                    config={{
                      file: {
                        attributes: {
                          controlsList: 'nodownload',
                          defer: true,
                        },
                      },
                    }}
                  />
                ) : (
                  <Skeleton
                    variant="rectangular"
                    width={'100%'}
                    height={'100%'}
                  />
                )}
              </Box>
              <Box className="my-2">
                <NextPrev
                  handlePrev={handlePrev}
                  playId={playId}
                  course={course}
                  handleNext={handleNext}
                  lessonCount={0} // to do
                />
              </Box>
            </>
          )}

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
                  {author?.lastname || 'Instructor'}, Instructor | {lessonCount}{' '}
                  Lesson(s)
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
          {!playing?.video && (
            <Box className="my-2">
              <NextPrev
                handlePrev={handlePrev}
                playId={playId}
                course={course}
                handleNext={handleNext}
                lessonCount={0} // to do
              />
            </Box>
          )}
          <Box className="mt-3 md:mt-8">
            <Box className="flex justify-between items-center mr-3 ml-6">
              <Typography variant="h5">Materials</Typography>

              <Typography variant="subtitle1">
                Download All{' '}
                <IconButton>
                  <Image
                    src={'/img/downloadLight.webp'}
                    alt="download icon"
                    width={20}
                    height={20}
                  />
                </IconButton>{' '}
              </Typography>
            </Box>
            <Box className="my-5">
              {curriculum?.section?.map((curriculum: any) => {
                return (
                  <Box className="rounded-xl my-2 bg-[#E9E7E6] flex items-center justify-between pl-4 md:pl-14 pr-3  py-1">
                    <Typography variant="subtitle1">
                      {curriculum.title}.zip
                    </Typography>
                    <IconButton>
                      <Image
                        src={'/img/downloadDark.webp'}
                        alt="download icon"
                        width={20}
                        height={20}
                      />
                    </IconButton>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </div>
        <div className="w-full md:w-2/6 md:ml-6">
          <Box className="md:mt-24 block ">
            <Paper className="py-4 p-3 my-8 rounded-2xl border-2 border-[#FF869A] bg-gray-100">
              <Typography variant="h6" className="mt-4 mx-4">
                Syllabus
              </Typography>
              <Curriculumb
                courseName={courseName}
                curriculum={curriculum}
                isShort={true}
              />
            </Paper>
          </Box>
        </div>
      </Paper>
    </ClassLayout>
  );
};

const NextPrev = ({
  handlePrev,
  playId,
  handleNext,
  lessonCount,
}: tNextPrev) => {
  return (
    <Box display={'flex'} justifyContent="space-between">
      <Button onClick={handlePrev} disabled={playId?.id === 1}>
        Previous
      </Button>
      <Button
        onClick={() => handleNext(playId?.id)}
        disabled={playId?.id === lessonCount}
      >
        Next
      </Button>
    </Box>
  );
};

export default ClassroomB;
const playerStyles = {
  boxWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  frameContainer: { position: 'relative', paddingTop: '56.25%' },
  framePlayer: {
    border: 'none',
    position: 'absolute',
    top: 0,
    height: '100%',
    width: '100%',
  },
};
