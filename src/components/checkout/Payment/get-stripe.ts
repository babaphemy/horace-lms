import { Stripe, loadStripe } from "@stripe/stripe-js"

let stripePromise: Promise<Stripe | null>

export default function getStripe() {
  const publishableKey =
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_stripe_pub
  if (!publishableKey) {
    throw new Error("Stripe publishable key is not configured")
  }
  if (!stripePromise) stripePromise = loadStripe(publishableKey)

  return stripePromise
}
