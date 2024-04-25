import React, { ReactElement, useContext } from "react"

import Box from "@mui/material/Box"
import { styled } from "@mui/material/styles"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Paper from "@mui/material/Paper"
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown"
import Home from "@mui/icons-material/Home"
import PlayCircleIcon from "@mui/icons-material/PlayCircle"
import QuizIcon from "@mui/icons-material/Quiz"
import NoteIcon from "@mui/icons-material/Note"
import DataObjectIcon from "@mui/icons-material/DataObject"
import SlideshowIcon from "@mui/icons-material/Slideshow"
import { SET_PLAY_ID } from "../../context/actions"
import { tCurriculum, tLecture } from "../../types/types"
import { AppDpx } from "../../context/AppContext"

const data = [
  { icon: <PlayCircleIcon />, label: "lecture" },
  { icon: <QuizIcon />, label: "quiz" },
  { icon: <NoteIcon />, label: "note" },
  { icon: <SlideshowIcon />, label: "download" },
  { icon: <DataObjectIcon />, label: "handson" },
]

const FireNav = styled(List)<{ component?: React.ElementType }>({
  "& .MuiListItemButton-root": {
    paddingLeft: 24,
    paddingRight: 24,
  },
  "& .MuiListItemIcon-root": {
    minWidth: 0,
    marginRight: 16,
  },
  "& .MuiSvgIcon-root": {
    fontSize: 20,
  },
})
interface Props {
  curriculum?: tCurriculum
  courseName?: string
  isShort?: boolean
}
const Curriculumb: React.FC<Props> = (props: Props): ReactElement => {
  const { curriculum, courseName, isShort } = props
  const [selected, setSel] = React.useState<number>(0)
  const dispatch = useContext(AppDpx)
  const doSel = (id: number) => {
    setSel((v) => (v === id ? -1 : id))
  }
  const _next = (id: tLecture) => {
    dispatch({ type: SET_PLAY_ID, data: id })
  }
  return (
    <Box className="flex w-full">
      <Paper elevation={0} className={`w-full mr-1 px-2 bg-transparent`}>
        <FireNav disablePadding>
          <ListItem component="div" disablePadding>
            <ListItemButton className="h-18 mb-2">
              <ListItemIcon>
                <Home sx={{ color: "black" }} />
              </ListItemIcon>
              <ListItemText
                primary={courseName || ""}
                primaryTypographyProps={{
                  color: "black",
                  fontWeight: "medium",
                  variant: "body2",
                }}
              />
            </ListItemButton>
          </ListItem>
          {curriculum?.section.map((item, index) => (
            <Box
              key={item.title + index}
              sx={{
                bgcolor: selected === index ? "rgba(108, 122, 137, 1)" : null,
                pb: selected === index ? 2 : 0,
                mb: isShort && selected === index ? 2 : 0,
                borderRadius: isShort ? 2.5 : 0,
              }}
            >
              <ListItemButton
                alignItems="flex-start"
                onClick={() => doSel(index)}
                sx={{
                  width: "100%",
                  bgcolor: isShort && selected !== index ? "#fff" : "inherit",
                  color: isShort && selected === index ? "#fff" : "inherit",
                  mb: isShort ? 1 : 0,
                  px: 3,
                  pt: isShort ? 1 : 2.5,
                  borderRadius: isShort ? 2.5 : 0,
                  pb: isShort ? 1 : selected === index ? 0 : 2.5,
                  "&:hover, &:focus": {
                    "& svg": { opacity: selected === index ? 1 : 1 },
                  },
                }}
              >
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontSize: 15,
                    fontWeight: "medium",
                    lineHeight: "20px",
                    mb: "2px",
                  }}
                  secondary={item.description}
                  secondaryTypographyProps={{
                    display: isShort ? "none" : "block",
                    noWrap: true,
                    fontSize: 12,
                    lineHeight: "16px",
                    color:
                      selected === index
                        ? "rgba(0,0,0,0)"
                        : "rgba(255,255,255,0.5)",
                  }}
                  sx={{ my: 0 }}
                />

                <KeyboardArrowDown
                  sx={{
                    mr: -1,
                    opacity: 1,
                    transform:
                      selected === index ? "rotate(-180deg)" : "rotate(0)",
                    transition: "0.2s",
                  }}
                />
              </ListItemButton>
              {selected === index &&
                item?.lecture?.map((item) => (
                  <ListItemButton
                    key={item.title}
                    sx={{
                      py: 0,
                      minHeight: 32,
                      color: "rgba(255,255,255,.8)",
                    }}
                  >
                    <ListItemIcon sx={{ color: "inherit" }}>
                      {data.find((i) => i.label === item.type)?.icon}
                    </ListItemIcon>
                    <ListItemText
                      className="capitalize font-medium "
                      primary={item.title}
                      onClick={() => _next(item)}
                    />
                  </ListItemButton>
                ))}
            </Box>
          ))}
        </FireNav>
      </Paper>
    </Box>
  )
}

export default Curriculumb
