import { Appcontext } from "@/context/AppContext"
import { useContext } from "react"
import PaymentStatus from "./PaymentStatus"
import PaymentForm from "./PaymentForm"

const ElementCheckout = ({ amount }: { amount: number }) => {
  const { userId } = useContext(Appcontext)
  //   const router = useRouter()

  // if (!userId) {
  //   router.push("/login")
  //   return null
  // }

  return (
    <div className="w-full max-w-lg">
      <PaymentStatus />

      <PaymentForm amount={amount} />
    </div>
  )
}

export default ElementCheckout
