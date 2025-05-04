import { TCountryCode } from "@/types/types"

export function formatAmount(amt: number, locale: TCountryCode) {
  const currencySymbol = locale === "NG" ? "₦" : "$"
  return `${currencySymbol}${(amt / 100).toFixed(2)}`
}
