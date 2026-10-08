"use client"

import React, { useMemo } from "react"
import { Elements } from "@stripe/react-stripe-js"

import getStripe from "./get-stripe"

import { LinearProgress } from "@mui/material"
import ElementCheckout from "./ElementCheckout"
import { StripeElementsOptions } from "@stripe/stripe-js"
interface StripeProps {
  clientSecret: string
  amt: number
  reference: string
  returnPath?: string
  currency?: string
}
const ElementsForm: React.FC<StripeProps> = ({
  clientSecret,
  amt,
  reference,
  returnPath,
  currency,
}) => {
  const stripeOptions = useMemo(() => {
    const options: StripeElementsOptions = {
      appearance: {
        variables: {
          colorIcon: "#6772e5",
          fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
        },
      },
      clientSecret,
    }
    return options
  }, [clientSecret])

  return (
    <div className="container mx-auto px-4 py-8">
      {!isNaN(amt) && amt > 0 ? (
        <Elements stripe={getStripe()} options={stripeOptions}>
          <ElementCheckout
            amount={amt}
            reference={reference}
            returnPath={returnPath}
            currency={currency}
          />
        </Elements>
      ) : (
        <LinearProgress />
      )}
    </div>
  )
}

export default ElementsForm
