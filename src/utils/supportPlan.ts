import { Plan, SupportPlanResponse } from "@/types/types"

const currency = (value: number | undefined, code: "USD" | "NGN") => {
  if (value === undefined) return "Unavailable"
  return new Intl.NumberFormat(code === "NGN" ? "en-NG" : "en-US", {
    style: "currency",
    currency: code,
    maximumFractionDigits: 2,
  }).format(value)
}

const accessPeriod = (plan: SupportPlanResponse) => {
  const unit = plan.durationUnit.toLowerCase()
  const label = plan.durationValue === 1 ? unit.replace(/s$/, "") : unit
  return `${plan.durationValue} ${label} access`
}

export const mapSupportPlan = (plan: SupportPlanResponse): Plan => ({
  id: plan.id,
  name: plan.name,
  slug: plan.slug,
  description: plan.description,
  features: plan.features,
  price: {
    US: currency(plan.prices.USD, "USD"),
    NG: currency(plan.prices.NGN, "NGN"),
  },
  duration: accessPeriod(plan),
})
