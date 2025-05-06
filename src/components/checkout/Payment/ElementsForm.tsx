"use client"

import React, { useMemo } from "react"
import { Elements } from "@stripe/react-stripe-js"

import getStripe from "./get-stripe"

import { LinearProgress } from "@mui/material"
import ElementCheckout from "./ElementCheckout"
interface StripeProps {
  tranx?: Transaction
  amt: number
}

interface Transaction {
  clientSecret?: string
  // Add other transaction properties
}

const ElementsForm: React.FC<StripeProps> = ({ tranx, amt }) => {
  const stripeOptions = useMemo(() => {
    const options: any = {
      appearance: {
        variables: {
          colorIcon: "#6772e5",
          fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
        },
      },
      currency: "usd",
      mode: "payment" as "payment",
      amount: amt,
    }
    if (tranx?.clientSecret) {
      options.clientSecret = tranx.clientSecret
    }
    return options
  }, [amt, tranx?.clientSecret])

  return (
    <div className="container mx-auto px-4 py-8">
      {!isNaN(amt) && amt > 0 ? (
        <Elements stripe={getStripe()} options={stripeOptions}>
          <ElementCheckout amount={amt} />
        </Elements>
      ) : (
        <LinearProgress />
      )}
    </div>
  )
}

export default ElementsForm
