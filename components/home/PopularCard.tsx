import { Avatar, Box, Divider, Rating, Typography } from '@mui/material';
import Image from 'next/image';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useRouter } from 'next/router';

const Tag = ({ label }: { label: string }) => {
  const reduceLabelLength = (label: string) => {
    if (label?.length > 10) {
      return label.slice(0, 10) + '...';
    }
    return label;
  };

  return (
    <Box sx={cardStyles.tag}>{reduceLabelLength(label) || 'Programming'}</Box>
  );
};

const PopularCard = ({ data, img }: any) => {
  const router = useRouter();
  const { id, courseName, author, category, brief, posts, thumbnail } = data;

  const handleCardClick = () => {
    router.push(`/course/detailb?cid=${id}`);
  };

  const formattedBrief = (brief: string) => {
    if (brief?.length > 85) {
      return brief.slice(0, 85) + '...';
    }
    return brief;
  };

  const calculatedRating = () => {
    let total = 0;
    posts?.forEach((post: any) => {
      total += post.rating;
    });
    return total / posts?.length;
  };

  return (
    <Box>
      <Box sx={cardStyles.card}>
        <Box sx={cardStyles.image}>
          <Image
            src={
              (thumbnail && require(`../../assets/img/${thumbnail}`)) ||
              img ||
              'https://material-ui.com/static/images/cards/contemplative-reptile.jpg'
            }
            alt="a man smiling"
            width={'400rem'}
            height={'250rem'}
            style={{ borderRadius: '15px' }}
          />
        </Box>
        <Box padding={'20px'}>
          <Box sx={cardStyles.between}>
            <Typography
              variant="subtitle1"
              sx={{ ...cardStyles.between, cursor: 'pointer' }}
              onClick={handleCardClick}
            >
              <PlayCircleIcon
                color="primary"
                sx={{
                  marginRight: '5px',
                }}
              />
              Horace
            </Typography>
            <Tag label={category} />
          </Box>
          <Typography
            variant="h6"
            my={1}
            sx={cardStyles.pointer}
            onClick={handleCardClick}
          >
            {courseName}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            my={1}
            minHeight={'50px'}
          >
            {formattedBrief(brief) || ''}
          </Typography>
          <Box sx={cardStyles.between}>
            <Box display={'flex'} my={1}>
              <Avatar
                alt="instructor"
                src="https://material-ui.com/static/images/avatar/1.jpg"
                sx={{ width: 50, height: 50 }}
              />
              <Box ml={1}>
                <Typography variant="body1" margin={0}>
                  {author}
                </Typography>
                <Typography variant="caption" margin={0} color="primary">
                  Software Engineer
                </Typography>
              </Box>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box sx={cardStyles.numbers}>
              <FavoriteIcon color="primary" />
              <Typography variant="body2" sx={cardStyles.between}>
                <Typography variant="body2" sx={{ ml: 1 }}>
                  500+
                </Typography>
                Students
              </Typography>
            </Box>
          </Box>
          <Box sx={cardStyles.between} my={1}>
            <Box sx={cardStyles.between}>
              <Rating
                name="author-rating"
                value={calculatedRating() || 1}
                readOnly
              />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {calculatedRating() || 5}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              component="span"
              onClick={handleCardClick}
              sx={cardStyles.pointer}
            >
              Learn More <AddCircleIcon sx={{ ml: 1 }} />
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PopularCard;
const cardStyles = {
  container: {},
  card: {
    borderRadius: '15px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0px 7px 12px 3px rgba(0, 0, 0, 0.2)',
  },
  tag: {
    backgroundColor: '#FF685433',
    borderRadius: '10px',
    padding: '5px 10px',
    color: '#FF6854',
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'inline-block',
    textTransform: 'capitalize',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: '15px',
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
