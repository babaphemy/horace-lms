"use client"
import { addUserCourse, fetchCourse } from "@/app/api/rest"
import Header from "@/components/Header"
import SimilarCard from "@/components/SimilarCard"
import ModalLogin from "@/components/auth/ModalLogin"
import SignUpLogin from "@/components/auth/ModalSignUp"
import CourseObjectives from "@/components/courses/CourseObjectives"
import { ReviewModal } from "@/components/courses/CourseReview"
import CourseHeader from "@/components/layout/CourseHeader"
import FooterLte from "@/components/layout/FooterLte"
import PaymentModal from "@/components/payment/PaymentModal"
import { MODAL_SET } from "@/context/Action"
import { AppDpx, Appcontext } from "@/context/AppContext"
import { LessonDto, tCourseLte, TopicDto, tPost } from "@/types/types"
import {
  Code,
  Download,
  NoteAddRounded,
  PlayCircle,
  QuizRounded,
} from "@mui/icons-material"
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Rating,
  Typography,
} from "@mui/material"
import Fuse from "fuse.js"
import ReactPlayer from "react-player"
import React, { useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useParams, useRouter } from "next/navigation"
import { notifyError, notifySuccess } from "@/utils/notification"
import Curriculum from "@/components/courses/Curriculum"
import { useSession } from "next-auth/react"
// export const metadata = generateMetadata({
//   title: "Horace Learning Management Solution | Horace Courses",
//   description:
//     "Horace Online Courses. Learning Management Solution and a complete school management system for all schools",
// })
const Detailb = () => {
  const { courses } = React.useContext(Appcontext)
  const { data: session } = useSession()
  const user = session?.user
  const params = useParams()
  const { cid } = params
  const dispatch = React.useContext(AppDpx)
  // const [regCourse, setRegCourse] = React.useState<boolean>(false)
  const [similarCourses, setSimilarCourses] = React.useState<tCourseLte[]>([])
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data } = useQuery(
    ["acourse", cid, user?.id],
    () => fetchCourse(cid as string, user?.id),
    {
      staleTime: 5000,
      cacheTime: 10,
      enabled: !!cid,
    }
  )

  useEffect(() => {
    queryClient.invalidateQueries("acourse")
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fuse = new Fuse(courses, {
      keys: ["category", "courseName", "brief"],
      includeScore: false,
      includeMatches: true,
      minMatchCharLength: 3,
    })

    if (courseName || category) {
      const result = fuse
        .search(`${courseName} | ${category}`)
        .map((item: { item: tCourseLte }) => item.item)
      if (result.length > 1) {
        setSimilarCourses(result.slice(0, 2))
      } else {
        setSimilarCourses(courses.slice(0, 2))
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid, data])

  const {
    courseId,
    courseName,
    overview,
    target,
    curriculum,
    brief,
    category,
    updatedOn,
    price,
    posts,
    assetCount,
    registered,
  } = data || {}

  const calculatedRating = () => {
    let total = 0
    posts?.forEach((post: tPost) => {
      total += post.rating
    })
    return total / posts?.length
  }
  const author = `${data?.author?.firstname || "Horace"} ${
    data?.author?.lastname || "Instructor"
  }`
  const { lessonCount, downloadCount, quizCount, labCount, noteCount } =
    assetCount || {}

  const addCourseToUser = useMutation(addUserCourse, {
    onSuccess: () => {
      notifySuccess("You are now enrolled!")
    },
    onError: (error) => {
      notifyError("Enrollment Failed, Please Try Again!")
      throw error
    },
  })

  const handleJoinClass = () => {
    const payload = {
      id: courseId,
      user: user?.id,
    }

    if (user?.id) {
      price > 0
        ? addCourseToUser.mutate({ ...payload, user: String(payload.user) })
        : dispatch({
            type: MODAL_SET,
            data: { open: true, type: "payment" },
          })
    } else {
      dispatch({ type: MODAL_SET, data: { open: true, type: "login" } })
    }
  }

  const headerProps = {
    id: courseId,
    name: courseName,
    lessonCount: 0,
    category,
    brief,
    ratings: calculatedRating(),
    reviews: data?.reviews,
    author,
    overview,
    updatedOn,
    posts,
  }
  const objProps = {
    target,
    overview,
    courseName,
    curriculum,
    category,
    modified: updatedOn,
    brief,
    posts,
    ratings: calculatedRating(),
    handleJoinClass,
    registered,
  }
  const firstVideo = curriculum?.topic
    ?.flatMap((topic: TopicDto) => topic.lessons || [])
    ?.find(
      (lesson: LessonDto) => lesson.video !== null && lesson.video !== undefined
    )

  return (
    <>
      <Header />

      <CourseHeader courseProps={headerProps} />
      <Container
        maxWidth="lg"
        sx={{
          px: { xs: 0, sm: 2, md: 4 },
        }}
      >
        <div className="flex flex-col px-2 md:px-0 md:flex-row space-y-5 md:space-y-0">
          <div className="w-full  md:w-2/3">
            <Box className="my-4 px-2 block md:hidden">
              {firstVideo && (
                <ReactPlayer
                  url={`https://essl.b-cdn.net/${firstVideo}`}
                  controls={true}
                  loop={true}
                  width="100%"
                  height="100%"
                  light={true}
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
            <CourseObjectives {...objProps} />
          </div>
          <div className="w-full md:w-1/3 md:ml-6 relative md:-top-48 md:-mb-48">
            <Box className="flex flex-col rounded-2xl drop-shadow-md min-h-[50vh] ">
              <Box className="flex-1 bg-[#0F5E76] rounded-t-2xl py-[4.5rem]" />
              <Box className="flex-1 bg-white rounded-b-2xl px-10">
                <Box className="flex flex-col items-center justify-center relative -top-[6rem] -mb-[6rem]">
                  <Typography variant="h6" className="mb-4 text-white">
                    Meet your instructor
                  </Typography>
                  <Avatar
                    alt="instructor"
                    src={
                      data?.author?.dp ||
                      "https://material-ui.com/static/images/avatar/1.webp"
                    }
                    sx={{ width: 120, height: 120 }}
                  />
                  <Typography
                    variant="subtitle1"
                    className="mt-4 text-xl font-normal text-black"
                  >
                    {author}
                  </Typography>
                  <Typography variant="subtitle1" className="text-black">
                    {data?.author?.title || "Instructor"}
                  </Typography>
                  <Box className="border border-gray-400 flex items-center justify-between w-full p-2 rounded-xl my-2">
                    <Rating
                      name="author-rating"
                      value={Number(data?.author?.rating?.toFixed(1)) || 5}
                      readOnly
                      size="small"
                    />
                    <Divider orientation="vertical" flexItem />
                    <Typography variant="body2" className="text-black">
                      {data?.author?.courses?.length} Courses
                    </Typography>
                    <Divider orientation="vertical" flexItem />
                    <Typography variant="body2" className="text-black">
                      {data?.author?.reviews?.length} Review(s)
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle1"
                    className="mt-4 text-md font-normal text-black"
                  >
                    This Course Includes
                  </Typography>
                  <nav>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <PlayCircle fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${lessonCount || ""} Lessons`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <QuizRounded fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={`${quizCount || ""} Quizes`} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Code fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${labCount || ""} Hands-on Labs`}
                        />
                      </ListItem>
                      {downloadCount > 0 && (
                        <ListItem>
                          <ListItemIcon>
                            <Download fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary={`${downloadCount} Downloads`}
                          />
                        </ListItem>
                      )}

                      {noteCount > 0 && (
                        <ListItem>
                          <ListItemIcon>
                            <NoteAddRounded fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={`${noteCount} Notes`} />
                        </ListItem>
                      )}
                    </List>
                  </nav>
                  <Box className="flex justify-between items-center mb-10">
                    {registered ? (
                      <Button
                        variant="contained"
                        className="bg-[#00A9C1] text-white py-2 px-10 rounded-full hover:bg-[#00A9C1]"
                        onClick={() =>
                          router.push("/course/classroom?courseId=" + courseId)
                        }
                      >
                        Go To Class
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        className="bg-[#00A9C1] text-white py-2 px-10 rounded-full hover:bg-[#00A9C1]"
                        onClick={handleJoinClass}
                      >
                        Enroll
                      </Button>
                    )}

                    <Typography
                      variant="h6"
                      className="text-[#00A9C1]"
                      sx={{
                        textDecoration: registered ? "line-through" : "none",
                      }}
                    >
                      {typeof price === "number"
                        ? price < 1
                          ? "Free"
                          : `$${price}`
                        : ""}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box className="mt-8 px-2 hidden md:block">
              {/* <ReactPlayer
                url={`https://essl.b-cdn.net/${preview}`}
                controls={true}
                loop={true}
                width="100%"
                height="100%"
              /> */}
            </Box>
            <Box className="mt-8 block ">
              <Paper className="py-7 p-3 mt-8 rounded-2xl border-2 border-[#FF869A] bg-gray-100">
                <Typography variant="h6" className="mt-4 mx-4">
                  Content
                </Typography>
                <Curriculum data={data} />
              </Paper>
            </Box>
          </div>
        </div>
        <div className="mt-8 mb-4">
          <Typography variant="h4" className="my-5">
            Similar Courses
          </Typography>
        </div>
        <Grid container spacing={2}>
          {/* <Grid item xs={12} md={6}>
            <SimilarCard />
          </Grid> */}

          {similarCourses?.map((course) => (
            <Grid size={{ xs: 12, md: 6 }} key={course.id}>
              <SimilarCard course={course} />
            </Grid>
          ))}
        </Grid>
      </Container>
      <ModalLogin />
      <SignUpLogin />
      <PaymentModal course={data} />
      <ReviewModal userId={user?.id || ""} courseId={courseId} />
      <FooterLte />
    </>
  )
}

export default Detailb
