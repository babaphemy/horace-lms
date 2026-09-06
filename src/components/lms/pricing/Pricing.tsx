"use client"
import { useRouter } from "next/navigation"
import { Plan } from "../../../types/types"
import PricingPlan from "./PricingPlan"
import { notifyInfo } from "@/utils/notification"
import { Appcontext } from "@/context/AppContext"
import { useContext } from "react"
export const plans: Plan[] = [
  {
    name: "Self-Paced Labs",
    price: { US: "$79", NG: "₦120,000" },
    slug: "self-paced-labs",
    duration: "/month",
    description: "For learners who want structured projects and checkpoints.",
    features: [
      "Skill track catalog access",
      "Guided hands-on labs",
      "Automated checkpoint feedback",
      "Portfolio project publishing",
      "Community support",
      "Skill progress dashboard",
    ],
  },
  {
    name: "Mentored Track",
    price: { US: "$199", NG: "₦300,000" },
    slug: "mentored-track",
    duration: "/month",
    description: "For learners who want expert review and career proof.",
    features: [
      "Everything in Self-Paced Labs",
      "1:1 and group mentorship",
      "Project rubric review",
      "Verified skill certificate",
      "Portfolio critique",
      "Priority Q&A response",
    ],
  },
  {
    name: "Team Upskilling",
    price: { US: "Custom Pricing", NG: "Custom Pricing" },
    slug: "team-upskilling",

    duration: "/team",
    description: "For teams that need practical training and reporting.",
    features: [
      "Bulk invitations by email or CSV",
      "Assigned skill tracks",
      "Aggregate lab progress",
      "Certificate tracking",
      "CSV and PDF reporting",
      "Dedicated implementation support",
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
    <div className="px-4 py-16 bg-[#eef5f6]">
      <div className="max-w-7xl mx-auto">
        <p className="text-center font-bold uppercase text-[#0F5E76]">
          Outcome-based plans
        </p>
        <h2 className="text-3xl md:text-5xl font-extrabold text-center mt-3 mb-5">
          Pick the support level your goal needs.
        </h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto text-lg">
          Choose self-paced labs, a mentored career track, or a team program
          with aggregate progress and certificate reporting.
        </p>
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
