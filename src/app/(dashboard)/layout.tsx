"use client"
import Footer from "@/components/layout/Footer"
import LeftSide from "@/components/layout/LeftSide"
import Providers from "@/components/layout/Providers"
import TopNavbar from "@/components/layout/TopNavbar"
import "@/styles/main.scss"
import { useState } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [active, setActive] = useState(false)
  const toogleActive = () => {
    setActive(!active)
  }
  return (
    <Providers>
      <div className={`main-wrapper-content ${active && "active"}`}>
        <TopNavbar toogleActive={toogleActive} />
        <LeftSide toogleActive={toogleActive} />
        <div className="main-content">{children}</div>
        <Footer />
      </div>
    </Providers>
  )
}
