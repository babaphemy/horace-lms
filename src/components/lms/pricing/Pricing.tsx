"use client"
import { useRouter } from "next/navigation"
import { Plan } from "../../../types/types"
import PricingPlan from "./PricingPlan"
import { notifyInfo } from "@/utils/notification"
import { Appcontext } from "@/context/AppContext"
import { useContext } from "react"
import { useQuery } from "react-query"
import { fetchSupportPlans } from "@/app/api/rest"
import { mapSupportPlan } from "@/utils/supportPlan"
import { Alert, CircularProgress } from "@mui/material"

const Pricing: React.FC = () => {
  const router = useRouter()
  const { locale } = useContext(Appcontext)
  const { data, isLoading, isError } = useQuery({
    queryKey: ["support-plans"],
    queryFn: fetchSupportPlans,
    staleTime: 5 * 60 * 1000,
  })
  const plans = data?.map(mapSupportPlan) ?? []

  const choosePlan = (plan: Plan) => {
    const selectedPlan = plans.find((p) => p.name === plan.name)
    if (!selectedPlan) {
      notifyInfo("Plan not found")
      return
    }
    router.push(`/checkout?plan=${plan.slug}&locale=${locale}`)
  }

  return (
    <div id="pricing" className="px-4 py-16 bg-[#eef5f6]">
      <div className="max-w-7xl mx-auto">
        <p className="text-center font-bold uppercase text-[#0F5E76]">
          Outcome-based plans
        </p>
        <h2 className="text-3xl md:text-5xl font-extrabold text-center mt-3 mb-5">
          Pick the support level your goal needs.
        </h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto text-lg">
          Choose self-paced labs, a mentored career track, or a team program
          with aggregate progress and certificate reporting. Each payment grants
          access for the displayed period and does not renew automatically.
        </p>
        {isLoading && (
          <div className="flex justify-center my-10">
            <CircularProgress />
          </div>
        )}
        {isError && (
          <Alert severity="error" sx={{ my: 4 }}>
            We couldn&apos;t load support plans. Please try again shortly.
          </Alert>
        )}
        <div className="flex flex-wrap justify-center gap-10 my-10">
          {plans.map((plan, index) => (
            <PricingPlan
              key={index}
              plan={plan}
              action={choosePlan}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Pricing
