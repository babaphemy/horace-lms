"use client"

import { fetcher } from "@/app/api/rest"
import { basePath } from "@/app/api/setting"
import { CheckCircle, Home } from "@mui/icons-material"
import { Button, Card, CardContent } from "@mui/material"
import { useParams, useRouter } from "next/navigation"

import useSWR from "swr"

const SuccessPage = () => {
  const router = useRouter()
  const params = useParams()
  const { ref } = params
  const { data } = useSWR(
    ref ? `${basePath}tranx/byref?txnref=${ref}` : null,
    fetcher
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Success icon */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-8">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>

        {/* Main content card */}
        <Card className="border-green-200 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Payment Successful!
              </h1>
              <div className="w-16 h-1 bg-green-500 mx-auto my-4"></div>
              <p className="text-gray-600 mb-6">
                Your transaction has been completed. Please check your email for
                further step.
              </p>

              {/* Transaction details summary */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono font-medium">{ref}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Date:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-gray-800">Amount:</span>
                  <span className="text-green-600">
                    {data?.currency}
                    {(data?.amount / 100)?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button
                  variant="outlined"
                  className="flex-1 border-green-200 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                  onClick={() => router.push("/")}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support section */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>
            Need help? Contact our support team at{" "}
            <a
              href="mailto:office@myeverlasting.net"
              className="text-green-600 hover:underline"
            >
              office@myeverlasting.net
            </a>
          </p>

          <p className="mt-4 text-gray-400">
            Redirecting...
            <button
              onClick={() => router.push("/")}
              className="text-green-600 hover:underline inline-flex items-center"
            >
              Go now <Home className="ml-1 h-3 w-3" />
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SuccessPage
