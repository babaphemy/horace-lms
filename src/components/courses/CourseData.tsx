import { courseStyles } from "@/styles/courseStyles"
import { tCourseLte } from "@/types/types"
import { Box, CircularProgress, Grid, Typography } from "@mui/material"
import PopularCard from "../home/PopularCard"

interface Props {
  currentFilter: {
    label: string
    value: string
  }
  filteredData: tCourseLte[] | []
  isLoading: boolean
}

const CourseData: React.FC<Props> = ({
  currentFilter,
  filteredData,
  isLoading,
}) => {
  return (
    <Box>
      <Typography variant="h3" sx={courseStyles.title}>
        {currentFilter.label} ({filteredData?.length})
      </Typography>
      {isLoading && <CircularProgress />}
      <Grid container spacing={5}>
        {filteredData?.map((course: tCourseLte, index: number) => {
          return (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
              <PopularCard data={course} />
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}
export default CourseData
