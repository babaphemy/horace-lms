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
import { useQuery } from 'react-query';
import { fetchCourse } from '../../api/rest';

const Detailb = () => {
  function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
    //console.info('You clicked a breadcrumb.');
  }
  const router = useRouter();
  const cid = router.query.cid as string;
  const { data, isLoading, isError } = useQuery(
    ['acourse', cid],
    () => fetchCourse(cid),
    {
      staleTime: 5000,
      cacheTime: 10,
      enabled: !!cid,
    }
  );
  const {
    assetCount,
    curriculum,
    brief,
    target,
    courseName,
    category,
    updatedOn,
  } = data || {};
  const author = `${data?.author?.firstname || 'Horace'} ${
    data?.author?.lastname || 'Instructor'
  }`;
  const preview = curriculum?.section[0]?.lecture[0]?.video;
  const { lessonCount, downloadCount, quizCount, labCount, noteCount } =
    assetCount || {};
  const headerProps = {
    id: data?.id,
    name: courseName,
    lessonCount,
    category,
    brief: data?.brief || '',
    ratings: data?.ratings,
    reviews: data?.reviews,
    author,
    preview,
    updatedOn,
  };
  const objProps = {
    target,
    courseName,
    curriculum,
    category,
    modified: updatedOn,
    brief,
  };
  return (
    <>
      <DashboardHeader />
      <Container maxWidth="xl" className="px-32">
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
        <div className="flex">
          <div className="w-2/3">
            <CourseObjectives {...objProps} />
          </div>
          <div className="w-1/3 ml-6">
            <Paper className="p-8 rounded border-2 border-t-red-500">
              <Typography variant="h6" className="mb-4">
                ${(data?.price || 0) - (data?.tax || 0)}
              </Typography>
              <Button variant="outlined" fullWidth endIcon={<ShoppingCart />}>
                Join Class
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
      <FooterLte />
    </>
  );
};

export default Detailb;
