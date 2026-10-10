"use client"
import { Appcontext, AppDpx } from "@/context/AppContext"
import { Button, Card, CardContent, TextField } from "@mui/material"
import { useCallback, useContext, useState } from "react"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { notifyError } from "@/utils/notification"
import { SET_PAYMENT_STATUS } from "@/context/Action"
import { formatAmount } from "@/utils/pay"

const PaymentForm = ({
  amount,
  reference,
  returnPath = "/checkout/confirm",
  currency,
}: {
  amount: number
  reference: string
  returnPath?: string
  currency?: string
}) => {
  const [paymentType, setPaymentType] = useState<string>("")
  const dispatch = useContext(AppDpx)
  const { locale, paymentStatus } = useContext(Appcontext)

  const [cardholderName, setCardHolder] = useState<string>("")

  const stripe = useStripe()
  const elements = useElements()
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCardHolder(e.target.value)
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault()
      if (!e.currentTarget.reportValidity() || !elements || !stripe) return
      dispatch({ type: SET_PAYMENT_STATUS, payload: "processing" })

      try {
        const { error: submitError } = await elements.submit()

        if (submitError) {
          dispatch({ type: SET_PAYMENT_STATUS, payload: "error" })
          notifyError(submitError.message ?? "An unknown error occurred")
          return
        }
        const { error: confirmError } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}${returnPath}?reference=${encodeURIComponent(reference)}`,
            payment_method_data: {
              billing_details: { name: cardholderName },
            },
          },
        })

        if (confirmError) {
          dispatch({ type: SET_PAYMENT_STATUS, payload: "error" })
          notifyError(confirmError.message ?? "An unknown error occurred")
        }
      } catch {
        dispatch({ type: SET_PAYMENT_STATUS, payload: "error" })
        notifyError("An unknown error occurred")
      }
    },
    [dispatch, elements, cardholderName, stripe, reference, returnPath]
  )
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <fieldset className="space-y-4">
            <legend className="mb-4 text-lg font-semibold">
              Your payment details:
            </legend>

            {paymentType === "card" && (
              <TextField
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
          !["initial", "succeeded", "error"].includes(paymentStatus) || !stripe
        }
        type="submit"
      >
        Pay{" "}
        {currency
          ? new Intl.NumberFormat(currency === "NGN" ? "en-NG" : "en-US", {
              style: "currency",
              currency,
            }).format(amount / 100)
          : formatAmount(amount, locale)}
      </Button>
    </form>
  )
}
export default PaymentForm
