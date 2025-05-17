import { tCourse } from "@/types/types"
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline"
import MoreIcon from "@mui/icons-material/MoreHoriz"
import TableViewIcon from "@mui/icons-material/TableView"
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material"
import React, { useState } from "react"
import { categories } from "../courses/CourseDashboard"
import { tableBodyStyles } from "./tableBodyStyles"

const ITEM_HEIGHT = 48

export type TableClickType = "delete" | "edit" | "view"

interface SubjectsTableBodyProps {
  rowsPerPage: number
  filteredData: tCourse[]
  page?: number
  emptyRows: number
  handleUserClick?: (_item: tCourse, _type: TableClickType) => void
  isLoading?: boolean
}

const SubjectsTableBody: React.FC<SubjectsTableBodyProps> = ({
  rowsPerPage,
  filteredData,
  page = 0,
  emptyRows,
  handleUserClick = () => {},
  isLoading,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [currentItem, setCurrentItem] = useState<tCourse | null>(null)
  const open = Boolean(anchorEl)

  interface ClickEvent {
    currentTarget: EventTarget & HTMLButtonElement
  }

  const handleClick = (event: ClickEvent, item: tCourse) => {
    setAnchorEl(event.currentTarget)
    setCurrentItem(item)
  }
  const handleClose = () => {
    setAnchorEl(null)
    setCurrentItem(null)
  }

  const handleMenuClick = (item: tCourse, type: TableClickType) => {
    handleUserClick(item, type)
    handleClose()
  }
  if (isLoading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={4} align="center">
            Loading...
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }
  return (
    <TableBody>
      {(rowsPerPage > 0
        ? filteredData?.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
          )
        : filteredData
      )?.map((course) => {
        const currentCategory: string | undefined = categories?.find(
          (item) => item === course.category
        )
        return (
          <TableRow key={course.id}>
            <TableCell style={tableBodyStyles.firstCell}>
              <Box sx={tableBodyStyles.center}>
                <Box>
                  <Typography
                    component="h5"
                    sx={tableBodyStyles.name}
                    className="ml-10px"
                  >
                    {`${course.courseName}`}
                  </Typography>
                </Box>
              </Box>
            </TableCell>

            <TableCell align="center" style={tableBodyStyles.email}>
              {currentCategory}
            </TableCell>

            <TableCell align="center" style={tableBodyStyles.email}>
              {course?.assetCount?.topicCount} Lessons,{" "}
              {course?.assetCount?.lessonCount} Topics
            </TableCell>

            <TableCell align="right" sx={{ borderBottom: "1px solid #F7FAFF" }}>
              <div>
                <IconButton
                  aria-label="more"
                  id="long-button"
                  aria-controls={open ? "long-menu" : undefined}
                  aria-expanded={open ? "true" : undefined}
                  aria-haspopup="true"
                  onClick={(event) => handleClick(event, course)}
                >
                  <MoreIcon />
                </IconButton>

                <Menu
                  id="long-menu"
                  MenuListProps={{
                    "aria-labelledby": "long-button",
                  }}
                  anchorEl={anchorEl}
                  open={open && currentItem?.id === course?.id}
                  onClose={handleClose}
                  slotProps={{
                    paper: {
                      style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: "20ch",
                      },
                    },
                  }}
                >
                  <MenuItem onClick={() => handleMenuClick(course, "view")}>
                    <Tooltip title="Edit" placement="top">
                      <IconButton
                        aria-label="Edit"
                        size="small"
                        color="primary"
                        className="primary"
                      >
                        <TableViewIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                    View
                  </MenuItem>
                  <MenuItem onClick={() => handleMenuClick(course, "edit")}>
                    <Tooltip title="Edit" placement="top">
                      <IconButton
                        aria-label="Edit"
                        size="small"
                        color="primary"
                        className="primary"
                      >
                        <DriveFileRenameOutlineIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                    Edit
                  </MenuItem>
                </Menu>
              </div>
            </TableCell>
          </TableRow>
        )
      })}

      {emptyRows > 0 && (
        <TableRow style={{ height: 53 * emptyRows }}>
          <TableCell
            colSpan={5}
            style={{ borderBottom: "1px solid #F7FAFF" }}
          />
        </TableRow>
      )}
    </TableBody>
  )
}

export default SubjectsTableBody
