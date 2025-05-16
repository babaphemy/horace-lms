import { Box } from "@mui/material"
import { useParams } from "next/navigation"

const EditCoursePage = () => {
  const params = useParams()
  const { cid } = params
  return <Box>Edit Course {cid}</Box>
}
export default EditCoursePage
