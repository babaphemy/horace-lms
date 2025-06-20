import Providers from "@/components/layout/Providers"

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>
}
