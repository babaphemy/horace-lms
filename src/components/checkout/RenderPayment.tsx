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
const RenderPayment: React.FC<Props> = ({ planDetail, amt, locale }) => (
  <Card className="w-full max-w-2xl">
    <CardHeader>
      <div className="flex items-center gap-2">
        <School className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Payment Page</h1>
      </div>

      <p className="text-muted-foreground">
        {planDetail?.slug === "standard-plus"
          ? "Thank you for choosing Horace Learning. A member of staff will contact you shortly"
          : "Complete your payment to activate your account"}
      </p>
    </CardHeader>
    <CardContent>
      <div className="mb-6 rounded-lg bg-muted/50 p-4">
        <h3 className="mb-2 font-semibold">Order Summary</h3>
        <div className="space-y-1 text-sm">
          <p>Plan: {planDetail.name}</p>

          {planDetail?.slug !== "standard-plus" && (
            <p>Amount: {formatAmount(amt, locale)}</p>
          )}
        </div>
      </div>
      {planDetail?.slug !== "standard-plus" && (
        <div className="space-y-4">
          {locale === "NG" ? <Paystack /> : <ElementsForm amt={amt} />}
        </div>
      )}
    </CardContent>
  </Card>
)
export default RenderPayment
