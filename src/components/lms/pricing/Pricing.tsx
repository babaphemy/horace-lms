"use client"
import { useRouter } from "next/navigation"
import { Plan } from "../../../types/types"
import PricingPlan from "./PricingPlan"
import { notifyInfo } from "@/utils/notification"
import { Appcontext } from "@/context/AppContext"
import { useContext } from "react"
export const plans: Plan[] = [
  {
    name: "Basic",
    price: { US: "$10", NG: "₦14,000" },
    slug: "basic",
    duration: "/month",
    description: "Ideal for small schools or individual educators.",
    features: [
      "User Management",
      "Course Creation",
      "Quiz and Assessment",
      "Basic Reporting",
      "Email Support",
      "Payment System",
    ],
  },
  {
    name: "Standard",
    price: { US: "$30", NG: "₦42,000" },
    slug: "standard",
    duration: "/month",
    description: "Perfect for mid-sized schools and corporate organizations.",
    features: [
      "All Basic Features",
      "Advanced Reporting",
      "AI Agent",
      "Priority Support",
      "Custom Branding",
      "Certificates and Badges",
    ],
  },
  {
    name: "Standard+",
    price: { US: "Custom Pricing", NG: "Custom Pricing" },
    slug: "standard-plus",

    duration: "/choice",
    description: "Custom solutions for large institutions or districts.",
    features: [
      "All Standard Features",
      "Dedicated Account Manager",
      "Custom Integrations",
      "Advanced Analytics",
      "On-site Training",
      "White Labeling",
    ],
  },
]
const Pricing: React.FC = () => {
  const router = useRouter()
  const { locale } = useContext(Appcontext)

  const choosePlan = (plan: Plan) => {
    const selectedPlan = plans.find((p) => p.name === plan.name)
    if (!selectedPlan) {
      notifyInfo("Plan not found")
      return
    }
    router.push(`/checkout?plan=${plan.slug}&locale=${locale}`)
  }

  return (
    <div className="p-8 bg-gray-200">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-center my-10">
          Pricing Plans
        </h2>
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
