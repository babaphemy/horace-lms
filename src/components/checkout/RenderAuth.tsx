"use client"
import React, { useState, useContext } from "react"
import {
  Tabs,
  Tab,
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material"
import School from "@mui/icons-material/School"
import { AppDpx } from "@/context/AppContext"
import { storeTranx } from "@/app/api/rest"
import { Plan, TCountryCode } from "@/types/types"
import CheckoutLogin from "../auth/CheckoutLogin"
import AddSchoolForm from "../home/AddSchoolForm"
import { SET_TRANX, SET_USER_ID } from "@/context/Action"
import { notifySuccess } from "@/utils/notification"
import Link from "next/link"

interface Props {
  planDetail: Plan
  locale: TCountryCode
}

const RenderAuth: React.FC<Props> = ({ planDetail, locale }) => {
  const dispatch = useContext(AppDpx)
  const amt = locale === "NG" ? planDetail.price.NG : planDetail.price.US
  const convertedAmt = parseFloat(amt.replace(/[^\d.]/g, ""))
  const [tab, setTab] = useState<number>(0)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  const makeTranx = async (user_id: string) => {
    if (user_id) {
      const tranx = await storeTranx({
        payee: user_id,
        description: `${planDetail.name}-${planDetail.description}`,
        amount: convertedAmt * 100,
        currency: locale === "NG" ? "NGN" : "USD",
        tranx: "PLAN",
        status: "PENDING",
        type: locale,
      })
      dispatch({ type: SET_TRANX, payload: tranx })
      dispatch({ type: SET_USER_ID, payload: user_id })
      notifySuccess("Signup successful!")
    }
  }

  return (
    <Card sx={{ width: "100%", maxWidth: "2xl" }}>
      <CardHeader
        title={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Link href={"/"}>
              <School sx={{ height: 24, width: 24, color: "primary.main" }} />
            </Link>
            <Typography
              variant="h5"
              component="h1"
              sx={{ fontWeight: "bold", m: 0 }}
            >
              Welcome to Horace Learning
            </Typography>
          </Box>
        }
        subheaderTypographyProps={{ textAlign: "center" }}
        sx={{ textAlign: "center" }}
      />
      <CardContent>
        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab label="New Customer" value={0} />
          <Tab label="Existing Customer" value={1} />
        </Tabs>

        {tab === 0 && (
          <Box sx={{ mt: 2 }}>
            <AddSchoolForm callback={makeTranx} />
          </Box>
        )}
        {tab === 1 && (
          <Box sx={{ mt: 2 }}>
            <CheckoutLogin callback={makeTranx} />
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default RenderAuth
