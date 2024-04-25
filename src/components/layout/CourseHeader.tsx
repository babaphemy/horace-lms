import { Box, Chip, Container, Rating, Stack, Typography } from "@mui/material";

interface Props {
  courseProps: {
    id: string;
    name: string;
    author: string;
    lessonCount: number;
    category: string;
    brief: string;
    ratings?: number | null;
    reviews?: number | null;
    preview?: string;
    posts?: any[];
    students?: number;
    totalSteps?: number;
  };
}
const CourseHeader = (props: Props) => {
  const { name, brief, category, lessonCount, ratings, author } =
    props?.courseProps || {};

  return (
    <Box
      sx={{
        background:
          "linear-gradient(197.86deg, #F59B9B 17.24%, #1B9CC3 69.35%, #107797 83.49%)",
        minHeight: "300px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        p: 5,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          px: { xs: 0, sm: 2, md: 4 },
        }}
      >
        <Box>
          <Stack
            spacing={2}
            sx={{
              maxWidth: "40rem",
            }}
          >
            <Stack direction={"row"} spacing={1}>
              {category
                ?.split(",")
                .map((x) => (
                  <Chip
                    key={x}
                    label={x}
                    variant="outlined"
                    className="text-white border-white"
                  />
                ))}
            </Stack>
            <Typography variant="h3" className="text-white">
              {name}
            </Typography>
            <Typography variant="subtitle1" className="text-white">
              {brief}
            </Typography>
            <Stack direction={"row"} spacing={1}>
              <Typography variant="caption" className="text-white">
                {Number(ratings?.toFixed(1)) || 5}
              </Typography>
              <Rating
                size="small"
                className="text-white "
                name="read-only"
                value={Number(ratings?.toFixed(1)) || 5}
                readOnly
              />
              <Typography variant="caption" className="text-white">
                How Students Rate This Course
              </Typography>
            </Stack>

            <Typography variant="caption" className="text-white text-[14px]">
              Taught by: {author}, Instructor | {lessonCount} Lesson(s)
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default CourseHeader;
