"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Head from "next/head"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle, Home } from "@mui/icons-material"

const ConfirmedPage = () => {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Trigger confetti animation after component mounts
    setShowConfetti(true)

    // Optional: Set page title
    document.title = "Email Confirmed! | Horace LMS"

    // Optional: Track conversion
    // if (typeof window !== "undefined" && window.analytics) {
    //   window.analytics.track("Email Confirmed")
    // }
  }, [])

  return (
    <>
      <Head>
        <title>Email Confirmed! | YourApp</title>
        <meta
          name="description"
          content="Your email has been confirmed successfully"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Animated confetti effect */}
        {showConfetti && (
          <div className="confetti-container absolute inset-0 pointer-events-none">
            {[...Array(50)].map((_, i) => {
              const size = Math.random() * 8 + 6
              const left = Math.random() * 100
              const animationDuration = Math.random() * 3 + 2
              const delay = Math.random() * 0.5
              const color = [
                "bg-blue-500",
                "bg-green-500",
                "bg-yellow-400",
                "bg-purple-500",
                "bg-pink-500",
              ][Math.floor(Math.random() * 5)]

              return (
                <div
                  key={i}
                  className={`absolute top-0 rounded-sm ${color}`}
                  style={{
                    left: `${left}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    animation: `fall ${animationDuration}s ease-in forwards`,
                    animationDelay: `${delay}s`,
                    opacity: 0,
                  }}
                />
              )
            })}
          </div>
        )}

        <motion.div
          className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2" />

          <div className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
              className="mx-auto mb-6 bg-green-100 w-24 h-24 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="h-14 w-14 text-green-500" />
            </motion.div>

            <motion.h1
              className="text-3xl font-bold text-gray-800 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Email Confirmed!
            </motion.h1>

            <motion.p
              className="text-gray-600 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Thank you for verifying your email address. Your account is now
              fully activated and ready to use.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Continue to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors"
              >
                <Home className="h-4 w-4" />
                Return to Homepage
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.p
          className="text-gray-500 text-sm mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          If you have any questions, please contact our{" "}
          <Link href="/contact" className="text-blue-600 hover:underline">
            support team
          </Link>
          .
        </motion.p>
      </div>

      {/* Styles for confetti animation */}
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(calc(100vh + 10px)) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  )
}

export default ConfirmedPage
