"use client"

import { useState } from "react"
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js"
import { StripeCardElement } from "@stripe/stripe-js"
import { Button } from "@mui/material"

interface CheckoutFormProps {
  amount: number
}

export default function CheckoutForm({ amount }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setErrorMessage("")

    // Create payment intent on the server
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    })

    const { clientSecret, error: intentError } = await response.json()

    if (intentError) {
      setErrorMessage(intentError)
      setIsLoading(false)
      return
    }

    // Confirm the payment with the card element
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement) as StripeCardElement,
          billing_details: {
            name: "Customer Name", // You can collect this dynamically
          },
        },
      }
    )

    setIsLoading(false)

    if (error) {
      setErrorMessage(error.message || "")
    } else if (paymentIntent.status === "succeeded") {
      // Payment successful - redirect or show success message
      window.location.href = "/success"
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Card Details</label>
        <div className="p-3 border rounded-md">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
      </div>

      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

      <Button type="submit" disabled={!stripe || isLoading} className="w-full">
        {isLoading ? "Processing..." : `Pay $${amount.toFixed(2)}`}
      </Button>
    </form>
  )
}
