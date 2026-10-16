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

const enrichPlanFeatures = (
  slug: string,
  features: string[] = []
): string[] => {
  const normalized = slug.toLowerCase()

  if (normalized.includes("self-paced")) {
    const hasMentorshipMention = features.some((f) =>
      f.toLowerCase().includes("mentor")
    )
    const hasCertMention = features.some((f) =>
      f.toLowerCase().includes("certificate")
    )
    const exclusions: string[] = []
    if (!hasMentorshipMention) {
      exclusions.push(
        "No 1:1 mentor booking or async Q&A (Mentored Track only)"
      )
    }
    if (!hasCertMention) {
      exclusions.push("No verified skill certificates (Mentored Track only)")
    }
    return [...features, ...exclusions]
  }

  if (normalized.includes("mentored")) {
    const hasTeamMention = features.some((f) =>
      f.toLowerCase().includes("team")
    )
    const exclusions: string[] = []
    if (!hasTeamMention) {
      exclusions.push("No multi-seat team management (Team Upskilling only)")
    }
    return [...features, ...exclusions]
  }

  return features
}

export const mapSupportPlan = (plan: SupportPlanResponse): Plan => ({
  id: plan.id,
  name: plan.name,
  slug: plan.slug,
  description: plan.description,
  features: enrichPlanFeatures(plan.slug, plan.features),
  price: {
    US: currency(plan.prices.USD, "USD"),
    NG: currency(plan.prices.NGN, "NGN"),
  },
  duration: accessPeriod(plan),
})
