"use client"

import { handlePay } from "@/app/api/rest"
import { Appcontext } from "@/context/AppContext"
import { Typography, Box, Divider, Button } from "@mui/material"
import React, { useContext } from "react"
import ModalContainer from "../ModalContainer"
import { tCourse } from "@/types/types"

const PaymentModal = ({ course }: { course: tCourse }) => {
  const { user } = useContext(Appcontext)
  const author = `${course?.author?.firstname || "Horace"} ${
    course?.author?.lastname || "Instructor"
  }`

  const handleCoursePayment = async () => {
    const payload = {
      amt: Number(course?.price - course?.tax) * 100,
      currency: "USD",
      description: "Payment for " + course?.courseName,
      name:
        user?.firstname + " " + user?.lastname || user?.email?.split("@")[0],
    }

    if (!user) {
      alert("Please login to continue")
      return
    }

    if (!course?.price) {
      alert("Course price is not set")
      return
    }

    await handlePay(payload)
    return
  }
  return (
    <ModalContainer type="payment">
      <Box>
        <Typography variant="h4" mb={2}>
          Payment
        </Typography>
        <Divider />
        <Box mt={2}>
          <Typography variant="h6" mb={2}>
            Author: {author}
          </Typography>
          <Typography variant="h6" mb={2}>
            Course: {course?.courseName}
          </Typography>
          <Typography variant="h6" mb={2}>
            Price: ${course?.price}
          </Typography>
          <Typography variant="h6" mb={2}>
            Tax: ${course?.tax}
          </Typography>
          <Typography variant="h6" mb={2}>
            Total: ${course?.price - course?.tax}
          </Typography>
        </Box>
        <Divider />
        <Button
          variant="contained"
          sx={{
            backgroundColor: "red !important",
          }}
          fullWidth
          onClick={handleCoursePayment}
        >
          Pay ${course?.price - course?.tax}
        </Button>
      </Box>
    </ModalContainer>
  )
}

export default PaymentModal
