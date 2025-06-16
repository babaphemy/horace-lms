"use client"

import { Open_Sans } from "next/font/google"
import "react-toastify/dist/ReactToastify.css"
import "./globals.css"

const volkhov = Open_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-volkhov",
  display: "swap",
  weight: ["400", "700"],
})

// export const metadata: Metadata = {
//   title: "Horace Learning Management Solution and School ERP",
//   description:
//     "Horace Learning Management Solution, Online courses, School ERP, LMS",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
  types: string
}>) {
  return (
    <html lang="en">
      <head />
      <body className={`${volkhov.variable}`}>{children}</body>
    </html>
  )
}
