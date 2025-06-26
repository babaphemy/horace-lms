import { Event } from "@/types/types"
import { CalendarToday, Timer } from "@mui/icons-material"
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material"
import React from "react"

const EventCard = ({ upcomingEvents }: { upcomingEvents: Event[] }) => {
  return (
    <Card sx={{ mb: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <CalendarToday color="primary" />
          <Typography variant="h6" component="h2" fontWeight="bold">
            Upcoming Events
          </Typography>
        </Box>
        <List sx={{ p: 0 }}>
          {upcomingEvents?.map((event: Event, index: number) => (
            <React.Fragment key={event.id}>
              <ListItem sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: "primary.light",
                      width: 32,
                      height: 32,
                    }}
                  >
                    <Timer sx={{ fontSize: 16 }} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {event.startTime}
                      </Typography>
                      <Typography variant="body2" color="primary">
                        {event?.course ?? ""} • {event?.attendees ?? 0}
                        attendees
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < upcomingEvents.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}
export default EventCard
