"use client"
import { Send } from "@mui/icons-material"
import {
  Avatar,
  Box,
  CardActionArea,
  CardContent,
  IconButton,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material"
import { useState } from "react"

interface MessageBubbleProps {
  isInstructor?: boolean
}

const MessageBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isInstructor",
})<MessageBubbleProps>(({ theme, isInstructor }) => ({
  backgroundColor: isInstructor
    ? theme.palette.primary.light
    : theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1.5),
  maxWidth: "80%",
}))
const ChatComponent = () => {
  const [message, setMessage] = useState("")
  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value)
  }
  return (
    <CardActionArea>
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
          Chat
        </Typography>

        <Stack spacing={2} sx={{ mb: 3 }}>
          {/* Instructor Messages */}
          <Box sx={{ display: "flex" }}>
            <Avatar
              src="/api/placeholder/40/40"
              alt="Instructor"
              sx={{ width: 32, height: 32, mr: 1 }}
            />
            <MessageBubble isInstructor>
              <Typography variant="caption" fontWeight="bold" sx={{ mb: 0.5 }}>
                James Smith • Instructor
              </Typography>
              <Typography variant="body2">
                Welcome to the course! If you have any questions, please feel
                free to ask here in the chat.
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", textAlign: "right", mt: 0.5 }}
              >
                10:45 AM
              </Typography>
            </MessageBubble>
          </Box>

          {/* Student Message */}
          <Box sx={{ display: "flex" }}>
            <Avatar
              src="/api/placeholder/40/40"
              alt="Student"
              sx={{ width: 32, height: 32, mr: 1 }}
            />
            <MessageBubble>
              <Typography variant="caption" fontWeight="bold" sx={{ mb: 0.5 }}>
                Mark Johnson
              </Typography>
              <Typography variant="body2">
                When is the best time to use Kotlin vs Java? I am coming from a
                Java background and wondering if it&apos;s worth switching
                completely.
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", textAlign: "right", mt: 0.5 }}
              >
                11:30 AM
              </Typography>
            </MessageBubble>
          </Box>

          {/* Instructor Reply */}
          <Box sx={{ display: "flex" }}>
            <Avatar
              src="/api/placeholder/40/40"
              alt="Instructor"
              sx={{ width: 32, height: 32, mr: 1 }}
            />
            <MessageBubble isInstructor>
              <Typography variant="caption" fontWeight="bold" sx={{ mb: 0.5 }}>
                James Smith • Instructor
              </Typography>
              <Typography variant="body2">
                Great question! Kotlin is fully interoperable with Java, so you
                can gradually migrate your projects. We will cover more
                advantages in section 3.
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", textAlign: "right", mt: 0.5 }}
              >
                11:45 AM
              </Typography>
            </MessageBubble>
          </Box>
        </Stack>

        {/* Message Input */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Write a message..."
            variant="outlined"
            value={message}
            onChange={handleMessageChange}
            sx={{ mr: 1 }}
          />
          <IconButton
            color="primary"
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            <Send fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>
    </CardActionArea>
  )
}
export default ChatComponent
