import SkillCertificatePage from "@/components/certificate/skills/SkillCertificatePage"

interface PageProps {
  searchParams: Promise<{
    userId?: string
  }>
}

const Page = async ({ searchParams }: PageProps) => {
  const params = await searchParams

  return <SkillCertificatePage userId={params.userId || "guest"} />
}

export default Page
