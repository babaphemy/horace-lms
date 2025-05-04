"use client"

import React, { useContext, useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"

import getStripe from "./get-stripe"
import { Appcontext, AppDpx } from "@/context/AppContext"
import { Alarm, CheckCircle, LocalFireDepartment } from "@mui/icons-material"
import { createPaymentIntent } from "@/app/api/rest"
import { Button, Card, CardContent, Input, LinearProgress } from "@mui/material"
import { formatAmount } from "@/utils/pay"
import { SET_PLAN } from "@/context/Action"
import { notifyError } from "@/utils/notification"
interface StripeProps {
  tranx?: Transaction
  amt: number
}
interface PaymentStatusProps {
  status: string
  errorMessage?: string
}

interface Transaction {
  clientSecret?: string
  // Add other transaction properties
}

interface CheckoutFormProps {
  amount: number
}

type PaymentStatus = {
  status:
    | "initial"
    | "processing"
    | "requires_payment_method"
    | "requires_confirmation"
    | "requires_action"
    | "succeeded"
    | "error"
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({
  status,
  errorMessage,
}) => {
  const dispatch = useContext(AppDpx)

  const renderStatus = () => {
    switch (status) {
      case "processing":
      case "requires_payment_method":
      case "requires_confirmation":
        return (
          <div className="flex flex-col items-center gap-4">
            <LocalFireDepartment className="h-8 w-8 animate-spin text-primary" />
            <h4 className="text-xl font-semibold">Processing...</h4>
          </div>
        )

      case "requires_action":
        return <h4 className="text-xl font-semibold">Authenticating...</h4>

      case "succeeded":
        dispatch({ type: SET_PLAN, payload: null })
        return (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <h4 className="text-xl font-semibold text-green-500">
              Payment Succeeded 🥳. Please check your email for further
              instruction.
            </h4>
          </div>
        )

      case "error":
        return (
          <div className="flex flex-col items-center gap-4">
            <Alarm className="h-8 w-8 text-destructive" />
            <h4 className="text-xl font-semibold text-destructive">Error 😭</h4>
            {errorMessage && (
              <p className="text-sm text-destructive">{errorMessage}</p>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return <div className="mb-6 text-center">{renderStatus()}</div>
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ amount }) => {
  const dispatch = useContext(AppDpx)
  const { plan, locale, user } = useContext(Appcontext)
  const router = useRouter()

  const [cardholderName, setCardHolder] = useState<string>("")
  const [paymentType, setPaymentType] = useState<string>("")
  const [payment, setPayment] = useState<PaymentStatus>({ status: "initial" })
  const [errorMessage, setErrorMessage] = useState<string>("")

  const stripe = useStripe()
  const elements = useElements()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCardHolder(e.target.value)
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault()
      if (!e.currentTarget.reportValidity() || !elements || !stripe) return

      setPayment({ status: "processing" })

      try {
        const { error: submitError } = await elements.submit()

        if (submitError) {
          setPayment({ status: "error" })
          notifyError(submitError.message ?? "An unknown error occurred")
          return
        }

        const { client_secret } = await createPaymentIntent({
          payee: user?.id ?? "",
          description: `${plan?.name}-${plan?.duration}-${plan?.description}`,
          amount: amount,
          currency: "USD",
          // stripe_payment_method: paymentType,
          // firstname: cardholderName,
          // callback_url: `${window.location.origin}/payment/confirm`,
          tranx: "PLAN",
        })

        notifyError("Payment Intent Created")

        const { error: confirmError } = await stripe.confirmPayment({
          elements,
          clientSecret: client_secret,
          confirmParams: {
            return_url: `${window.location.origin}/payment/confirm`,
            payment_method_data: {
              billing_details: { name: cardholderName },
            },
          },
        })

        if (confirmError) {
          setPayment({ status: "error" })
          setErrorMessage(confirmError.message ?? "An unknown error occurred")
        } else {
          setPayment({ status: "succeeded" })
          dispatch({ type: SET_PLAN, payload: null })
        }
      } catch {
        setPayment({ status: "error" })
        setErrorMessage("An unknown error occurred")
      }
    },
    [dispatch, elements, cardholderName, plan, amount, stripe, user?.id]
  )

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <div className="w-full max-w-lg">
      <PaymentStatus status={payment.status} errorMessage={errorMessage} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <fieldset className="space-y-4">
              <legend className="mb-4 text-lg font-semibold">
                Your payment details:
              </legend>

              {paymentType === "card" && (
                <Input
                  placeholder="Cardholder name"
                  type="text"
                  value={cardholderName}
                  name="cardholderName"
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              )}

              <div className="w-full">
                <PaymentElement
                  onChange={(e) => {
                    if (e.value?.type) {
                      setPaymentType(e.value.type)
                    }
                  }}
                />
              </div>
            </fieldset>
          </CardContent>
        </Card>

        <Button
          className="w-full"
          disabled={
            !["initial", "succeeded", "error"].includes(payment.status) ||
            !stripe
          }
          type="submit"
        >
          Pay {formatAmount(amount, locale)}
        </Button>
      </form>
    </div>
  )
}

const ElementsForm: React.FC<StripeProps> = ({ tranx, amt }) => {
  const stripeOptions = useMemo(
    () => ({
      appearance: {
        variables: {
          colorIcon: "#6772e5",
          fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
        },
      },
      currency: "usd",
      amount: amt,
      clientSecret: tranx?.clientSecret,
    }),
    [amt, tranx?.clientSecret]
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {!isNaN(amt) && amt > 0 ? (
        <Elements stripe={getStripe()} options={stripeOptions}>
          <CheckoutForm amount={amt} />
        </Elements>
      ) : (
        <LinearProgress />
      )}
    </div>
  )
}

export default ElementsForm
