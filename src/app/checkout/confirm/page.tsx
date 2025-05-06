"use client"
import React, { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import useSWR from "swr"
import { basePath } from "@/app/api/setting"
import { fetcher } from "@/app/api/rest"
import { Button, CircularProgress, LinearProgress } from "@mui/material"
import { X } from "@mui/icons-material"

const ConfirmPageContent: React.FC = () => {
  const searchParams = useSearchParams()
  const pi = searchParams.get("payment_intent")
  const { data, isLoading } = useSWR(`${basePath}pay/intent/${pi}`, fetcher)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {isLoading ? (
          <div className="flex flex-col items-center">
            <LinearProgress />
            <p className="mt-2 text-gray-600">Verifying payment...</p>
          </div>
        ) : data?.status === "succeeded" ? (
          <div className="text-center">
            <div className="mb-4 inline-flex p-3 bg-green-100 rounded-full">
              <CircularProgress />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h1>

            <p className="text-gray-600 mb-6">
              Reference: HSP-{data?.metadata?.ref}
            </p>
            <p className="text-gray-600 mb-6">
              Description: Horace Subscription. {data?.description}
            </p>
            <p className="text-gray-600 mb-6">
              Amount: {data?.amount / 100} {data?.currency?.toUpperCase()}
            </p>
            <Button
              component="a"
              href="/dashboard"
              target="_blank"
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-4 inline-flex p-3 bg-red-100 rounded-full">
              <X className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Failed
            </h1>
            <p className="text-gray-600 mb-6">
              Please try again or contact support
            </p>
            <Button
              component={Link}
              href="/"
              variant="outlined"
              className="w-full"
            >
              Return to Home
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

const ConfirmPage: React.FC = () => {
  return (
    <Suspense fallback={<CircularProgress />}>
      <ConfirmPageContent />
    </Suspense>
  )
}

export default ConfirmPage
