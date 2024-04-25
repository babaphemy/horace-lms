import { Box, Grid, Typography } from "@mui/material"
import BenefitCard from "./BenefitCard"

const Benefits = () => {
  return (
    <Box>
      <Box sx={benefitsStyles.top}>
        <Typography
          variant="h5"
          sx={{
            color: "#FF6854",
            mb: 2,
          }}
        >
          Benefits
        </Typography>
        <Typography variant="h3" mb={2}>
          Learn From Industry Experts
        </Typography>
        <Typography variant="body2" align="justify" mb={2}>
          At Horace, we're on a mission to democratize education and create a
          level playing field for all. Our platform offers unparalleled access
          to world-class instructors, industry experts, and working
          professionals, enabling you to gain the knowledge and skills needed to
          make a positive impact on the world. Whether you're from a small town
          or a big city, we believe that anyone can achieve their dreams with
          the right education and support. Join us today and take the first step
          towards unlocking your true potential!
        </Typography>
      </Box>
      <Box sx={benefitsStyles.cardContainer}>
        <Grid container spacing={2}>
          {cards.map((card, idx) => (
            <Grid key={idx} item xs={12} sm={6} md={4}>
              <BenefitCard {...card} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}

export default Benefits

const benefitsStyles = {
  cardContainer: {
    my: 5,
  },
  top: {
    maxWidth: "700px",
  },
}

const cards = [
  {
    icon: "/img/plus.webp",
    title: "Learn New Skills",
    description:
      "Gain access to premier educational resources and learn new skills from industry leaders, working professionals, and experienced educators.",
    color: "#F9AD56",
  },
  {
    icon: "/img/book.webp",
    title: "Change Careers",
    description:
      "Unlock New Opportunities and Achieve Your financial Goals Today! With our curated hands-on labs that guarantees on-the-job skills, you'll be ready to take on the world.",
    color: "#16C79A",
  },
  {
    icon: "/img/group.webp",
    title: "Experienced Instructors",
    description:
      "Expert and Experienced Instructors Ready to Guide You to Success! Our Instructors are Industry Leaders, Working Professionals, and Experienced Educators.",
    color: "#FF5E78",
  },
]
