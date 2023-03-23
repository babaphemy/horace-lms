import {
  Avatar,
  Box,
  Button,
  Divider,
  LinearProgress,
  LinearProgressProps,
  Rating,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { MODAL_SET } from '../../context/Action';
import { AppDpx } from '../../context/AppContext';
import ModalContainer from '../ModalContainer';

type Props = {
  posts?: any[];
  ratings?: number | null;
};

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number; label: string }
) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box
        sx={{
          mr: 1,
          flex: 2,
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '0.75rem', md: '1rem' },
          }}
          color="text.secondary"
        >
          {props.label}
        </Typography>
      </Box>
      <Box sx={{ flex: 6 }}>
        <LinearProgress
          variant="determinate"
          {...props}
          sx={{
            borderRadius: '10px',
          }}
        />
      </Box>
      <Box sx={{ ml: 1, flex: 2 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const CourseReview = (props: Props) => {
  const dispatch = React.useContext(AppDpx);

  const { posts, ratings } = props;

  const handleOpenReviewModal = () => {
    dispatch({ type: MODAL_SET, data: { open: true, type: 'review' } });
  };

  return (
    <div>
      <Typography
        variant="h4"
        sx={{
          fontSize: { xs: '1.5rem', md: '2rem' },
        }}
      >
        Reviews & Ratings
      </Typography>
      <Typography
        variant="body1"
        sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }}
      >
        Our Students says about this course
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            mt: 2,
            p: 2,
            flex: 1,
            maxWidth: '700px',

            '@media (max-width: 1000px)': {
              width: '100%',
            },
          }}
        >
          <Box
            sx={{
              backgroundColor: '#FF534F11',
              color: 'black',
              p: 3,
              mr: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minHeight: '200px',

              '@media (max-width: 1000px)': {
                mr: 0,
                mb: 1,
                width: '100%',
              },
            }}
          >
            <Typography variant="h2">{ratings || 5}</Typography>
            <Rating
              name="read-only"
              value={ratings || 1}
              readOnly
              sx={{
                my: 1,
              }}
            />
            <Typography variant="body1">{posts?.length} Review(s)</Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: '#FF534F11',
              color: 'black',
              p: 3,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minHeight: '200px',

              '@media (max-width: 1000px)': {
                width: '100%',
              },
            }}
          >
            <Box>
              <LinearProgressWithLabel
                label="Excellent"
                variant="determinate"
                value={100}
              />
              <LinearProgressWithLabel
                label="Very Good"
                variant="determinate"
                value={80}
              />
              <LinearProgressWithLabel
                label="Average"
                variant="determinate"
                value={60}
              />
              <LinearProgressWithLabel
                label="Poor"
                variant="determinate"
                value={40}
              />
              <LinearProgressWithLabel
                label="Terrible"
                variant="determinate"
                value={20}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Button sx={styles.button} onClick={handleOpenReviewModal}>
        Add Review & Rating
      </Button>
      <Box>
        {posts?.map((post, index, array) => (
          <Box key={index}>
            <Box display={'flex'} my={1}>
              <Avatar
                alt="instructor"
                src="https://material-ui.com/static/images/avatar/1.jpg"
                sx={{ width: 50, height: 50 }}
              />
              <Box ml={2}>
                <Box display="flex" alignItems="center">
                  <Typography variant="body1" margin={0}>
                    {post.user.firstname + ' ' + post.user.lastname}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" ml={1}>
                    2 days ago
                  </Typography>
                </Box>
                <Rating
                  name="read-only"
                  value={post.rating}
                  readOnly
                  size="small"
                />
              </Box>
            </Box>
            <Typography variant="body1" color="text.secondary" ml={3}>
              {post.comment ||
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam a iure quod voluptas quia quae voluptates quibusdam, voluptatibus, quos.'}
            </Typography>

            {array.length - 1 !== index && array.length > 1 && (
              <Divider sx={{ my: 2 }} />
            )}
          </Box>
        ))}
      </Box>
    </div>
  );
};

export default CourseReview;

export const ReviewModal = () => {
  const dispatch = React.useContext(AppDpx);

  return (
    <ModalContainer type="review">
      <Box
        sx={{
          minWidth: '500px',
        }}
      >
        <Typography variant="h4">Add Review & Rating</Typography>
        <Divider sx={{ my: 2 }} />
        <Box>
          <Typography variant="h5">Your Rating</Typography>
          <Rating
            name="customized-10"
            defaultValue={1}
            max={5}
            onChange={(event, newValue) => {
              console.log(newValue);
            }}
          />
          <Typography variant="h5" ml={1}>
            Your Review
          </Typography>
          <TextField
            multiline
            rows={4}
            variant="outlined"
            sx={{ width: '100%', ml: 1 }}
          />
        </Box>
        <Button
          sx={styles.button}
          onClick={() => {
            dispatch({
              type: MODAL_SET,
              data: { open: false, type: 'review' },
            });

            console.log('submit');
          }}
        >
          Submit
        </Button>
      </Box>
    </ModalContainer>
  );
};

const styles = {
  button: {
    border: '1px solid',
    borderColor: 'primary',
    px: 4,
    my: 2,
  },
};
