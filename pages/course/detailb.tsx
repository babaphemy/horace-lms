import {
  Avatar,
  Breadcrumbs,
  Button,
  Container,
  Divider,
  Link as MuiLink,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Rating,
  Typography,
} from '@mui/material';
import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import GrainIcon from '@mui/icons-material/Grain';
import DashboardHeader from '../../components/layout/DashboardHeader';
import CourseHeader from '../../components/layout/CourseHeader';
import CourseObjectives from '../../components/courses/CourseObjectives';
import {
  Code,
  Download,
  NoteAddRounded,
  PlayCircle,
  QuizRounded,
  School,
  ShoppingCart,
} from '@mui/icons-material';
import Link from 'next/link';
import FooterLte from '../../components/layout/FooterLte';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from 'react-query';
import { addUserCourse, fetchCourse, isCourseReg } from '../../api/rest';
import { MODAL_SET } from '../../context/Action';
import { Appcontext, AppDpx } from '../../context/AppContext';
import ModalLogin from '../../components/auth/ModalLogin';
import { COURSE_SET, SET_PLAY_ID } from '../../context/actions';
import SignUpLogin from '../../components/auth/ModalSignUp';
import PaymentModal from '../../components/payment/PaymentModal';
import { ReviewModal } from '../../components/courses/CourseReview';

const Detailb = () => {
  function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
    //console.info('You clicked a breadcrumb.');
  }
  const { user } = React.useContext(Appcontext);
  const dispatch = React.useContext(AppDpx);
  const [regCourse, setRegCourse] = React.useState<boolean>(false);
  const router = useRouter();
  const cid = router.query.cid as string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, isLoading, isError } = useQuery(
    ['acourse', cid],
    () => fetchCourse(cid),
    {
      staleTime: 5000,
      cacheTime: 10,
      enabled: !!cid,
    }
  );

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
      <DashboardHeader />
      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 0, sm: 2, md: 4 },
        }}
      >
        <CourseHeader courseProps={headerProps} />
        <div role="presentation" onClick={handleClick} className="my-4">
          <Breadcrumbs aria-label="breadcrumb">
            <Link href={'/'} shallow>
              <MuiLink
                underline="hover"
                sx={{ display: 'flex', alignItems: 'center' }}
                color="inherit"
              >
                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Home
              </MuiLink>
            </Link>
            <MuiLink
              underline="hover"
              sx={{ display: 'flex', alignItems: 'center' }}
              color="inherit"
              href="/courses"
            >
              <School sx={{ mr: 0.5 }} fontSize="inherit" />
              Courses
            </MuiLink>
            <Typography
              sx={{ display: 'flex', alignItems: 'center' }}
              color="text.primary"
            >
              <GrainIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Course
            </Typography>
          </Breadcrumbs>
        </div>
        <div className="flex flex-col px-2 md:px-0 md:flex-row space-y-5 md:space-y-0">
          <div className="w-full  md:w-2/3">
            <CourseObjectives {...objProps} />
          </div>
          <div className="w-full  md:w-1/3 md:ml-6">
            <Paper className="py-10 px-3 md:p-8 border-2 rounded-2xl md:rounded border-t-red-500">
              <Typography variant="h6" className="mb-4">
                ${(data?.price || 0) - (data?.tax || 0)}
              </Typography>
              <Button
                variant="outlined"
                fullWidth
                endIcon={<ShoppingCart />}
                onClick={handleJoinClass}
              >
                {regCourse ? 'Continue Class' : 'Join Class'}
              </Button>
              <Divider />
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
                  value={data?.author?.rating || 5}
                  readOnly
                />
                <Typography variant="body2">
                  {data?.author?.courses?.length} Courses
                </Typography>
                <Typography variant="body2">
                  {data?.author?.reviews?.length} Review(s)
                </Typography>
              </div>
            </Paper>
          </div>
        </div>
      </Container>
      <ModalLogin />
      <SignUpLogin />
      <PaymentModal course={data} />
      <ReviewModal />
      <FooterLte />
    </>
  );
};

export default Detailb;
