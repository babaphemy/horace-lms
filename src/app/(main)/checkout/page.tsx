"use client"
import { useSearchParams } from "next/navigation"
import React, { Suspense } from "react"

import { TCountryCode } from "@/types/types"
import { fetchSupportPlans } from "../../api/rest"

import RenderPayment from "@/components/checkout/RenderPayment"
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Button,
} from "@mui/material"
import { useQuery } from "react-query"
import { mapSupportPlan } from "@/utils/supportPlan"
import { useSession } from "next-auth/react"
import Link from "next/link"

const CheckoutPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <CheckoutContent />
  </Suspense>
)
const CheckoutContent: React.FC = () => {
  const searchParams = useSearchParams()
  const plan = searchParams.get("plan")
  const locale = searchParams.get("locale") as TCountryCode
  const { data: session, status } = useSession()
  const {
    data: supportPlans,
    isLoading: plansLoading,
    isError: plansError,
  } = useQuery({
    queryKey: ["support-plans"],
    queryFn: fetchSupportPlans,
    staleTime: 5 * 60 * 1000,
  })
  if (plansLoading || status === "loading") return <CircularProgress />
  if (plansError) return <Alert severity="error">Unable to load plans.</Alert>

  const planDetail = supportPlans
    ?.map(mapSupportPlan)
    .find((p) => p.slug === plan)
  if (!planDetail || !locale) {
    return (
      <Alert severity="warning">
        The selected support plan is unavailable.
      </Alert>
    )
  }

  const amt = locale === "NG" ? planDetail.price.NG : planDetail.price.US

  const convertedAmt = parseFloat(amt.replace(/[^\d.]/g, ""))
  const checkoutAmount = Number.isFinite(convertedAmt)
    ? convertedAmt * 100
    : Number.NaN

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "grey.100",
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 2,
                }}
                id="pay"
              >
                {session?.user?.id ? (
                  <RenderPayment
                    planDetail={planDetail}
                    amt={checkoutAmount}
                    locale={locale}
                  />
                ) : (
                  <Alert severity="info">
                    Sign in before purchasing an LMS support plan.
                    <Button
                      component={Link}
                      href={`/login?redirect=${encodeURIComponent(
                        `/checkout?plan=${planDetail.slug}&locale=${locale}`
                      )}`}
                    >
                      Sign in
                    </Button>
                    <Button
                      component={Link}
                      href={`/sign-up?redirect=${encodeURIComponent(
                        `/checkout?plan=${planDetail.slug}&locale=${locale}`
                      )}`}
                    >
                      Create account
                    </Button>
                  </Alert>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}

export default CheckoutPage
