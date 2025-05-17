"use client"
import { CourseResponse, TopicDto } from "@/types/types"
import { ExpandMore, PlayCircle } from "@mui/icons-material"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material"
import { useState } from "react"
import { getIcon } from "./CourseDetail"
import ReactPlayer from "react-player"

const Curriculum = ({ data }: { data: CourseResponse }) => {
  const [expandedVideoId, setExpandedVideoId] = useState<string | null>(null)
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null)
  return (
    <Box sx={{ p: 0 }}>
      {data?.curriculum?.topic?.map((module: TopicDto, idx: number) => (
        <Accordion key={`${module.id}-${idx}`} disableGutters>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box display="flex" alignItems="center">
              <PlayCircle sx={{ mr: 1 }} />
              <Typography fontWeight={500}>{module.title}</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              {module?.lessons?.map((asset) => (
                <Box key={asset.id}>
                  <ListItem
                    component="button"
                    key={asset.id}
                    onClick={() => {
                      if (asset.type === "video") {
                        setExpandedVideoId(
                          expandedVideoId === asset.id ? null : asset.id ?? null
                        )
                        asset?.video && setVideoPreviewUrl(asset?.video)
                      }
                    }}
                  >
                    <ListItemIcon>
                      {getIcon(asset.type, asset?.content)}
                    </ListItemIcon>
                    <ListItemText primary={asset.title} secondary={asset.id} />
                  </ListItem>
                  {expandedVideoId === asset.id && videoPreviewUrl && (
                    <Box sx={{ p: 2, width: "100%", ml: 4 }}>
                      <ReactPlayer
                        url={videoPreviewUrl}
                        controls
                        width="100%"
                        height="100%"
                      />
                    </Box>
                  )}
                </Box>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  )
}

export default Curriculum
