"use client"
import React, { Suspense, useContext, useState } from "react"
import { useSearchParams } from "next/navigation"

import useSWR from "swr"
import { TCountryCode, Tranx } from "@/types/types"
import { Appcontext } from "@/context/AppContext"
import { basePath } from "../api/setting"
import { fetcher } from "../api/rest"
import { plans } from "@/components/lms/pricing/Pricing"
import { formatAmount } from "@/utils/pay"
import RenderPayment from "@/components/checkout/RenderPayment"
import RenderAuth from "@/components/checkout/RenderAuth"
import {
  Box,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Typography,
  Chip,
} from "@mui/material"

const CheckoutPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <CheckoutContent />
  </Suspense>
)
const CheckoutContent: React.FC = () => {
  const { user, tranx } = useContext(Appcontext)
  const [selectedTransactions, setSelectedTransactions] = useState<number[]>([])

  const searchParams = useSearchParams()
  const plan = searchParams.get("plan")
  const locale = searchParams.get("locale") as TCountryCode
  const user_id = searchParams.get("user_id")
  const { data } = useSWR(
    user?.id || user_id
      ? [`${basePath}pay/istranx/${user?.id || user_id}`]
      : null,
    fetcher
  )

  const planDetail = plans.find((p) => p.slug === plan)
  if (!planDetail || !locale) return null

  const amt = locale === "NG" ? planDetail.price.NG : planDetail.price.US

  const convertedAmt = parseFloat(amt.replace(/[^\d.]/g, ""))

  const handleCheckbox = (tranxId: number) => {
    setSelectedTransactions((prev) =>
      prev.includes(tranxId)
        ? prev.filter((id) => id !== tranxId)
        : [...prev, tranxId]
    )
  }

  const selectedTotal = data?.length
    ? data
        .filter((tranx: Tranx) => selectedTransactions.includes(tranx.ref))
        .reduce((sum: number, item: Tranx) => sum + item.amount, 0)
    : convertedAmt * 100

  return (
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
            <Grid item xs={12} md={6}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 2,
                }}
                id="tranx"
              >
                <TableContainer>
                  <Table>
                    <TableHead sx={{ bgcolor: "grey.50" }}>
                      <TableRow>
                        <TableCell padding="checkbox">Select</TableCell>
                        <TableCell>ID</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map((tranx: Tranx) => (
                        <TableRow
                          key={tranx.id}
                          sx={{
                            "& > td": { borderTop: 1, borderColor: "divider" },
                          }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedTransactions.includes(tranx.ref)}
                              onChange={() => handleCheckbox(tranx.ref)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{tranx.ref}</TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {tranx.description}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Plan: {planDetail.name} - {planDetail.description}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            {formatAmount(tranx.amount, locale)}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={tranx.status}
                              size="small"
                              color={
                                tranx.status === "Pending"
                                  ? "warning"
                                  : tranx.status === "Completed"
                                    ? "success"
                                    : "default"
                              }
                              sx={{
                                bgcolor:
                                  tranx.status === "Pending"
                                    ? "warning.100"
                                    : tranx.status === "Completed"
                                      ? "success.100"
                                      : "grey.100",
                                color:
                                  tranx.status === "Pending"
                                    ? "warning.800"
                                    : tranx.status === "Completed"
                                      ? "success.800"
                                      : "grey.800",
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ mt: 2, textAlign: "right" }}>
                  <Typography variant="subtitle1" fontWeight="600">
                    Selected Total: {formatAmount(selectedTotal, locale)}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          )}

          <Grid item xs={12} md={data?.length > 0 ? 6 : 12}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 2,
              }}
              id="pay"
            >
              {user_id || user !== null || tranx ? (
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
  )
}

export default CheckoutPage
