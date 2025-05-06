import React, { useEffect } from "react"
import { Appcontext, AppDpx } from "@/context/AppContext"
import { paystacktx } from "@/app/api/rest"
import { notifyError } from "@/utils/notification"
import { Button } from "@mui/material"
import { useMutation } from "react-query"
import { Plan } from "@/types/types"

const Paystack = ({ plan }: { plan: Plan }) => {
  const { user, userId } = React.useContext(Appcontext)
  const dispatch = React.useContext(AppDpx)
  const mutation = useMutation({
    mutationFn: paystacktx,
    onSuccess: (data) => {
      const authorizationUrl = data?.pay?.data?.authorization_url
      if (authorizationUrl !== undefined) {
        window.open(authorizationUrl, "_self")
        dispatch({ type: "SET_TRANX", payload: data })
      } else {
        notifyError("error occured! Paystack not initialized")
      }
    },
    onError: () => {
      notifyError("error occured! Paystack not initialized")
    },
  })

  const initpay = () => {
    const convertedAmt =
      parseFloat(
        (plan?.price["NG"] || "").replace(/[^0-9.]/g, "").replace(",", "")
      ) * 100

    if (!userId && !user?.id && !convertedAmt) {
      notifyError("error occured! User not found")
      return
    }

    const paydto = {
      amount: convertedAmt,
      email: user?.email,
      payee: user?.id || userId || "",
      first_name: user?.firstname,
      last_name: user?.lastname,
      currency: "NGN" as "NGN",
      tranx_type: "PLAN",
      tranx: `${user?.id}-${plan?.slug}-${Date.now()}`,
      status: "Pending",
      description: `${plan?.name}-${plan?.duration}-${plan?.description}`,
      callback_url: `${window.location.origin}/payment/verify`,
    }

    mutation.mutate(paydto)
  }
  useEffect(() => {
    initpay()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-12 text-center">
      <h1 className="text-3xl font-bold md:text-4xl">
        Payment Confirmation Page
      </h1>

      <h2 className="text-xl text-muted-foreground md:text-2xl">
        Please wait while we redirect you to the payment page...
      </h2>

      <Button onClick={initpay} fullWidth className="mt-4">
        Click here if not redirected automatically.
      </Button>
    </main>
  )
}
export default Paystack
