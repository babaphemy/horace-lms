import { Card, CardContent, CardHeader } from "@mui/material"
import { School } from "@mui/icons-material"
import { Plan, TCountryCode } from "@/types/types"
import Paystack from "./Payment/Paystack"
import ElementsForm from "./Payment/ElementsForm"

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

            {!isCustomPricing && <p>Amount: {formatAmount(amt, locale)}</p>}
          </div>
        </div>
        {!isCustomPricing && (
          <div className="space-y-4">
            {locale === "NG" ? (
              <Paystack plan={planDetail} />
            ) : (
              <ElementsForm amt={amt} />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default RenderPayment
