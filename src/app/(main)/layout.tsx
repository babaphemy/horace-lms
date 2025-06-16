"use client"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import Providers from "@/components/layout/Providers"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Providers>
      <Header />
      {children}
      <Footer />
    </Providers>
  )
}
