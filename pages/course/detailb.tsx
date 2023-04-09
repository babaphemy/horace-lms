import {
  Code,
  Download,
  NoteAddRounded,
  PlayCircle,
  QuizRounded,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Rating,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { addUserCourse, fetchCourse, isCourseReg } from '../../api/rest';
import Header from '../../components/Header';
import ModalLogin from '../../components/auth/ModalLogin';
import SignUpLogin from '../../components/auth/ModalSignUp';
import CourseObjectives from '../../components/courses/CourseObjectives';
import { ReviewModal } from '../../components/courses/CourseReview';
import CourseHeader from '../../components/layout/CourseHeader';
import FooterLte from '../../components/layout/FooterLte';
import PaymentModal from '../../components/payment/PaymentModal';
import { MODAL_SET } from '../../context/Action';
import { AppDpx, Appcontext } from '../../context/AppContext';
import ReactPlayer from 'react-player';
import { COURSE_SET, SET_PLAY_ID } from '../../context/actions';
import Curriculumb from '../../components/courses/Curriculumb';
import SimilarCard from '../../components/SimilarCard';

const Detailb = () => {
  const { user, courses } = React.useContext(Appcontext);
  const dispatch = React.useContext(AppDpx);
  const [regCourse, setRegCourse] = React.useState<boolean>(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const cid = router.query.cid as string;
  const { data } = useQuery(['acourse', cid], () => fetchCourse(cid), {
    staleTime: 5000,
    cacheTime: 10,
    enabled: !!cid,
  });

  useEffect(() => {
    queryClient.invalidateQueries('acourse');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid]);

  const { mutate } = useMutation(isCourseReg, {
    onSuccess: (data) => {
      if (cid) {
        setRegCourse(data.includes(cid));
      }
    },
    onError: (error) => {
      console.log('error', error);
      setRegCourse(false);
    },
  });

  const {
    courseId,
    assetCount,
    curriculum,
    brief,
    target,
    courseName,
    category,
    posts,
    updatedOn,
  } = data || {};

  const calculatedRating = () => {
    let total = 0;
    posts?.forEach((post: any) => {
      total += post.rating;
    });
    return total / posts?.length;
  };
  const author = `${data?.author?.firstname || 'Horace'} ${
    data?.author?.lastname || 'Instructor'
  }`;
  const preview = curriculum?.section[0]?.lecture[0]?.video;
  const { lessonCount, downloadCount, quizCount, labCount, noteCount } =
    assetCount || {};

  React.useEffect(() => {
    if (user?.id && cid) {
      mutate(user?.id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, regCourse]);

  const addCourseToUser = useMutation(addUserCourse, {
    onSuccess: (data) => {
      addCourseToContext();
    },
    onError: (error) => {
      console.log('error', error);
    },
  });

  const addCourseToContext = () => {
    dispatch({
      type: COURSE_SET,
      data: {
        ...data,
        id: data?.courseId,
      },
    });
    dispatch({
      type: SET_PLAY_ID,
      data: {
        ...data.curriculum.section[0].lecture[0],
      },
    });
    router.push('/course/classroom');
    return;
  };

  const handleJoinClass = () => {
    const payload = {
      id: courseId,
      user: user?.id,
    };

    if (user?.id) {
      regCourse
        ? addCourseToContext()
        : data?.price === 0
        ? addCourseToUser.mutate(payload)
        : dispatch({ type: MODAL_SET, data: { open: true, type: 'payment' } });

      // addCourseToUser.mutate(payload);
    } else {
      dispatch({ type: MODAL_SET, data: { open: true, type: 'login' } });
    }
  };

  const headerProps = {
    id: data?.id,
    name: courseName,
    lessonCount,
    category,
    brief: data?.brief || '',
    ratings: calculatedRating(),
    reviews: data?.reviews,
    author,
    preview,
    updatedOn,
    posts,
  };
  const objProps = {
    target,
    courseName,
    curriculum,
    category,
    modified: updatedOn,
    brief,
    posts,
    ratings: calculatedRating(),
    handleJoinClass,
    regCourse,
  };

  return (
    <>
      {/* <DashboardHeader /> */}
      <Header />

      <CourseHeader courseProps={headerProps} />
      <Container
        maxWidth="lg"
        sx={{
          px: { xs: 0, sm: 2, md: 4 },
        }}
      >
        <div className="flex flex-col px-2 md:px-0 md:flex-row space-y-5 md:space-y-0">
          <div className="w-full  md:w-2/3">
            <Box className="my-4 px-2 block md:hidden">
              <ReactPlayer
                url={`https://essl.b-cdn.net/${preview}`}
                controls={true}
                loop={true}
                width="100%"
                height="100%"
                light={true}
              />
            </Box>
            <CourseObjectives {...objProps} />
          </div>
          <div className="w-full md:w-1/3 md:ml-6 relative md:-top-48 md:-mb-48">
            <Box className="flex flex-col rounded-2xl drop-shadow-md min-h-[50vh] ">
              <Box className="flex-1 bg-[#0F5E76] rounded-t-2xl py-[4.5rem]" />
              <Box className="flex-1 bg-white rounded-b-2xl px-10">
                <Box className="flex flex-col items-center justify-center relative -top-[6rem] -mb-[6rem]">
                  <Typography variant="h6" className="mb-4 text-white">
                    Meet your instructor
                  </Typography>
                  <Avatar
                    alt="instructor"
                    src={
                      data?.author?.dp ||
                      'https://material-ui.com/static/images/avatar/1.jpg'
                    }
                    sx={{ width: 120, height: 120 }}
                  />
                  <Typography
                    variant="subtitle1"
                    className="mt-4 text-xl font-normal text-black"
                  >
                    {author}
                  </Typography>
                  <Typography variant="subtitle1" className="text-black">
                    {data?.author?.title || 'Instructor'}
                  </Typography>
                  <Box className="border border-gray-400 flex items-center justify-between w-full p-2 rounded-xl my-2">
                    <Rating
                      name="author-rating"
                      value={Number(data?.author?.rating?.toFixed(1)) || 5}
                      readOnly
                      size="small"
                    />
                    <Divider orientation="vertical" flexItem />
                    <Typography variant="body2" className="text-black">
                      {data?.author?.courses?.length} Courses
                    </Typography>
                    <Divider orientation="vertical" flexItem />
                    <Typography variant="body2" className="text-black">
                      {data?.author?.reviews?.length} Review(s)
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle1"
                    className="mt-4 text-md font-normal text-black"
                  >
                    This Course Includes
                  </Typography>
                  <nav>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <PlayCircle fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${lessonCount || ''} Lessons`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <QuizRounded fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={`${quizCount || ''} Quizes`} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Code fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${labCount || ''} Hands-on Labs`}
                        />
                      </ListItem>
                      {downloadCount > 0 && (
                        <ListItem>
                          <ListItemIcon>
                            <Download fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary={`${downloadCount} Downloads`}
                          />
                        </ListItem>
                      )}

                      {noteCount > 0 && (
                        <ListItem>
                          <ListItemIcon>
                            <NoteAddRounded fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={`${noteCount} Notes`} />
                        </ListItem>
                      )}
                    </List>
                  </nav>
                  <Box className="flex justify-between items-center mb-10">
                    <Button
                      variant="contained"
                      className="bg-[#00A9C1] text-white py-2 px-10 rounded-full hover:bg-[#00A9C1]"
                      onClick={handleJoinClass}
                    >
                      Join Class
                    </Button>
                    <Typography variant="h6" className="text-[#00A9C1]">
                      ${data?.price || 0}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box className="mt-8 px-2 hidden md:block">
              <ReactPlayer
                url={`https://essl.b-cdn.net/${preview}`}
                controls={true}
                loop={true}
                width="100%"
                height="100%"
              />
            </Box>
            <Box className="mt-8 block ">
              <Paper className="py-7 p-3 mt-8 rounded-2xl border-2 border-[#FF869A] bg-gray-100">
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
        </div>
        <div className="mt-8 mb-4">
          <Typography variant="h4" className="my-5">
            Similar Courses
          </Typography>
        </div>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <SimilarCard />
          </Grid>
          <Grid item xs={12} md={6}>
            <SimilarCard />
          </Grid>
        </Grid>
      </Container>
      <ModalLogin />
      <SignUpLogin />
      <PaymentModal course={data} />
      <ReviewModal userId={user?.id} courseId={courseId} />
      <FooterLte />
    </>
  );
};

export default Detailb;
