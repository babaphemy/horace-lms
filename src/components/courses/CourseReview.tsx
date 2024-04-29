"use client"

import {
  Alert,
  Avatar,
  Box,
  Button,
  Divider,
  LinearProgress,
  LinearProgressProps,
  Rating,
  TextField,
  Typography,
} from "@mui/material"
import React from "react"
import { useMutation, useQueryClient } from "react-query"
import { addReview } from "@/app/api/rest"
import { AppDpx } from "@/context/AppContext"
import { MODAL_SET } from "@/context/Action"
import { fromNow } from "@/utils/fromNow"
import ModalContainer from "../ModalContainer"

type Props = {
  posts?: any[]
  ratings?: number | null
}

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number; label: string }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          mr: 1,
          flex: 2,
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: "0.75rem", md: "1rem" },
          }}
          color="text.secondary"
        >
          {props.label}
        </Typography>
      </Box>
      <Box sx={{ flex: 6 }}>
        <LinearProgress
          variant="determinate"
          {...props}
          sx={{
            borderRadius: "10px",
            backgroundColor: "#F9AD5655",

            "& .MuiLinearProgress-bar": {
              borderRadius: "10px",
              backgroundColor: "#F9AD56",
            },
          }}
        />
      </Box>
      <Box sx={{ ml: 1, flex: 2 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  )
}

const CourseReview = ({ posts, ratings }: Props) => {
  const [viewMore, setViewMore] = React.useState(false)
  const [conditionalReview, setConditionalReview] = React.useState<any[]>([])
  const dispatch = React.useContext(AppDpx)

  const reviewOrder = posts
    ?.sort((a, b) => {
      return b.rating - a.rating
    })
    .sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  React.useEffect(() => {
    if (reviewOrder && reviewOrder.length > 3 && !viewMore) {
      setConditionalReview(reviewOrder.slice(0, 3))
    } else {
      setConditionalReview(reviewOrder || [])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMore, posts])

  const handleOpenReviewModal = () => {
    dispatch({ type: MODAL_SET, data: { open: true, type: "review" } })
  }

  return (
    <div className="flex flex-col">
      <Typography
        variant="h4"
        sx={{
          fontSize: { xs: "1.5rem", md: "2rem" },
        }}
      >
        Reviews & Ratings
      </Typography>
      <Typography
        variant="body1"
        sx={{ fontSize: { xs: "1rem", md: "1.2rem" } }}
      >
        Our Students says about this course
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            mt: 2,
            p: 2,
            flex: 1,
            maxWidth: "700px",
            borderRadius: "30px",
            border: "1px solid #000000",

            "@media (max-width: 1000px)": {
              width: "100%",
            },
          }}
        >
          <Box
            sx={{
              // backgroundColor: '#F9AD5611',
              color: "black",
              p: 3,
              mr: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minHeight: "200px",

              "@media (max-width: 1000px)": {
                mr: 0,
                mb: 1,
                width: "100%",
              },
            }}
          >
            <Typography variant="h2">
              {Number(ratings?.toFixed(1)) || 5}
            </Typography>
            <Rating
              name="read-only"
              value={Number(ratings?.toFixed(1)) || 5}
              readOnly
              sx={{
                my: 1,
              }}
            />
            <Typography variant="body1">{posts?.length} Review(s)</Typography>
          </Box>
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              "@media (max-width: 1000px)": {
                display: "none",
              },
            }}
          />
          <Box
            sx={{
              // backgroundColor: '#F9AD5611',
              color: "black",
              p: 3,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minHeight: "200px",

              "@media (max-width: 1000px)": {
                width: "100%",
              },
            }}
          >
            <Box>
              <LinearProgressWithLabel
                label="Excellent"
                variant="determinate"
                value={
                  ((posts?.filter((post) => post.rating === 5).length || 0) /
                    posts?.length!) *
                    100 || 100
                }
              />
              <LinearProgressWithLabel
                label="Very Good"
                variant="determinate"
                value={
                  ((posts?.filter((post) => post.rating === 4).length || 0) /
                    posts?.length!) *
                    100 || 0
                }
              />
              <LinearProgressWithLabel
                label="Average"
                variant="determinate"
                value={
                  ((posts?.filter((post) => post.rating === 3).length || 0) /
                    posts?.length!) *
                    100 || 0
                }
              />
              <LinearProgressWithLabel
                label="Poor"
                variant="determinate"
                value={
                  ((posts?.filter((post) => post.rating === 2).length || 0) /
                    posts?.length!) *
                    100 || 0
                }
              />
              <LinearProgressWithLabel
                label="Terrible"
                variant="determinate"
                value={
                  ((posts?.filter((post) => post.rating === 1).length || 0) /
                    posts?.length!) *
                    100 || 0
                }
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Button
        className="bg-[#00A9C1] text-white rounded-full px-10 py-2 my-5 hover:bg-[#00A9C1] flex justify-start w-fit"
        onClick={handleOpenReviewModal}
      >
        Add Review & Rating
      </Button>
      <Box>
        {conditionalReview?.map((post, index, array) => {
          return (
            <Box key={index}>
              <Box display={"flex"} my={1}>
                <Avatar
                  alt="instructor"
                  src="https://material-ui.com/static/images/avatar/1.webp"
                  sx={{ width: 50, height: 50 }}
                />
                <Box ml={2}>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body1" margin={0}>
                      {post.user}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" ml={1}>
                      {post.createdOn
                        ? fromNow(new Date(post.createdOn))
                        : "1 day ago"}
                    </Typography>
                  </Box>
                  <Rating
                    name="read-only"
                    value={post.rating}
                    readOnly
                    size="small"
                  />
                </Box>
              </Box>
              <Typography variant="body1" color="text.secondary" ml={3}>
                {post.message || "I'm loving this course!"}
              </Typography>

              {array.length - 1 !== index && array.length > 1 && (
                <Divider sx={{ my: 2 }} />
              )}
            </Box>
          )
        })}
      </Box>
      {reviewOrder?.length! > 3 && (
        <Button
          sx={{
            ...styles.button,
            alignSelf: "center",
            justifySelf: "center",
          }}
          onClick={() => setViewMore(!viewMore)}
        >
          {viewMore ? "View Less" : "View More"}
        </Button>
      )}
    </div>
  )
}

