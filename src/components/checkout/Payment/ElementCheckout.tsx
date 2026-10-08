import PaymentStatus from "./PaymentStatus"
import PaymentForm from "./PaymentForm"

const ElementCheckout = ({
  amount,
  reference,
  returnPath,
  currency,
}: {
  amount: number
  reference: string
  returnPath?: string
  currency?: string
}) => {
  //   const { userId } = useContext(Appcontext)
  //   const router = useRouter()

  // if (!userId) {
  //   router.push("/login")
  //   return null
  // }

  return (
    <div className="w-full max-w-lg">
      <PaymentStatus />

      <PaymentForm
        amount={amount}
        reference={reference}
        returnPath={returnPath}
        currency={currency}
      />
    </div>
  )
}

export default ElementCheckout
