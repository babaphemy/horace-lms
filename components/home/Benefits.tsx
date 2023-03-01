import { Box, Grid, Typography } from '@mui/material';
import BenefitCard from './BenefitCard';

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
      <Box sx={benefitsStyles.cardContainer}>
        <Grid container spacing={2}>
          {cards.map((card, idx) => (
            <Grid item xs={12} sm={6} md={4}>
              <BenefitCard key={idx} {...card} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Benefits;

const benefitsStyles = {
  cardContainer: {
    my: 5,
  },
  top: {
    maxWidth: '700px',
    '& > *': {
      marginBottom: '20px',
    },
  },
};

const cards = [
  {
    icon: require('../../assets/img/plus.png'),
    title: 'Learn New Skills',
    description:
      'Get access to top-notch educational resources to learn new skills from leaders in your field, working professionals, and experienced teachers',
    color: '#F9AD56',
  },
  {
    icon: require('../../assets/img/book.png'),
    title: "Free Trial's Available",
    description:
      "Our platform offers the chance to explore our courses, try them out, and only pay once you're sure you want to continue. Get a feel for our courses and start learning from the best",
    color: '#16C79A',
  },
  {
    icon: require('../../assets/img/group.png'),
    title: "Expert Tutor's",
    description:
      'Horace Learning provides expert tutors to help students reach their full potential. Our tutors come from all backgrounds and specializations, and are committed to providing personalized instruction to each learner.',
    color: '#FF5E78',
  },
];
