"use client"

import dynamic from "next/dynamic"

const BeautifulAPIDocsPage = dynamic(
  () => import("@/components/BeautifulApiDocs"),
  { ssr: false }
)

export default function Page() {
  return <BeautifulAPIDocsPage />
}
