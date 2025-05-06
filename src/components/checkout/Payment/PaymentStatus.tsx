import { SET_PLAN } from "@/context/Action"
import { Appcontext, AppDpx } from "@/context/AppContext"
import { Alarm, CheckCircle, LocalFireDepartment } from "@mui/icons-material"
import { useContext } from "react"
const PaymentStatus = () => {
  const dispatch = useContext(AppDpx)
  const { paymentStatus } = useContext(Appcontext)

  const renderStatus = () => {
    switch (paymentStatus) {
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
          </div>
        )

      default:
        return null
    }
  }

  return <div className="mb-6 text-center">{renderStatus()}</div>
}
export default PaymentStatus
