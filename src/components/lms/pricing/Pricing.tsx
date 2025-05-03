import { Plan } from "../../../types/types"
import PricingPlan from "./PricingPlan"

const Pricing: React.FC = () => {
  const plans: Plan[] = [
    {
      name: "Basic",
      price: "$10",
      duration: "/month",
      description: "Ideal for small schools or individual educators.",
    },
    {
      name: "Standard",
      price: "$30",
      duration: "/month",
      description: "Perfect for mid-sized schools and corporate organizations.",
    },
    {
      name: "Standard+",
      price: "Custom Pricing",
      duration: "/choice",
      description: "Custom solutions for large institutions or districts.",
    },
  ]

  return (
    <div className="p-8 bg-gray-200">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-center my-10">
          Pricing Plans
        </h2>
        <div className="flex flex-wrap justify-center gap-10 my-10">
          {plans.map((plan, index) => (
            <PricingPlan key={index} plan={plan} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Pricing
