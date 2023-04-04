import {
  Code,
  Download,
  NoteAddRounded,
  PlayCircle,
  QuizRounded,
  ShoppingCart,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Rating,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { useMutation, useQuery } from 'react-query';
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
import { COURSE_SET, SET_PLAY_ID } from '../../context/actions';

const Detailb = () => {
  const { user } = React.useContext(Appcontext);
  const dispatch = React.useContext(AppDpx);
  const [regCourse, setRegCourse] = React.useState<boolean>(false);
  const router = useRouter();
  const cid = router.query.cid as string;
  const { data } = useQuery(['acourse', cid], () => fetchCourse(cid), {
    staleTime: 5000,
    cacheTime: 10,
    enabled: !!cid,
  });

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
                    Instructor
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="subtitle1"
                    className="mt-4 text-lg font-normal text-black"
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
            {/* <Paper className="flex flex-col rounded-2xl drop-shadow-lg min-h-[300px]">
              <Box className="bg-[#0F5E76] h-[30%] w-full">hmm</Box>
              <Box className="h-[70%]"></Box> */}
            {/* <Typography variant="h6" className="mb-4">
                ${(data?.price || 0) - (data?.tax || 0)}
              </Typography>
              <Button
                variant="contained"
                className="bg-[#00A9C1] text-white py-2 rounded-full hover:bg-[#00A9C1]"
                fullWidth
                endIcon={<ShoppingCart />}
                onClick={handleJoinClass}
              >
                Join Class
              </Button>
              <Typography variant="h6" className="mt-4">
                This course contains
              </Typography>
              <nav>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <PlayCircle />
                    </ListItemIcon>
                    <ListItemText primary={`${lessonCount || ''} Lessons`} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <QuizRounded />
                    </ListItemIcon>
                    <ListItemText primary={`${quizCount || ''} Quizes`} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Code />
                    </ListItemIcon>
                    <ListItemText primary={`${labCount || ''} Hands-on Labs`} />
                  </ListItem>
                  {downloadCount > 0 && (
                    <ListItem>
                      <ListItemIcon>
                        <Download />
                      </ListItemIcon>
                      <ListItemText primary={`${downloadCount} Downloads`} />
                    </ListItem>
                  )}

                  {noteCount > 0 && (
                    <ListItem>
                      <ListItemIcon>
                        <NoteAddRounded />
                      </ListItemIcon>
                      <ListItemText primary={`${noteCount} Notes`} />
                    </ListItem>
                  )}
                </List>
              </nav>
              <Divider />
              <Typography variant="h6" className="mt-4">
                Meet the Instructor
              </Typography>
              <div className="flex mt-4">
                <Avatar
                  alt="instructor"
                  src={
                    data?.author?.dp ||
                    'https://material-ui.com/static/images/avatar/1.jpg'
                  }
                  sx={{ width: 56, height: 56 }}
                />
                <div className="ml-4">
                  <Typography variant="subtitle1" className="capitalize">
                    {author}
                  </Typography>
                  <Typography variant="caption">
                    {data?.author?.title || 'Instructor'}
                  </Typography>
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <Rating
                  name="author-rating"
                  value={Number(data?.author?.rating?.toFixed(1)) || 5}
                  readOnly
                />
                <Typography variant="body2">
                  {data?.author?.courses?.length} Courses
                </Typography>
                <Typography variant="body2">
                  {data?.author?.reviews?.length} Review(s)
                </Typography>
              </div> */}
            {/* </Paper> */}
          </div>
        </div>
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
