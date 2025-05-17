import React from "react"
import {
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Paper,
  Table,
  TableContainer,
} from "@mui/material"

interface SubjectsTableProps {
  subjects: string[]
}

const SubjectsTable: React.FC<SubjectsTableProps> = ({ subjects }) => {
  return (
    <TableContainer component={Paper} sx={{ my: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              align="left"
              style={{ fontWeight: "bold", fontSize: "16px" }}
            >
              Subjects - {subjects?.length || 0}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subjects?.map((subject, index) => (
            <TableRow key={index}>
              <TableCell align="left">{subject}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default SubjectsTable
