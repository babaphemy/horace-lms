"use client"
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google"
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GTM!
const GAID = process.env.NEXT_PUBLIC_GA!
export default function Ga() {
  return (
    <>
      <GoogleAnalytics gaId={GAID} />
      <GoogleTagManager gtmId={GA_MEASUREMENT_ID} />
    </>
  )
}
