import React from "react"
import {
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Stack,
} from "@mui/material"

interface NoRecordFoundProps {
  text: string
}

const NoRecordFound: React.FC<NoRecordFoundProps> = ({ text }) => {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={5}>
          <Stack sx={{ width: "100%" }} spacing={2}>
            <Typography sx={{ textAlign: "center" }}>{text}</Typography>
          </Stack>
        </TableCell>
      </TableRow>
    </TableBody>
  )
}

export default NoRecordFound
