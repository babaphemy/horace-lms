import { Box, Typography } from '@mui/material';

const Benefits = () => {
  return (
    <Box>
      <Box sx={benefitsStyles.top}>
        <Typography
          variant="h5"
          sx={{
            color: '#FF6854',
          }}
        >
          Benefits
        </Typography>
        <Typography variant="h3">Learn From The Best Teachers</Typography>
        <Typography variant="body2">
          We believe that education should be accessible to all and strive to
          provide equal opportunities to those looking to learn, grow and make a
          positive impact in the world. With our platform, you can gain
          knowledge and skills from industry experts, working professionals and
          experienced teachers, no matter your background or location. Join us
          in our mission to revolutionize education and empower learners
          everywhere!
        </Typography>
      </Box>
    </Box>
  );
};

export default Benefits;

const benefitsStyles = {
  container: {},
  top: {
    maxWidth: '700px',
    '& > *': {
      marginBottom: '10px',
    },
  },
};
