"use client"

import { verifySubscriptionPayment } from "@/app/api/rest"
import { CheckCircle, X } from "@mui/icons-material"
import { Alert, Button, CircularProgress } from "@mui/material"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import React, { Suspense } from "react"
import { useQuery } from "react-query"

const ConfirmPageContent = () => {
  const searchParams = useSearchParams()
  const reference = searchParams.get("reference")
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["subscription-payment", reference],
    queryFn: () => verifySubscriptionPayment(reference as string),
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
            <p className="mt-4">Verifying payment with the provider...</p>
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
        ) : data?.active ? (
          <>
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
            <h1 className="text-2xl font-bold mt-4">LMS access activated</h1>
            <p className="text-gray-600 my-4">
              Your {data.plan.name} plan is active until{" "}
              {new Date(data.expiresAt).toLocaleDateString()}.
            </p>
            <Button component={Link} href="/courses" variant="contained">
              Continue to courses
            </Button>
          </>
        ) : (
          <Alert severity="warning">Subscription activation is pending.</Alert>
        )}
      </div>
    </div>
  )
}

const ConfirmPage = () => (
  <Suspense fallback={<CircularProgress />}>
    <ConfirmPageContent />
  </Suspense>
)

export default ConfirmPage
