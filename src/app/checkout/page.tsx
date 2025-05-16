"use client"
import React, { Suspense, useContext, useState } from "react"
import { useSearchParams } from "next/navigation"

import useSWR from "swr"
import { TCountryCode, TransactionItem, Tranx } from "@/types/types"
import { Appcontext } from "@/context/AppContext"
import { basePath } from "../api/setting"
import { fetcher } from "../api/rest"
import { plans } from "@/components/lms/pricing/Pricing"

import RenderPayment from "@/components/checkout/RenderPayment"
import RenderAuth from "@/components/checkout/RenderAuth"
import { Box, Container, Grid, Paper } from "@mui/material"
import ExistingTranx from "@/components/checkout/ExistingTranx"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

const CheckoutPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <CheckoutContent />
  </Suspense>
)
const CheckoutContent: React.FC = () => {
  const { userId, tranx } = useContext(Appcontext)
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])

  const searchParams = useSearchParams()
  const plan = searchParams.get("plan")
  const locale = searchParams.get("locale") as TCountryCode
  const user_id = searchParams.get("user_id")
  const { data } = useSWR(
    userId || user_id ? [`${basePath}pay/istranx/${userId || user_id}`] : null,
    fetcher
  )

  const planDetail = plans.find((p) => p.slug === plan)
  if (!planDetail || !locale) return null

  const amt = locale === "NG" ? planDetail.price.NG : planDetail.price.US

  const convertedAmt = parseFloat(amt.replace(/[^\d.]/g, ""))

  const selectedTotal = data?.length
    ? data
        .filter((tranx: TransactionItem) =>
          selectedTransactions.includes(tranx.id)
        )
        .reduce((sum: number, item: Tranx) => sum + (item?.amount ?? 0), 0)
    : convertedAmt * 100

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "grey.100",
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {data?.length > 0 && (
              <ExistingTranx
                data={data}
                selectedTotal={selectedTotal}
                selectedTransactions={selectedTransactions}
                setSelectedTransactions={setSelectedTransactions}
                locale={locale}
                planDetail={planDetail}
              />
            )}

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 2,
                }}
                id="pay"
              >
                {user_id || userId !== null || tranx ? (
                  <RenderPayment
                    planDetail={planDetail}
                    amt={selectedTotal}
                    locale={locale}
                  />
                ) : (
                  <RenderAuth planDetail={planDetail} locale={locale} />
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  )
}

export default CheckoutPage