export default CourseReview

type ReviewModalProps = {
  userId: string
  courseId: string
}

export const ReviewModal = ({ userId, courseId }: ReviewModalProps) => {
  const queryClient = useQueryClient()
  const [rating, setRating] = React.useState(1)
  const [comment, setComment] = React.useState("")
  const [error, setError] = React.useState("")

  const dispatch = React.useContext(AppDpx)

  const handleRatingChange = (event: any, newValue: any) => {
    setRating(newValue)
  }

  const { mutate, isLoading: loading } = useMutation(addReview, {
    onSuccess: () => {
      queryClient.invalidateQueries("acourse")
      dispatch({ type: MODAL_SET, data: { open: false, type: "review" } })
      setComment("")
      setRating(1)
    },
    onError: (error: any) => {
      console.log(error)
    },
  })

  const handleSubmit = () => {
    setError("")
    if (!rating) {
      setError("Please select a rating")
      return
    }
    if (!comment) {
      setError("Please add a comment")
      return
    }

    const user = {
      user: {
        id: userId,
      },
    }

    const payload = {
      ...(userId && user),
      course: {
        id: courseId,
      },
      rating: rating,
      type: "REVIEW",
      message: comment,
    }

    mutate(payload)
  }

  return (
    <ModalContainer type="review">
      <Box
        sx={{
          minWidth: "500px",
        }}
      >
        <Typography variant="h4">Add Review & Rating</Typography>
        <Divider sx={{ my: 2 }} />
        {error && (
          <Alert
            severity="error"
            sx={{
              my: 2,
            }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}
        <Box>
          <Typography variant="h5">Your Rating</Typography>

          <Rating
            name="customized-10"
            sx={{ mb: 2 }}
            value={rating}
            max={5}
            onChange={handleRatingChange}
          />

          <Typography variant="h5">Your Review</Typography>
          <TextField
            multiline
            rows={4}
            variant="outlined"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ width: "100%" }}
          />
        </Box>
        <Button sx={styles.button} disabled={loading} onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </ModalContainer>
  )
}

const styles = {
  button: {
    border: "1px solid",
    borderColor: "primary",
    px: 4,
    my: 2,
  },
}
