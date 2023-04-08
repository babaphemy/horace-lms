import { Box, Typography, Avatar, Divider, Rating } from '@mui/material';
import React from 'react';
import { Tag } from './home/PopularCard';
import Image from 'next/image';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const SimilarCard = () => {
  return (
    <Box>
      <Box sx={similarStyles.card}>
        <Image
          src={`/img/${'1.jpg'}`}
          alt="a man smiling"
          width={'170rem'}
          height={'200rem'}
          style={{ borderRadius: '15px 0px 0px 15px' }}
        />
        <Box sx={similarStyles.right}>
          <Box sx={similarStyles.between}>
            <Typography
              variant="subtitle1"
              sx={{ ...similarStyles.between, cursor: 'pointer' }}
            >
              <PlayCircleIcon
                color="primary"
                sx={{
                  marginRight: '5px',
                }}
              />
              Horace
            </Typography>
            <Tag label="Programming" />
          </Box>
          <Typography variant="h6" my={1} sx={similarStyles.pointer}>
            React Course
          </Typography>

          <Box sx={similarStyles.between}>
            <Box display={'flex'} my={1}>
              <Avatar
                alt="instructor"
                src="https://material-ui.com/static/images/avatar/1.jpg"
                sx={{ width: 50, height: 50 }}
              />
              <Box ml={1}>
                <Typography variant="body1" margin={0}>
                  Isah Ibrahim
                </Typography>
                <Typography variant="caption" margin={0} color="primary">
                  Software Engineer
                </Typography>
              </Box>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box sx={similarStyles.numbers}>
              <FavoriteIcon color="primary" />
              <Typography variant="body2" sx={similarStyles.between}>
                <Typography variant="body2" sx={{ ml: 1 }}>
                  100 students
                </Typography>
              </Typography>
            </Box>
          </Box>
          <Box sx={similarStyles.between} my={1}>
            <Box sx={similarStyles.between}>
              <Rating name="author-rating" value={5} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>
                5
              </Typography>
            </Box>
            <Typography
              variant="body2"
              component="span"
              sx={similarStyles.pointer}
            >
              Learn More <AddCircleIcon sx={{ ml: 1 }} />
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SimilarCard;

const similarStyles = {
  card: {
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0px 7px 12px 3px rgba(0, 0, 0, 0.2)',
    borderRadius: '15px',
  },

  right: {
    px: 2,
    flex: 6,
  },
  between: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  numbers: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  pointer: {
    cursor: 'pointer',
  },
};
