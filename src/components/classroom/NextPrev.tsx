import { Box, Button } from "@mui/material"
import { tNextPrev } from "../../types/types"

const NextPrev = ({ handlePrev, playId, course, handleNext }: tNextPrev) => {
  return (
    <Box display={"flex"} justifyContent="space-between">
      <Button
        variant="contained"
        className="bg-[#00A9C1] text-white py-1 px-6 rounded-full hover:bg-[#00A9C1]"
        onClick={handlePrev}
        disabled={Number(playId) === 1}
      >
        Previous
      </Button>
      <Button
        variant="contained"
        className="bg-[#00A9C1] text-white py-1 px-6 rounded-full hover:bg-[#00A9C1]"
        onClick={() => handleNext(Number(playId))}
        disabled={Number(playId) === course?.assetCount?.lessonCount}
      >
        Next
      </Button>
    </Box>
  )
}

export default NextPrev
