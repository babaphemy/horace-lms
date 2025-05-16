"use client"

import Ga from "@/components/Analytics/Google/Ga"
import { USER_ADD } from "@/context/Action"
import { AppDpx, AppProvider } from "@/context/AppContext"
import ToastProvider from "@/providers/toast-provider"
import { muiTheme } from "@/styles/theme"
import { ThemeProvider } from "@mui/material"
import { SessionProvider } from "next-auth/react"
import { Open_Sans } from "next/font/google"
import { useContext, useEffect } from "react"
import { CookiesProvider } from "react-cookie"
import ReactGA from "react-ga"
import TagManager from "react-gtm-module"
import { QueryClient, QueryClientProvider } from "react-query"
import "react-toastify/dist/ReactToastify.css"
import "./globals.css"

const volkhov = Open_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-volkhov",
  display: "swap",
  weight: ["400", "700"],
})
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

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
  types: string
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
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={muiTheme}>
            <Ga />
            <SessionProvider>
              <CookiesProvider defaultSetOptions={{ path: "/" }}>
                <AppProvider>
                  <>
                    {children}
                    <ToastProvider />
                  </>
                </AppProvider>
              </CookiesProvider>
            </SessionProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
