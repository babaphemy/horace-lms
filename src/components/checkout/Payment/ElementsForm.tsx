"use client"

import React, { useMemo } from "react"
import { Elements } from "@stripe/react-stripe-js"

import getStripe from "./get-stripe"

import { LinearProgress } from "@mui/material"
import ElementCheckout from "./ElementCheckout"
import { StripeElementsOptions } from "@stripe/stripe-js"
interface StripeProps {
  tranx?: Transaction
  amt: number
}

interface Transaction {
  clientSecret?: string
}

const ElementsForm: React.FC<StripeProps> = ({ tranx, amt }) => {
  const stripeOptions = useMemo(() => {
    const options: StripeElementsOptions = {
      appearance: {
        variables: {
          colorIcon: "#6772e5",
          fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
        },
      },
      ...(tranx?.clientSecret ? { clientSecret: tranx.clientSecret } : {}),
    }
    return options
  }, [tranx?.clientSecret])

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
