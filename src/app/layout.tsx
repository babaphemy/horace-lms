"use client"
import { Open_Sans } from "next/font/google"
import "./globals.css"
import ReactGA from "react-ga"
import TagManager from "react-gtm-module"
import { ThemeProvider } from "@mui/material"
import { useContext, useEffect } from "react"
import { AppDpx, AppProvider } from "@/context/AppContext"
import { USER_ADD } from "@/context/Action"
import { muiTheme } from "@/styles/theme"
import { QueryClient, QueryClientProvider } from "react-query"
import { ToastContainer } from "react-toastify"

const volkhov = Open_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-volkhov",
  display: "swap",
  weight: ["400", "700"],
})
const queryClient = new QueryClient()

// export const metadata: Metadata = {
//   title: "Horace Learning Management Solution and School ERP",
//   description:
//     "Horace Learning Management Solution, Online courses, School ERP, LMS",
// };
const tagArgs = {
  gtmId: process.env.NEXT_PUBLIC_GTM,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  ReactGA.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS!)
  useEffect(() => {
    TagManager.initialize(tagArgs)
  }, [])
  const dispatch = useContext(AppDpx)
  useEffect(() => {
    const user = localStorage.getItem("horaceUser")
    if (user) {
      dispatch({
        type: USER_ADD,
        payload: JSON.parse(user),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <html lang="en">
      <body className={`${volkhov.variable}`}>
        <ThemeProvider theme={muiTheme}>
          <AppProvider>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </AppProvider>
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  )
}
