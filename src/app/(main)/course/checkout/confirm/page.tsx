"use client"

import { verifyCoursePayment } from "@/app/api/rest"
import { CheckCircle, X } from "@mui/icons-material"
import { Alert, Button, CircularProgress } from "@mui/material"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import React, { Suspense } from "react"
import { useQuery } from "react-query"

const CoursePaymentConfirmation = () => {
  const reference = useSearchParams().get("reference")
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["course-payment", reference],
    queryFn: () => verifyCoursePayment(reference as string),
    enabled: Boolean(reference),
    retry: false,
  })

  if (!reference)
    return <Alert severity="error">Payment reference is missing.</Alert>

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {isLoading ? (
          <>
            <CircularProgress />
            <p className="mt-4">Verifying course payment...</p>
          </>
        ) : isError ? (
          <>
            <X className="h-12 w-12 text-red-600 mx-auto" />
            <h1 className="text-2xl font-bold mt-4">Payment not verified</h1>
            <p className="text-gray-600 my-4">
              {error instanceof Error ? error.message : "Please try again."}
            </p>
            <Button variant="contained" onClick={() => refetch()}>
              Check again
            </Button>
          </>
        ) : data ? (
          <>
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
            <h1 className="text-2xl font-bold mt-4">Course unlocked</h1>
            <p className="text-gray-600 my-4">
              Payment verified and the course has been added to your account.
            </p>
            <Button
              component={Link}
              href={`/course/${data.courseId}`}
              variant="contained"
            >
              Open course
            </Button>
          </>
        ) : null}
      </div>
    </div>
  )
}

const CoursePaymentConfirmPage = () => (
  <Suspense fallback={<CircularProgress />}>
    <CoursePaymentConfirmation />
  </Suspense>
)

export default CoursePaymentConfirmPage
