import { coursefilter, FilterItem } from "@/app/courses/page"
import { courseStyles } from "@/styles/courseStyles"
import { tCourse } from "@/types/types"
import { FilterList, SearchOutlined } from "@mui/icons-material"
import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material"
import React from "react"
interface Props {
  handleSearch: (_value: string) => void
  setCurrentFilter: (_item: FilterItem) => void
  setFilteredData: (_data: tCourse[]) => void
  allCourses: tCourse[]
}
const CoursesSearch: React.FC<Props> = ({
  handleSearch,
  setCurrentFilter,
  setFilteredData,
  allCourses,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const dropDown = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box sx={courseStyles.searchContainer}>
      <Box sx={courseStyles.searchBox}>
        <SearchOutlined />
        <input
          name="search"
          onChange={(e) => {
            handleSearch(e.target.value)
          }}
          placeholder="Search for courses"
          style={courseStyles.searchInput}
        />
      </Box>
      <Box>
        <IconButton
          id="native-button"
          aria-controls={dropDown ? "native-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={dropDown ? "true" : undefined}
          onClick={handleClick}
          sx={courseStyles.filterButton}
        >
          <Typography variant="h6" sx={courseStyles.filterText}>
            Filters
          </Typography>
          <FilterList />
        </IconButton>
        <Menu
          id="native-menu"
          MenuListProps={{
            "aria-labelledby": "native-button",
          }}
          anchorEl={anchorEl}
          elevation={0}
          open={dropDown}
          onClose={handleClose}
        >
          {coursefilter.map((item: FilterItem, index: number) => {
            return (
              <MenuItem
                key={index}
                onClick={() => {
                  setCurrentFilter(item)
                  if (item.value === "all") {
                    setFilteredData(allCourses)
                    handleClose()
                    return
                  }
                  setFilteredData(
                    allCourses.filter(
                      (course: tCourse) =>
                        course?.category
                          ?.split(",")
                          .includes(item.value.toLowerCase()) ||
                        course?.courseName
                          ?.toLowerCase()
                          .includes(item.value.toLowerCase())
                    )
                  )
                  handleClose()
                }}
              >
                {item.label}
              </MenuItem>
            )
          })}
        </Menu>
      </Box>
    </Box>
  )
}
export default CoursesSearch
