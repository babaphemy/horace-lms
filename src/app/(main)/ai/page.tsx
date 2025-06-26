"use client"
import { notifyError } from "@/utils/notification"
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh"
import BrushIcon from "@mui/icons-material/Brush"
import CodeIcon from "@mui/icons-material/Code"
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"
import LightbulbIcon from "@mui/icons-material/Lightbulb"
import SendIcon from "@mui/icons-material/Send"
import { redirect } from "next/navigation"
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"
import { useSession } from "next-auth/react"
import Head from "next/head"
import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
interface tMessage {
  role: string
  content: string
}
interface OllamaModel {
  name: string
  modified_at: string
  size: number
  digest: string
  details: {
    format: string
    family: string
    families: string[]
    parameter_size: string
    quantization_level: string
  }
}
const promptTemplates = [
  {
    id: "general",
    name: "General Question",
    icon: <LightbulbIcon />,
    template: "I have a question about:",
    description: "Ask any general question",
  },
  {
    id: "code",
    name: "Code Generation",
    icon: <CodeIcon />,
    template: "Write code that:",
    description: "Generate code for a specific task",
  },
  {
    id: "creative",
    name: "Creative Writing",
    icon: <BrushIcon />,
    template: "Write a creative story about:",
    description: "Generate creative content",
  },
  {
    id: "document",
    name: "Document Analysis",
    icon: <InsertDriveFileIcon />,
    template: "Analyze this document:",
    description: "Analyze or summarize text",
  },
]
const getSystemPrompt = (templateId: string) => {
  switch (templateId) {
    case "code":
      return "You are an expert programmer. Provide clean, efficient, and well-commented code. Include explanations of your implementation choices."
    case "creative":
      return "Generate a complete online learning course on [topic] that targets [audience] in [country]  with [x] modules and [y] lesson per module which. Create one assessment quiz for every 3 topics created."
    case "document":
      return "You are an analytical expert. Provide clear, structured analysis of documents. Identify key themes, summarize main points, and highlight important details."
    case "general":
    default:
      return "You are a helpful, harmless, and honest AI assistant. Provide accurate, informative responses to the user's questions."
  }
}

