"use client"

import ReactPlayer from "react-player"
import {
  Container,
  Grid,
  Box,
  Typography,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Card,
  Breadcrumbs,
} from "@mui/material"
import {
  PlayCircle,
  DescriptionOutlined,
  OndemandVideo,
  PictureAsPdf,
  InsertDriveFile,
  Home,
  School,
} from "@mui/icons-material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import Link from "next/link"
import { useContext, useMemo, useState } from "react"
import { notifyError, notifySuccess } from "@/utils/notification"
import { useSession } from "next-auth/react"
import StarRoundedIcon from "@mui/icons-material/StarRounded"
import { useMutation, useQuery } from "react-query"
import { addUserCourse, fetchCourse, myRegisteredCourses } from "@/app/api/rest"
import ModalLogin from "../auth/ModalLogin"
import SignUpLogin from "../auth/ModalSignUp"
import PaymentModal from "../payment/PaymentModal"
import { ReviewModal } from "./CourseReview"
import { AppDpx } from "@/context/AppContext"
import { MODAL_SET } from "@/context/Action"
import { LessonDto, tCourseLte, TopicDto } from "@/types/types"

export const getIcon = (type: string, url?: string) => {
  if (type === "video") return <OndemandVideo color="primary" />
  if (type === "document") {
    const ext = url?.split(".").pop()?.toLowerCase()
    if (ext === "pdf") return <PictureAsPdf sx={{ color: "red" }} />
    return <DescriptionOutlined color="primary" />
  }
  return <InsertDriveFile />
}

