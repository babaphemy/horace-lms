import { Metadata } from "next"

export const generateMetadata = (options: {
  title?: string
  description?: string
}): Metadata => {
  const { title, description } = options

  const baseTitle = "Horace Learning Management Solution and School ERP"
  const baseDescription =
    "Horace Learning Management Solution, Online courses, School ERP, LMS"

  return {
    title: title ? `${title} | ${baseTitle}` : baseTitle,
    description: description || baseDescription,
  }
}
