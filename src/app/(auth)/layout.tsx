"use client"
import Providers from "@/components/layout/Providers"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <Providers>{children}</Providers>
}
