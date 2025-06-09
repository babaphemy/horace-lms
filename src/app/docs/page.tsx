"use client"
import React, { useState } from "react"
import Header from "@/components/Header"
import FooterLte from "@/components/layout/FooterLte"
import {
  Box,
  Container,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Drawer,
  useTheme,
  useMediaQuery,
  IconButton,
  AppBar,
  Toolbar,
  Button,
  Alert,
  Stack,
  TextField,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  ListItemButton,
} from "@mui/material"
import {
  ExpandMore as ExpandMoreIcon,
  Menu as MenuIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  PhotoCamera as PhotoIcon,
  Book as BookIcon,
  Business as BusinessIcon,
  Code as CodeIcon,
  Api as ApiIcon,
  Security as SecurityIcon,
  Description as DescriptionIcon,
  PlayArrow as PlayIcon,
  ContentCopy as CopyIcon,
  Send as SendIcon,
} from "@mui/icons-material"
type Payload = string | Record<string, unknown> | undefined
interface EndpointCardProps {
  method: string
  endpoint: string
  description: string
  payload?: Payload
  response?: string
  note?: string
  isSwagger?: boolean
}
const DocsPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [testDialogOpen, setTestDialogOpen] = useState(false)
  type EndpointState = {
    endpoint: string
    method: string
    payload: Payload
  } | null

  const [currentEndpoint, setCurrentEndpoint] = useState<EndpointState>(null)
  const [testData, setTestData] = useState("")
  const [testResult, setTestResult] = useState("")
  const [loading, setLoading] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const [baseUrl, setBaseUrl] = useState("")
  const [authToken, setAuthToken] = useState("")

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const sections = [
    { id: "overview", title: "Overview", icon: <DescriptionIcon /> },
    {
      id: "organization",
      title: "Organization Signup",
      icon: <BusinessIcon />,
    },
    { id: "user", title: "User Signup", icon: <PersonIcon /> },
    { id: "upload", title: "Upload Photo", icon: <PhotoIcon /> },
    { id: "courses", title: "Course Management", icon: <BookIcon /> },
    { id: "enrollment", title: "Enrollment & Retrieval", icon: <SchoolIcon /> },
  ]

  const codeLanguages = [
    { label: "JavaScript", value: "javascript" },
    { label: "Python", value: "python" },
    { label: "PHP", value: "php" },
    { label: "C#", value: "csharp" },
    { label: "Java", value: "java" },
  ]

  const generateSampleCode = (
    endpoint: string,
    method: string,
    payload: Payload,
    language: string
  ) => {
    const url = `${baseUrl || "{basepath}"}${endpoint}`
    const hasAuth = authToken
      ? `Authorization: Bearer ${authToken}`
      : "Authorization: Bearer YOUR_TOKEN"

    switch (language) {
      case "javascript":
        return `// JavaScript (Fetch API)
const response = await fetch('${url}', {
  method: '${method}',
  headers: {
    'Content-Type': 'application/json',
    '${hasAuth}'
  }${
    payload
      ? `,
  body: JSON.stringify(${payload})`
      : ""
  }
});

const data = await response.json();
console.log(data);`

      case "python":
        return `# Python (requests)
import requests
import json

url = "${url}"
headers = {
    "Content-Type": "application/json",
    "${hasAuth}"
}
${
  payload
    ? `
payload = ${payload}

response = requests.${method.toLowerCase()}(url, headers=headers, json=payload)`
    : `
response = requests.${method.toLowerCase()}(url, headers=headers)`
}
print(response.json())`

      case "php":
        return `<?php
// PHP (cURL)
$url = "${url}";
$headers = [
    "Content-Type: application/json",
    "${hasAuth}"
];
${
  payload
    ? `
$payload = '${payload}';`
    : ""
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
${method !== "GET" ? `curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${method}");` : ""}
${payload ? `curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);` : ""}

$response = curl_exec($ch);
curl_close($ch);
echo $response;
?>`

      case "csharp":
        return `// C# (HttpClient)
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

var client = new HttpClient();
client.DefaultRequestHeaders.Add("Authorization", "${authToken ? `Bearer ${authToken}` : "Bearer YOUR_TOKEN"}");

${
  payload
    ? `var json = @"${payload}";
var content = new StringContent(json, Encoding.UTF8, "application/json");

var response = await client.${method === "GET" ? "GetAsync" : method === "POST" ? "PostAsync" : method === "PUT" ? "PutAsync" : "DeleteAsync"}("${url}"${method !== "GET" && method !== "DELETE" ? ", content" : ""});`
    : `
var response = await client.${method === "GET" ? "GetAsync" : "DeleteAsync"}("${url}");`
}

var responseString = await response.Content.ReadAsStringAsync();
Console.WriteLine(responseString);`

      case "java":
        return `// Java (OkHttp)
import okhttp3.*;
import java.io.IOException;

OkHttpClient client = new OkHttpClient();
${
  payload
    ? `
MediaType JSON = MediaType.get("application/json; charset=utf-8");
RequestBody body = RequestBody.create(JSON, "${typeof payload === "string" ? payload.replace(/"/g, '\\"') : ""}");`
    : ""
}

Request request = new Request.Builder()
    .url("${url}")
    .addHeader("Authorization", "${authToken ? `Bearer ${authToken}` : "Bearer YOUR_TOKEN"}")
    .addHeader("Content-Type", "application/json")
    ${method !== "GET" ? `.${method.toLowerCase()}(${payload ? "body" : "RequestBody.create(new byte[0])"})` : ""}
    .build();

try (Response response = client.newCall(request).execute()) {
    System.out.println(response.body().string());
}`

      default:
        return ""
    }
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    if (isMobile) {
      setDrawerOpen(false)
    }
  }

  const handleTestEndpoint = (
    endpoint: string,
    method: string,
    payload: Payload
  ) => {
    setCurrentEndpoint({ endpoint, method, payload })
    setTestData(
      typeof payload === "string"
        ? payload
        : payload
          ? JSON.stringify(payload, null, 2)
          : ""
    )
    setTestDialogOpen(true)
  }

  const executeTest = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setTestResult(
        JSON.stringify(
          {
            status: 200,
            message: "Success",
            data: { id: "12345", message: "Operation completed successfully" },
          },
          null,
          2
        )
      )
    } catch (error) {
      setTestResult(
        JSON.stringify(
          {
            status: 500,
            message: "Error",
            error: error instanceof Error ? error.message : String(error),
          },
          null,
          2
        )
      )
    }
    setLoading(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setSnackbarOpen(true)
  }

  const EndpointCard: React.FC<EndpointCardProps> = ({
    method,
    endpoint,
    description,
    payload,
    response,
    note,
    isSwagger,
  }) => {
    const [codeTab, setCodeTab] = useState(0)

    return (
      <Card sx={{ mb: 2, border: "1px solid", borderColor: "divider" }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Chip
              label={method}
              color={
                method === "POST"
                  ? "primary"
                  : method === "GET"
                    ? "success"
                    : method === "PUT"
                      ? "warning"
                      : "error"
              }
              size="small"
            />
            <Typography
              variant="body1"
              component="code"
              sx={{
                backgroundColor: "grey.100",
                padding: "4px 8px",
                borderRadius: 1,
                fontFamily: "monospace",
                fontSize: "0.875rem",
                flexGrow: 1,
              }}
            >
              {endpoint}
            </Typography>
            {isSwagger && (
              <Chip
                label="Swagger Docs"
                color="info"
                size="small"
                icon={<ApiIcon />}
              />
            )}
            <Button
              size="small"
              variant="outlined"
              startIcon={<PlayIcon />}
              onClick={() => handleTestEndpoint(endpoint, method, payload)}
              sx={{ ml: 1 }}
            >
              Test
            </Button>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {description}
          </Typography>

          {/* Code Examples */}
          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                variant="subtitle2"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <CodeIcon sx={{ mr: 1 }} />
                Code Examples
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ width: "100%" }}>
                <Tabs
                  value={codeTab}
                  onChange={(e, newValue) => setCodeTab(newValue)}
                  variant="scrollable"
                >
                  {codeLanguages.map((lang) => (
                    <Tab key={lang.value} label={lang.label} />
                  ))}
                </Tabs>
                {codeLanguages.map((lang, index) => (
                  <Box
                    key={lang.value}
                    hidden={codeTab !== index}
                    sx={{ mt: 2 }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <IconButton
                        size="small"
                        onClick={() =>
                          copyToClipboard(
                            generateSampleCode(
                              endpoint,
                              method,
                              payload,
                              lang.value
                            )
                          )
                        }
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          zIndex: 1,
                        }}
                      >
                        <CopyIcon />
                      </IconButton>
                      <Paper
                        sx={{
                          p: 2,
                          backgroundColor: "grey.900",
                          color: "white",
                          overflow: "auto",
                        }}
                      >
                        <Typography
                          component="pre"
                          variant="body2"
                          sx={{
                            fontFamily: "monospace",
                            fontSize: "0.8rem",
                            margin: 0,
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {generateSampleCode(
                            endpoint,
                            method,
                            payload,
                            lang.value
                          )}
                        </Typography>
                      </Paper>
                    </Box>
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>

          {payload && (
            <Box sx={{ mb: 2, mt: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: "bold" }}
              >
                Payload:
              </Typography>
              <Paper sx={{ p: 2, backgroundColor: "grey.50" }}>
                <Typography
                  component="pre"
                  variant="body2"
                  sx={{
                    fontFamily: "monospace",
                    overflow: "auto",
                    margin: 0,
                  }}
                >
                  {typeof payload === "string"
                    ? payload
                    : JSON.stringify(payload, null, 2)}
                </Typography>
              </Paper>
            </Box>
          )}

          {response && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: "bold" }}
              >
                Response:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  backgroundColor: "success.light",
                  color: "success.contrastText",
                  padding: "4px 8px",
                  borderRadius: 1,
                  display: "inline-block",
                }}
              >
                {response}
              </Typography>
            </Box>
          )}

          {note && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Note:</strong> {note}
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>
    )
  }

  const SidebarContent = () => (
    <Box sx={{ width: 280, pt: 2 }}>
      <Typography variant="h6" sx={{ px: 2, mb: 2, fontWeight: "bold" }}>
        API Documentation
      </Typography>

      {/* Configuration */}
      <Box sx={{ px: 2, mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
          Configuration
        </Typography>
        <TextField
          fullWidth
          size="small"
          label="Base URL"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          placeholder={process.env.NEXT_PUBLIC_API_BASEPATH}
          sx={{ mb: 1 }}
        />
        <TextField
          fullWidth
          size="small"
          label="Username"
          value={authToken}
          onChange={(e) => setAuthToken(e.target.value)}
          placeholder="e.g devops@horacelearning.us"
          type="password"
        />
        <TextField
          fullWidth
          size="small"
          label="Password"
          value={""}
          onChange={() => {}}
          placeholder="API Key or Password"
          type="password"
          sx={{ mt: 1 }}
        />
      </Box>

      <Divider sx={{ mx: 2, mb: 2 }} />

      <List>
        {sections.map((section) => (
          <ListItem key={section.id} disablePadding>
            <ListItemButton onClick={() => scrollToSection(section.id)}>
              <ListItemIcon>{section.icon}</ListItemIcon>
              <ListItemText primary={section.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box>
      <Header />

      {/* Mobile Navigation */}
      {isMobile && (
        <AppBar position="sticky" color="default" elevation={1}>
          <Toolbar>
            <IconButton
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              LMS API Documentation
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      <Box sx={{ display: "flex" }}>
        {/* Sidebar */}
        {!isMobile ? (
          <Box
            sx={{
              width: 280,
              flexShrink: 0,
              position: "sticky",
              top: 0,
              height: "100vh",
              overflow: "auto",
              borderRight: "1px solid",
              borderColor: "divider",
              backgroundColor: "background.paper",
            }}
          >
            <SidebarContent />
          </Box>
        ) : (
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          >
            <SidebarContent />
          </Drawer>
        )}

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, minHeight: "100vh" }}>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header Section */}
            <Box id="overview" sx={{ mb: 6 }}>
              <Typography
                variant="h2"
                component="h1"
                sx={{ mb: 2, fontWeight: "bold" }}
              >
                LMS API Documentation
              </Typography>

              <Paper
                sx={{
                  p: 3,
                  mb: 4,
                  backgroundColor: "primary.light",
                  color: "primary.contrastText",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ mb: 2, display: "flex", alignItems: "center" }}
                >
                  <CodeIcon sx={{ mr: 1 }} />
                  Base URL
                </Typography>
                <Typography
                  variant="body1"
                  component="code"
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    padding: "8px 12px",
                    borderRadius: 1,
                    fontFamily: "monospace",
                    fontSize: "1rem",
                  }}
                >
                  {process.env.NEXT_PUBLIC_API_BASEPATH}
                </Typography>
              </Paper>

              <Typography
                variant="body1"
                sx={{ mb: 3, fontSize: "1.1rem", lineHeight: 1.6 }}
              >
                Welcome to the LMS (Learning Management System) API
                documentation. This API provides comprehensive functionality for
                managing educational content, user accounts, and course
                delivery. Use the sidebar to configure your base URL and
                authentication token, then test endpoints directly from this
                page.
              </Typography>
            </Box>

            {/* Organization Signup Section */}
            <Box id="organization" sx={{ mb: 6 }}>
              <Typography
                variant="h4"
                sx={{
                  mb: 3,
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <BusinessIcon sx={{ mr: 2, color: "primary.main" }} />
                Organization Signup
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                An organization is a school or business entity which can
                register multiple instructors/authors and students. Note that
                logo is the string returned from photo upload request from the
                generic photo upload endpoint, the field is optional. Created by
                is expecting the email address of a registered user, the field
                is required.
              </Typography>
              <EndpointCard
                method="POST"
                endpoint="/org/add"
                description="Register a new organization in the system"
                payload={`{
  "name": "Horace University",
  "description": "A prestigious university offering various tech courses",
  "logo": "https://essluploads2.s3.amazonaws.com/logo/horace-logo.png",
  "website": "https://lms.horacelearning.com",
  "address": "123 University St, City, Country",
    "phone": "+1234567890",
    "email": "info@horacelearning.com",
  "createdBy": "devops.essl@gmail.com"
}`}
              />
            </Box>

            {/* User Signup Section */}
            <Box id="user" sx={{ mb: 6 }}>
              <Typography
                variant="h4"
                sx={{
                  mb: 3,
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <PersonIcon sx={{ mr: 2, color: "primary.main" }} />
                User Signup
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Allow new users to sign up as either students or instructors.
                Note that password can always be changed by the user later. The
                dp field is the string returned from photo upload request from
                the generic photo upload endpoint, the field is optional. Type
                is either STUDENT or INSTRUCTOR.
              </Typography>
              <EndpointCard
                method="POST"
                endpoint="/user/add"
                description="Register a new user as a student or instructor"
                payload={`{
{
  "firstname": "ada",
  "lastname": "lovelace",
  "password": "Password1$",
  "organization": "ESSL",
  "bio": "I am the rose that grew from concrete.",
  "email": "ada@lovelace.com",
  "type": "STUDENT",
  "dp": "https://essluploads2.s3.amazonaws.com/1_1742073217410.png"
}
}`}
              />
            </Box>

            {/* Upload Photo Section */}
            <Box id="upload" sx={{ mb: 6 }}>
              <Typography
                variant="h4"
                sx={{
                  mb: 3,
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <PhotoIcon sx={{ mr: 2, color: "primary.main" }} />
                Upload Photo
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                A registered user can upload a profile photo to their account.
              </Typography>
              <EndpointCard
                method="POST"
                endpoint={`${process.env.NEXT_PUBLIC_HORACE}info/s3/upload`}
                description="Upload a profile photo for a registered user"
                payload={`{
  "userId": "user123",
  "filePath": "/uploads/photos/profile.jpg"
}`}
                response="UserResponse"
                note="Only registered users can upload photos."
                isSwagger={true}
              />
            </Box>

            {/* Course Management Section */}
            <Box id="courses" sx={{ mb: 6 }}>
              <Typography
                variant="h4"
                sx={{
                  mb: 3,
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <BookIcon sx={{ mr: 2, color: "primary.main" }} />
                Course Management
              </Typography>

              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Course Creation & Management
              </Typography>

              <Stack spacing={2}>
                <EndpointCard
                  method="POST"
                  endpoint="/course/add"
                  description="Create a new course. user is the ID of the author, thumbnail is the string returned from photo upload request from the generic photo upload endpoint, the field is optional. Price and tax is optional if course is free."
                  payload={`{
  "user": "string",
  "courseName": "string",
  "category": "string",
  "target": "string",
  "brief": "string",
  "overview": "string",
  "price": 0.1,
  "tax": 0.1,
  "thumbnail": "string",
  "currency": "string"
}`}
                />

                <EndpointCard
                  method="POST"
                  endpoint="/course/module"
                  description="Add module(s) to a course. cid is the course ID, included in the create course response, it is a mandatory field. OrderIndex controls the order of modules in the course. A course can have many modules."
                  payload={`{
  "module": "Introduction",
  "description": "What is React Native? why should I use it",
  "orderIndex": 1,
  "cid": "683555ca8b3fa57320178255"
}`}
                />

                <EndpointCard
                  method="POST"
                  endpoint="/course/module/lesson"
                  description="Add lesson(s) to a module. A lesson can have many modules. Type can be video, text, html, document or quiz. If type is video, then the video field should store the string value of the video URL. For every other type, the content field should be used."
                  payload={`{
  "title": "Welcome to class",
  "video": "https://essl.b-cdn.net/Features.mp4",
  "type": "video",
  "orderIndex": 1,
  "tid": "683559cd58939245fb44d05f"
}`}
                />

                <EndpointCard
                  method="POST"
                  endpoint="/course/generate-ai"
                  description="Generate course content with AI. This is only available for Standard Plus plan."
                  payload={`{
  "topic": "Python Programming",
  "level": "beginner",
  "duration": "8 weeks"
}`}
                />

                <EndpointCard
                  method="POST"
                  endpoint="/course/add"
                  description="Edit course details. This is same payload as create course, but with id included. Note that if ID is not included, a new course will be created."
                  payload={`{
  "id": "683555ca8b3fa57320178255",
  "user": "661efadb4910666fab3b4258",
  "courseName": "Mobile App Development with React Native",
  "category": "mobile",
  "target": "beginner, intermediate",
  "brief": "This is a hands-on course that introduces the concept of mobile application development using React Native.",
  "overview": "In this lesson, you will learn the following:",
  "price": 2000.1,
  "tax": 20.1,
  "currency": "USD"
}`}
                />

                <EndpointCard
                  method="POST"
                  endpoint="/course/module/"
                  description="Edit module details. Same payload as add module, but with id included. Note that if ID is not included, a new module will be created."
                />

                <EndpointCard
                  method="POST"
                  endpoint="/course/module/lesson/"
                  description="Edit lesson details. Same payload as add lesson, but with id included. Note that if ID is not included, a new lesson will be created."
                />
                <EndpointCard
                  method="DELETE"
                  endpoint="/course/module/{moduleId}"
                  description="Delete a module. This will also delete all lessons in the module. Returns true if successful, false otherwise."
                />

                <EndpointCard
                  method="DELETE"
                  endpoint="/course/module/lesson/{lessonId}"
                  description="Deletes a lesson. This will remove the lesson and all associated assets from the module. Returns true if successful, false otherwise."
                />

                <EndpointCard
                  method="DELETE"
                  endpoint="/course/{courseId}"
                  description="Delete a course"
                />
                <EndpointCard
                  method={"GET"}
                  endpoint="/course/mydrafts/{userId}"
                  description="Get all my draft courses. Draft courses are not visible to students and can be edited before publishing."
                />
                <EndpointCard
                  method={"POST"}
                  endpoint="/course/publish"
                  description="Publish or unpublish a course. Students can only enroll in published courses. This endpoint toggles the draft status of a course."
                  payload={`{
    "courseId": "683555ca8b3fa57320178255",
    "draft": false,
    "courseName": "Mobile App Development with React Native",
    "user": "661efadb4910666fab3b4258"
    }`}
                />
              </Stack>
            </Box>

            {/* Enrollment & Retrieval Section */}
            <Box id="enrollment" sx={{ mb: 6 }}>
              <Typography
                variant="h4"
                sx={{
                  mb: 3,
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <SchoolIcon sx={{ mr: 2, color: "primary.main" }} />
                Enrollment & Data Retrieval
              </Typography>

              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Student Enrollment
              </Typography>
              <EndpointCard
                method="POST"
                endpoint="/course/{courseId}/enroll"
                description="Enroll a student in a course"
                payload={`{
  "studentId": "student123"
}`}
              />

              <Typography
                variant="h6"
                sx={{ mb: 2, mt: 4, fontWeight: "bold" }}
              >
                Course Retrieval
              </Typography>
              <Stack spacing={2}>
                <EndpointCard
                  method="GET"
                  endpoint="/courses"
                  description="Get all courses"
                />

                <EndpointCard
                  method="GET"
                  endpoint="/user/{userId}/enrolled-courses"
                  description="Get courses a user is enrolled in"
                />

                <EndpointCard
                  method="GET"
                  endpoint="/user/{userId}/authored-courses"
                  description="Get courses authored by a user"
                />

                <EndpointCard
                  method="GET"
                  endpoint="/course/{courseId}/content"
                  description="Get paginated course content"
                />

                <EndpointCard
                  method="GET"
                  endpoint="/courses/free"
                  description="Get all free courses"
                />

                <EndpointCard
                  method="GET"
                  endpoint="/courses/paid"
                  description="Get all paid courses"
                />

                <EndpointCard
                  method="GET"
                  endpoint="/courses/author/{authorId}"
                  description="Get courses by a specific author"
                />

                <EndpointCard
                  method="GET"
                  endpoint="/course/{courseId}"
                  description="Get course by ID"
                />
              </Stack>

              <Typography
                variant="h6"
                sx={{ mb: 2, mt: 4, fontWeight: "bold" }}
              >
                User Management
              </Typography>
              <Stack spacing={2}>
                <EndpointCard
                  method="GET"
                  endpoint="/users/instructors"
                  description="Get all instructors"
                />

                <EndpointCard
                  method="GET"
                  endpoint="/users/students"
                  description="Get all students"
                />

                <EndpointCard
                  method="GET"
                  endpoint="/user/email/{email}"
                  description="Find user by email"
                />

                <EndpointCard
                  method="GET"
                  endpoint="/user/{userId}"
                  description="Find user by ID"
                />
              </Stack>
            </Box>

            {/* Footer Note */}
            <Paper
              sx={{
                p: 3,
                backgroundColor: "info.light",
                color: "info.contrastText",
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 2, display: "flex", alignItems: "center" }}
              >
                <SecurityIcon sx={{ mr: 1 }} />
                Authentication
              </Typography>
              <Typography variant="body2">
                Basic authentication is required for all endpoints. Use the
                email and password of a registered user to authenticate.
              </Typography>
            </Paper>
          </Container>
        </Box>
      </Box>

      {/* Test Dialog */}
      <Dialog
        open={testDialogOpen}
        onClose={() => setTestDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
          <SendIcon sx={{ mr: 1 }} />
          Test Endpoint: {currentEndpoint?.method} {currentEndpoint?.endpoint}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              URL:
            </Typography>
            <Typography
              variant="body2"
              component="code"
              sx={{
                backgroundColor: "grey.100",
                padding: "8px 12px",
                borderRadius: 1,
                fontFamily: "monospace",
              }}
            >
              {(baseUrl || "{basepath}") + (currentEndpoint?.endpoint || "")}
            </Typography>
          </Box>

          {currentEndpoint?.payload && (
            <TextField
              fullWidth
              multiline
              rows={8}
              label="Request Body (JSON)"
              value={testData}
              onChange={(e) => setTestData(e.target.value)}
              sx={{ mb: 2 }}
            />
          )}

          {testResult && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Response:
              </Typography>
              <Paper
                sx={{
                  p: 2,
                  backgroundColor: "grey.900",
                  color: "white",
                  maxHeight: 300,
                  overflow: "auto",
                }}
              >
                <Typography
                  component="pre"
                  variant="body2"
                  sx={{
                    fontFamily: "monospace",
                    margin: 0,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {testResult}
                </Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestDialogOpen(false)}>Close</Button>
          <Button
            onClick={executeTest}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
          >
            {loading ? "Testing..." : "Send Request"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for copy feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Code copied to clipboard!"
      />

      <FooterLte />
    </Box>
  )
}

export default DocsPage
