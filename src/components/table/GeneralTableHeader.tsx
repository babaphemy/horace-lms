import { TableCell, TableHead, TableRow } from "@mui/material"
import React from "react"
interface GeneralTableHeaderProps {
  cells: string[]
}

const GeneralTableHeader: React.FC<GeneralTableHeaderProps> = ({ cells }) => {
  return (
    <TableHead sx={{ background: "#F7FAFF" }}>
      <TableRow>
        {cells.map((cell, index) => (
          <TableCell
            key={cell}
            sx={{ borderBottom: "1px solid #F7FAFF", fontSize: "13.5px" }}
            align={
              index === 0
                ? "left"
                : index === cells.length - 1
                  ? "right"
                  : "center"
            }
          >
            {cell}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

export default GeneralTableHeader
