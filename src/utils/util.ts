import { FilterItem } from "@/app/(main)/courses/page"

export const coursefilter: FilterItem[] = [
  { label: "All Courses", value: "all" },
  { label: "Web Development", value: "web" },
  { label: "Mobile Development", value: "mobile" },
  { label: "Data Science", value: "data science" },
  { label: "UI/UX Design", value: "ui/ux design" },
  { label: "Digital Marketing", value: "digital marketing" },
  { label: "Business", value: "business" },
  { label: "Photography", value: "photography" },
  { label: "Registered", value: "registered" },
]
export const apiDocs = {
  basepath: process.env.NEXT_PUBLIC_BASEPATH || "http://localhost:5071/api/v1/",
}
