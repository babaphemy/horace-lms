import { Alert, Button, Card, CardContent, CardHeader } from "@mui/material"
import { School } from "@mui/icons-material"
import { Plan, TCountryCode } from "@/types/types"
import ElementsForm from "./Payment/ElementsForm"
import { useMutation } from "react-query"
import { startSubscriptionCheckout } from "@/app/api/rest"
import { useState } from "react"
import { SubscriptionCheckoutResponse } from "@/types/types"

interface Props {
  planDetail: Plan
  amt: number
  locale: TCountryCode
}

export function formatAmount(amt: number, locale: TCountryCode) {
  const currencySymbol = locale === "NG" ? "₦" : "$"
  return `${currencySymbol}${(amt / 100).toFixed(2)}`
}

function requiresCustomContact(planDetail: Plan, amt: number) {
  return planDetail.slug === "team-upskilling" || !Number.isFinite(amt)
}

const RenderPayment: React.FC<Props> = ({ planDetail, amt, locale }) => {
  const isCustomPricing = requiresCustomContact(planDetail, amt)
  const [checkout, setCheckout] = useState<SubscriptionCheckoutResponse | null>(
    null
  )
  const mutation = useMutation({
    mutationFn: startSubscriptionCheckout,
    onSuccess: (result) => {
      if (result.provider === "PAYSTACK" && result.authorizationUrl) {
        window.location.assign(result.authorizationUrl)
        return
      }
      setCheckout(result)
    },
  })

  const beginCheckout = () => {
    if (!planDetail.id) return
    mutation.mutate({
      planId: planDetail.id,
      currency: locale === "NG" ? "NGN" : "USD",
      provider: locale === "NG" ? "PAYSTACK" : "STRIPE",
    })
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <School className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Payment Page</h1>
        </div>

        <p className="text-muted-foreground">
          {isCustomPricing
            ? "Thank you for choosing Horace Learning. A member of staff will contact you shortly"
            : "Complete your payment to activate your account"}
        </p>
      </CardHeader>
      <CardContent>
        <div className="mb-6 rounded-lg bg-muted/50 p-4">
          <h3 className="mb-2 font-semibold">Order Summary</h3>
          <div className="space-y-1 text-sm">
            <p>Plan: {planDetail.name}</p>
            <p>Access period: {planDetail.duration}</p>
            <p>This payment does not renew automatically.</p>

            {!isCustomPricing && (
              <p>Amount: {formatAmount(checkout?.amount ?? amt, locale)}</p>
            )}
          </div>
        </div>
        {mutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {mutation.error instanceof Error
              ? mutation.error.message
              : "Unable to start payment."}
          </Alert>
        )}
        {!isCustomPricing && !checkout && (
          <Button
            fullWidth
            variant="contained"
            disabled={mutation.isLoading || !planDetail.id}
            onClick={beginCheckout}
          >
            {mutation.isLoading
              ? "Preparing payment..."
              : "Continue to payment"}
          </Button>
        )}
        {!isCustomPricing &&
          checkout?.provider === "STRIPE" &&
          !checkout.clientSecret && (
            <Alert severity="error">
              The payment provider did not return a payment session. Please
              start again.
            </Alert>
          )}
        {!isCustomPricing &&
          checkout?.provider === "STRIPE" &&
          checkout.clientSecret && (
            <div className="space-y-4">
              <ElementsForm
                amt={checkout.amount}
                reference={checkout.reference}
                clientSecret={checkout.clientSecret}
              />
            </div>
          )}
      </CardContent>
    </Card>
  )
}

export default RenderPayment
