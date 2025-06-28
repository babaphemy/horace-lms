"use client"
import { useParams } from "next/navigation"
import CourseEditor from "@/components/lms/courseEditor/CourseEditor"
import { useSession } from "next-auth/react"

export default function EditCoursePage() {
  const { data: session } = useSession()
  const params = useParams()
  const { id } = params

  return <CourseEditor id={id as string} userId={session?.user.id as string} />
}
