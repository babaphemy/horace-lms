"use client"
import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import useUser from "@/hooks/useUser"

export default function Logout() {
  const { removeUser } = useUser()

  useEffect(() => {
    removeUser()
  }, [removeUser])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg transform transition-all">
        <div className="flex flex-col items-center">
          <Link href="/" className="mb-6">
            <Image
              src="/img/logo.png"
              alt="Logo"
              width={180}
              height={72}
              priority
              className="mx-auto"
            />
          </Link>

          <div className="relative w-24 h-24 mb-6">
            <Image
              src="/img/coffee.png"
              alt="Coffee"
              fill
              className="object-contain"
            />
          </div>

          <h1 className="mt-2 text-center text-2xl font-bold text-gray-900">
            You are Logged Out
          </h1>

          <p className="mt-2 text-center text-gray-600">
            Thank you for using Horace LMS
          </p>
        </div>

        <div className="mt-8">
          <Link
            href="/login"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Sign In Again
          </Link>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