const CourseDetail = ({ cid }: { cid: string }) => {
  const { data: session } = useSession()
  const user = session?.user

  const [expandedVideoId, setExpandedVideoId] = useState<string | null>(null)
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null)
  const dispatch = useContext(AppDpx)

  const { data: enrolledCourses, isLoading: isFetching } = useQuery({
    queryKey: ["enrolled-courses"],
    queryFn: () => myRegisteredCourses(session?.user?.id || ""),
    enabled: !!session?.user?.id,
  })

  const { data, isLoading } = useQuery({
    queryKey: ["courseDetail"],
    queryFn: () => fetchCourse(cid as string),
    enabled: !!cid,
  })
  const addCourseToUser = useMutation(addUserCourse, {
    onSuccess: () => {
      notifySuccess("You are now enrolled!")
      // addCourseToContext()
    },
    onError: (error) => {
      notifyError("Enrollment Failed, Please Try Again!")
      throw error
    },
  })
  const handleJoinClass = () => {
    const payload = {
      id: String(cid),
      user: String(user?.id),
    }
    if (user?.id) {
      data?.price > 0
        ? addCourseToUser.mutate({ ...payload, user: String(payload.user) })
        : dispatch({
            type: MODAL_SET,
            data: { open: true, type: "payment" },
          })
    } else {
      dispatch({ type: MODAL_SET, data: { open: true, type: "login" } })
    }
  }

  const isEnrolled = useMemo(() => {
    if (isFetching) return false
    if (!enrolledCourses) return false
    const enrolled = enrolledCourses.some(
      (course: tCourseLte) => course.id === cid
    )
    return enrolled
  }, [enrolledCourses, isFetching, cid])

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h4">Loading...</Typography>
      </Box>
    )
  }
  const firstVideo = data.curriculum?.topic
    ?.flatMap((topic: TopicDto) => topic.lessons || [])
    ?.find(
      (lesson: LessonDto) => lesson.video !== null && lesson.video !== undefined
    )

  return (
    <>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <Link
          href="/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          <Home sx={{ mr: 0.5 }} fontSize="inherit" />
          Dashboard
        </Link>
        <Link
          href="/dashboard/courses"
          style={{
            display: "flex",
            alignItems: "center",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          <Home sx={{ mr: 0.5 }} fontSize="inherit" />
          Courses
        </Link>

        <Typography
          color="text.primary"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <School sx={{ mr: 0.5 }} fontSize="inherit" />
          {cid}
        </Typography>
      </Breadcrumbs>

      <Box
        sx={{
          background: "linear-gradient(to bottom, #006eb9, #008080)",
          borderRadius: 3,

          p: 4,
          textAlign: "start",
          position: "relative",
          overflow: "visible",
          height: 300,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "start",
            color: "#fff",
            mb: 2,
          }}
        >
          <Box
            sx={{ backgroundColor: "#333", px: 1.5, py: 0.5, borderRadius: 2 }}
          >
            <Typography variant="caption">{data?.category}</Typography>
          </Box>
        </Box>
        <Typography variant="h4" fontWeight="bold">
          {data?.title}
        </Typography>
        <Typography
          sx={{
            color: "#fff",
            maxWidth: 600,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflow: "hidden",
          }}
          mt={1}
        >
          {data?.overview ?? ""}
        </Typography>
        <Typography mt={1} sx={{ color: "#fff" }}>
          NUMBER OF STUDENTS THAT ENROLLED THIS COURSE |{" "}
          {data?.students_count ?? 0} STUDENTS
        </Typography>
        <Typography sx={{ color: "#fff" }} mt={1}>
          Taught by: {data?.author?.name ?? ""}, {data?.author?.role ?? ""}
        </Typography>

        <Box
          sx={{
            position: "absolute",
            right: 16,
            bottom: -150,
            width: 300,
            boxShadow: 3,
            borderRadius: 3,
            bgcolor: "#fff",
            overflow: "hidden",
            textAlign: "center",
            zIndex: 2,
            display: { xs: "none", md: "block" },
          }}
        >
          <Box sx={{ bgcolor: "#008080", py: 4, mb: 2 }}>
            <Typography variant="h6" color="#fff">
              Meet The Instructor
            </Typography>
          </Box>
          <Avatar
            src="/instructor.jpg"
            alt="Instructor"
            sx={{ width: 80, height: 80, mx: "auto", mt: -4 }}
          />
          <Typography variant="h6" mt={1}>
            {data?.author?.name ?? ""}
          </Typography>
          <Typography variant="caption">{data?.author?.role ?? ""}</Typography>
          <Typography mt={1}>
            <StarRoundedIcon fontSize="small" /> 4.0 | 1 Course(s)
          </Typography>

          <Button
            onClick={handleJoinClass}
            disabled={addCourseToUser.isLoading || isEnrolled}
            variant="contained"
            sx={{ my: 2 }}
          >
            JOIN CLASS
          </Button>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid sx={{ position: "relative" }} size={{ xs: 12, md: 8 }}>
            <Box
              mb={2}
              mt={4}
              sx={{ display: "flex", alignItems: "center", gap: "3rem" }}
            >
              <Typography
                variant="h5"
                color={isEnrolled ? "active" : "#BDBDBD"}
                fontWeight="bold"
              >
                {isEnrolled ? "Enrolled" : "Not Enrolled"}
              </Typography>
              <Button
                onClick={handleJoinClass}
                disabled={addCourseToUser.isLoading || isEnrolled}
                variant="contained"
                sx={{ borderRadius: "2rem", height: "40px" }}
              >
                Enroll
              </Button>
            </Box>

            <Card sx={{ p: 2, mb: 2 }}>
              <Box
                mb={3}
                sx={{
                  backgroundColor: "#008080",
                  width: "fit-content",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 8,
                }}
              >
                <Typography variant="h6" color="#fff">
                  Content
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight="medium">
                Overview
              </Typography>
              <Typography mt={1}>{data?.overview ?? ""}</Typography>
              <Typography mt={0.5}>Category: {data?.category ?? ""}</Typography>
              <Typography mt={0.5}>Term: {data?.term ?? ""}</Typography>
              <Typography mt={0.5}>
                Academic Year: {data?.academic_year ?? ""}
              </Typography>
              <Typography mt={0.5}>Week: {data?.week ?? ""}</Typography>
              <Typography mt={0.5}>Due Date: {data?.due_date ?? ""}</Typography>
            </Card>
          </Grid>

          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{
              mt: { xs: 0, md: 8 },
            }}
          >
            <Box
              sx={{
                boxShadow: 3,
                borderRadius: 3,
                bgcolor: "#fff",
                overflow: "hidden",
                textAlign: "center",
                zIndex: 2,
                display: { xs: "block", md: "none" },
              }}
            >
              <Box sx={{ bgcolor: "#008080", py: 4, mb: 2 }}>
                <Typography variant="h6" color="#fff">
                  Meet The Instructor
                </Typography>
              </Box>
              <Avatar
                src={data?.author?.dp || "/instructor.jpg"}
                alt="Instructor"
                sx={{ width: 80, height: 80, mx: "auto", mt: -4 }}
              />
              <Typography variant="h6" mt={1}>
                {data?.author?.name ?? ""}
              </Typography>
              <Typography variant="caption">
                {data?.author?.role ?? ""}
              </Typography>
              <Typography mt={1}>
                <StarRoundedIcon fontSize="small" /> 4.0 | 1 Course(s)
              </Typography>

              <Button
                onClick={handleJoinClass}
                disabled={addCourseToUser.isLoading || isEnrolled}
                variant="contained"
                sx={{ my: 2 }}
              >
                Enroll
              </Button>
            </Box>
            <Box mt={8} sx={{ position: "relative" }}>
              <Card sx={{ overflow: "hidden" }}>
                <Box
                  sx={{
                    position: "relative",
                    height: 200,
                    display: { xs: "block", md: "block" },
                  }}
                >
                  {firstVideo && (
                    <ReactPlayer
                      url={firstVideo}
                      controls
                      width="100%"
                      height="100%"
                      light={false}
                      style={{
                        borderRadius: "16px",
                      }}
                      config={{
                        file: {
                          attributes: {
                            controlsList: "nodownload",
                          },
                        },
                      }}
                    />
                  )}
                </Box>
              </Card>
            </Box>

            <Paper
              elevation={3}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                mt: 4,
              }}
            >
              <Box
                sx={{
                  py: 2,
                  px: 3,
                }}
              >
                <Typography variant="h6">Content</Typography>
              </Box>

              <Box sx={{ p: 0 }}>
                {data?.curriculum?.topics?.map((module: TopicDto) => (
                  <Accordion key={module.id} disableGutters>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box display="flex" alignItems="center">
                        <PlayCircle sx={{ mr: 1 }} />
                        <Typography fontWeight={500}>{module.title}</Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {module?.lessons?.map((asset) => (
                          <>
                            <ListItem
                              component="button"
                              key={asset.id}
                              onClick={() => {
                                if (asset.type === "video") {
                                  setExpandedVideoId(
                                    expandedVideoId === asset.id
                                      ? null
                                      : asset.id ?? null
                                  )
                                  asset?.video &&
                                    setVideoPreviewUrl(asset?.video)
                                }
                              }}
                            >
                              <ListItemIcon>
                                {getIcon(asset.type, asset?.content)}
                              </ListItemIcon>
                              <ListItemText
                                primary={asset.title}
                                secondary={asset.id}
                              />
                            </ListItem>
                            {expandedVideoId === asset.id &&
                              videoPreviewUrl && (
                                <Box sx={{ p: 2, width: "100%", ml: 4 }}>
                                  <ReactPlayer
                                    url={videoPreviewUrl}
                                    controls
                                    width="100%"
                                    height="100%"
                                  />
                                </Box>
                              )}
                          </>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
        <ModalLogin />
        <SignUpLogin />
        <PaymentModal course={data} />
        <ReviewModal userId={user?.id || ""} courseId={cid as string} />
      </Container>
    </>
  )
}

export default CourseDetail
