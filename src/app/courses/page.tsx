"use client"
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material"
import React, { useState, useEffect, useContext } from "react"
import { useQuery } from "react-query"
import { debounce } from "lodash"
import FilterListIcon from "@mui/icons-material/FilterList"
import Fuse, { FuseResult } from "fuse.js"

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined"
import { fetchCourses } from "../api/rest"
import { AppDpx } from "@/context/AppContext"
import { COURSES_SET } from "@/context/actions"
import Header from "@/components/Header"
import { tCourse, tCourseLte } from "@/types/types"
import PopularCard from "@/components/home/PopularCard"
import Footer from "@/components/Footer"

type FilterItem = {
  label: string
  value: string
}

const filter: FilterItem[] = [
  { label: "All Courses", value: "all" },
  { label: "Web Development", value: "web" },
  { label: "Mobile Development", value: "mobile" },
  { label: "Data Science", value: "data science" },
  { label: "UI/UX Design", value: "ui/ux design" },
  { label: "Digital Marketing", value: "digital marketing" },
  { label: "Business", value: "business" },
  { label: "Photography", value: "photography" },
]
// export const metadata = generateMetadata({
//   title: "Horace Learning Management Solution | Horace Courses",
//   description:
//     "Horace Online Courses. STEM focused online courses for all ages",
// });
const Courses = () => {
  const [allCourses, setAllCourses] = useState([])
  const [filteredData, setFilteredData] = useState<tCourseLte[] | []>([])
  const [currentFilter, setCurrentFilter] = useState(filter[0])

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const dispatch = useContext(AppDpx)

  const dropDown = Boolean(anchorEl)

  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const { data, isLoading } = useQuery("usersAdddoc", fetchCourses, {
    staleTime: 5000,
    cacheTime: 10,
  })

  const handleSearch = debounce(async (query: string) => {
    // Ensure that 'data' is an array of tCourse.
    const fuse = new Fuse<tCourse>(data, {
      keys: ["category", "courseName"],
      includeScore: false,
      includeMatches: true,
      minMatchCharLength: 3,
    })

    const searchResults: FuseResult<tCourseLte>[] = fuse.search(query)
    const result: tCourseLte[] = searchResults.map((item) => item.item)

    if (result.length < 1) {
      setFilteredData(allCourses)
      return
    }
    setFilteredData(result)
  }, 700)

  useEffect(() => {
    if (data?.length > 0) {
      setFilteredData(data)
      setAllCourses(data)
      dispatch({ type: COURSES_SET, data })
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <Box>
      <Header />
      <Container>
        <Box sx={courseStyles.searchContainer}>
          <Box sx={courseStyles.searchBox}>
            <SearchOutlinedIcon />
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
              <FilterListIcon />
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
              {filter.map((item: FilterItem, index: number) => {
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
        <Box>
          <Typography variant="h3" sx={courseStyles.title}>
            {currentFilter.label} ({filteredData?.length})
          </Typography>
          {isLoading && <CircularProgress />}
          <Grid container spacing={5}>
            {filteredData?.map((course: tCourseLte, index: number) => {
              return (
                <Grid key={index} item xs={12} sm={6} md={4}>
                  <PopularCard data={course} />
                </Grid>
              )
            })}
          </Grid>
        </Box>
      </Container>
      <Footer />
    </Box>
  )
}

export default Courses

const courseStyles = {
  title: { fontWeight: "bold", my: 4 },
  searchContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mt: 4,
  },
  searchBox: {
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    outline: "none",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff !important",
    p: "10px",
    my: 2,
    flex: 1,
    mr: 2,
    maxWidth: "600px",

    "&:hover": {
      border: "2px solid #e0e0e0",
    },

    "&:focus-within": {
      border: "2px solid #e0e0e0",
    },
  },
  searchInput: {
    outline: "none",
    border: "none",
    width: "100%",
    padding: 3,
    marginLeft: 2,
    color: "#000",
    backgroundColor: "#fff !important",
  },
  filterButton: {
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    outline: "none",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff !important",
    p: "10px 20px",
    my: 4,
  },
  filterText: {
    display: { xs: "none", md: "block" },
    fontWeight: "bold",
    mr: 2,
  },
}
