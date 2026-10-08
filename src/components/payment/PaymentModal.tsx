"use client"

import { startCourseCheckout } from "@/app/api/rest"
import ElementsForm from "@/components/checkout/Payment/ElementsForm"
import { CourseResponse } from "@/types/types"
import { Alert, Box, Button, Divider, Typography } from "@mui/material"
import React, { useState } from "react"
import { useMutation } from "react-query"
import ModalContainer from "../ModalContainer"

const money = (value: number, currency: string) =>
  new Intl.NumberFormat(currency === "NGN" ? "en-NG" : "en-US", {
    style: "currency",
    currency,
  }).format(value)

const PaymentModal = ({ course }: { course: CourseResponse }) => {
  const [checkout, setCheckout] = useState<Awaited<
    ReturnType<typeof startCourseCheckout>
  > | null>(null)
  const currency = (course?.currency || "USD").toUpperCase()
  const basePrice = Number(course?.price || 0)
  const tax = Number(course?.tax || 0)
  const total = basePrice + tax
  const mutation = useMutation({
    mutationFn: startCourseCheckout,
    onSuccess: (result) => {
      if (result.provider === "PAYSTACK" && result.authorizationUrl) {
        window.location.assign(result.authorizationUrl)
        return
      }
      setCheckout(result)
    },
  })

  const startPayment = () => {
    if (!course?.courseId) return
    mutation.mutate({
      courseId: course.courseId,
      provider: currency === "NGN" ? "PAYSTACK" : "STRIPE",
    })
  }

  return (
    <ModalContainer type="payment">
      <Box sx={{ maxHeight: "85vh", overflowY: "auto" }}>
        <Typography variant="h4" mb={2}>
          Purchase course
        </Typography>
        <Divider />
        <Box my={2}>
          <Typography variant="h6">{course?.courseName}</Typography>
          <Typography>Course: {money(basePrice, currency)}</Typography>
          <Typography>Tax: {money(tax, currency)}</Typography>
          <Typography fontWeight={800}>
            Total:{" "}
            {checkout
              ? money(checkout.amount / 100, checkout.currency)
              : money(total, currency)}
          </Typography>
        </Box>
        {mutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {mutation.error instanceof Error
              ? mutation.error.message
              : "Unable to start course payment."}
          </Alert>
        )}
        {!checkout && (
          <Button
            variant="contained"
            fullWidth
            disabled={mutation.isLoading || !course?.courseId}
            onClick={startPayment}
          >
            {mutation.isLoading
              ? "Preparing payment..."
              : "Continue to payment"}
          </Button>
        )}
        {checkout?.provider === "STRIPE" && !checkout.clientSecret && (
          <Alert severity="error">
            Stripe did not return a payment session.
          </Alert>
        )}
        {checkout?.provider === "STRIPE" && checkout.clientSecret && (
          <ElementsForm
            amt={checkout.amount}
            reference={checkout.reference}
            clientSecret={checkout.clientSecret}
            currency={checkout.currency}
            returnPath="/course/checkout/confirm"
          />
        )}
      </Box>
    </ModalContainer>
  )
}

export default PaymentModal
