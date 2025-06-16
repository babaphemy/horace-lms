import { AppProvider } from "@/context/AppContext"
import ToastProvider from "@/providers/toast-provider"
import { muiTheme } from "@/styles/theme"
import { ThemeProvider } from "@mui/material"
import { SessionProvider } from "next-auth/react"
import { CookiesProvider } from "react-cookie"
import { QueryClient, QueryClientProvider } from "react-query"
import Ga from "../Analytics/Google/Ga"

const queryClient = new QueryClient()
interface ProvidersProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any
}
export default function Providers({ children }: ProvidersProps) {
  return (
    <div>
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
    </div>
  )
}