export default function Home() {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<tMessage[]>([])
  const [streamedResponse, setStreamedResponse] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const theme = useTheme()
  const { status } = useSession()

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login?redirect=/ai")
    }
  }, [status])

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamedResponse])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(() => {
    checkOllamaConnection()
  }, [])

  const checkOllamaConnection = async () => {
    try {
      const response = await fetch("http://localhost:11434/api/tags", {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error(`Ollama server returned ${response.status}`)
      }

      const data = await response.json()

      const phi3Model = data.models.find(
        (model: OllamaModel) => model.name === "phi3:latest"
      )
      if (!phi3Model) {
        notifyError(
          "Phi3 model not found in Ollama. Please run: ollama pull phi3:latest"
        )
      }
    } catch {
      notifyError("Could not connect to Ollama server. Make sure it's running.")
    }
  }

  const applyTemplate = (templateId: string) => {
    const template = promptTemplates.find((t) => t.id === templateId)
    if (template) {
      setInput(template.template + " ")
      setSelectedTemplate(templateId)
    }
  }

  const streamResponse = async (userPrompt: string) => {
    setIsLoading(true)
    setStreamedResponse("")

    setMessages((prev) => [...prev, { role: "user", content: userPrompt }])

    try {
      // const context =
      //   messages.length > 0
      //     ? messages.map((msg) => ({ role: msg.role, content: msg.content }))
      //     : []

      // Prepare the prompt with template context if available
      let promptText = userPrompt
      if (selectedTemplate) {
        const template = promptTemplates.find((t) => t.id === selectedTemplate)
        if (template) {
          promptText = `[${template.name}] ${userPrompt}`
        }
      }

      // Connect to Ollama API (running locally)
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "phi3:latest",
          prompt: promptText,
          stream: true,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            // Include context from previous messages if needed
            // context: context.length ? context : undefined,
          },
          system: getSystemPrompt(selectedTemplate), // Get appropriate system prompt based on template
        }),
      })

      if (!response.ok) {
        throw new Error(
          `Error connecting to Ollama: ${response.status} ${response.statusText}`
        )
      }

      if (!response.body) {
        throw new Error("No response body from Ollama server.")
      }
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let responseText = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split("\n").filter((line) => line.trim())
        for (const line of lines) {
          try {
            const data = JSON.parse(line)
            if (data.response) {
              responseText += data.response
              setStreamedResponse(responseText)
            }
          } catch {
            notifyError("Error parsing JSON:")
          }
        }
      }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: responseText },
      ])
    } catch {
      notifyError("Error streaming response:")
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: Could not connect to Ollama server. Please make sure Ollama is running locally with the Mistral model.`,
        },
      ])
    } finally {
      setStreamedResponse("")
      setIsLoading(false)
      setInput("")
      setSelectedTemplate("")
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim() === "") return

    streamResponse(input)
  }

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>AI Assistant | Streaming Responses</title>
        <meta
          name="description"
          content="AI assistant with streaming responses"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        /> */}
        {/* <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        /> */}
      </Head>

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
          padding: 2,
        }}
      >
        <Container
          maxWidth="lg"
          sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
        >
          <Box sx={{ mb: 4, mt: 2 }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              fontWeight="600"
              color="primary"
            >
              AI Assistant
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Ask questions, generate code, or create content with AI-powered
              responses
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Prompt Templates
              </Typography>
            </Grid>
            {promptTemplates.map((template) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={template.id}>
                <Card
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                    },
                    border:
                      selectedTemplate === template.id
                        ? `2px solid ${theme.palette.primary.main}`
                        : "none",
                  }}
                  onClick={() => applyTemplate(template.id)}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Box sx={{ color: "primary.main", mr: 1 }}>
                        {template.icon}
                      </Box>
                      <Typography variant="h6">{template.name}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {template.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Paper
            elevation={0}
            sx={{
              flexGrow: 1,
              mb: 2,
              p: 3,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              maxHeight: "60vh",
              overflow: "hidden",
            }}
          >
            <Box sx={{ flexGrow: 1, overflow: "auto", mb: 2 }}>
              {messages.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    opacity: 0.7,
                  }}
                >
                  <AutoFixHighIcon
                    sx={{ fontSize: 60, color: "primary.light", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary">
                    Select a template or start typing to begin
                  </Typography>
                </Box>
              ) : (
                <>
                  {messages.map((msg, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: "bold",
                          color:
                            msg.role === "user"
                              ? "secondary.main"
                              : "primary.main",
                          display: "block",
                          mb: 0.5,
                        }}
                      >
                        {msg.role === "user" ? "You" : "AI Assistant"}
                      </Typography>
                      <Paper
                        sx={{
                          p: 2,
                          bgcolor:
                            msg.role === "user"
                              ? "rgba(245, 0, 87, 0.05)"
                              : "rgba(63, 81, 181, 0.05)",
                          borderRadius: 2,
                        }}
                      >
                        <Box
                          sx={{
                            "& p": { mt: 0, mb: 1 },
                            "& pre": {
                              bgcolor: "rgba(0, 0, 0, 0.04)",
                              p: 1.5,
                              borderRadius: 1,
                              overflowX: "auto",
                            },
                            "& code": {
                              bgcolor: "rgba(0, 0, 0, 0.04)",
                              p: 0.5,
                              borderRadius: 0.5,
                            },
                          }}
                        >
                          {msg.role === "assistant" ? (
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          ) : (
                            <Typography>{msg.content}</Typography>
                          )}
                        </Box>
                      </Paper>
                    </Box>
                  ))}

                  {streamedResponse && (
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: "bold",
                          color: "primary.main",
                          display: "block",
                          mb: 0.5,
                        }}
                      >
                        AI Assistant
                      </Typography>
                      <Paper
                        sx={{
                          p: 2,
                          bgcolor: "rgba(63, 81, 181, 0.05)",
                          borderRadius: 2,
                          position: "relative",
                        }}
                      >
                        <Box
                          sx={{
                            "& p": { mt: 0, mb: 1 },
                            "& pre": {
                              bgcolor: "rgba(0, 0, 0, 0.04)",
                              p: 1.5,
                              borderRadius: 1,
                              overflowX: "auto",
                            },
                            "& code": {
                              bgcolor: "rgba(0, 0, 0, 0.04)",
                              p: 0.5,
                              borderRadius: 0.5,
                            },
                          }}
                        >
                          <ReactMarkdown>{streamedResponse}</ReactMarkdown>
                        </Box>
                        <Box
                          sx={{
                            position: "absolute",
                            right: 10,
                            bottom: 10,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 24,
                            height: 24,
                          }}
                        >
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              bgcolor: "primary.main",
                              animation: "pulse 1s infinite",
                              "@keyframes pulse": {
                                "0%": {
                                  transform: "scale(0.8)",
                                  opacity: 0.8,
                                },
                                "50%": {
                                  transform: "scale(1)",
                                  opacity: 1,
                                },
                                "100%": {
                                  transform: "scale(0.8)",
                                  opacity: 0.8,
                                },
                              },
                            }}
                          />
                        </Box>
                      </Paper>
                    </Box>
                  )}

                  <div ref={messagesEndRef} />
                </>
              )}
            </Box>
          </Paper>

          <Paper
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              borderRadius: 3,
            }}
          >
            <TextField
              fullWidth
              placeholder="Type your message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              variant="outlined"
              multiline
              maxRows={4}
              disabled={isLoading}
              InputProps={{
                sx: {
                  borderRadius: 3,
                  pr: 1,
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading || input.trim() === ""}
              sx={{
                ml: 1,
                minWidth: 120,
                height: 54,
                borderRadius: 3,
              }}
              endIcon={
                isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SendIcon />
                )
              }
            >
              {isLoading ? "Thinking..." : "Send"}
            </Button>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  )
}
