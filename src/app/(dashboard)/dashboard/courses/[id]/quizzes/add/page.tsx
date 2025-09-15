import CreateQuiz from "@/components/courses/quiz/CreateQuiz"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params

  return <CreateQuiz id={id} />
}
