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
export const AccessRoles = {
  ADMIN: "ROLE_ADMIN",
  INSTRUCTOR: "ROLE_INSTRUCTOR",
  STUDENT: "ROLE_STUDENT",
  USER: "ROLE_USER",
  GUEST: "ROLE_GUEST",
} as const
export type AccessRole = (typeof AccessRoles)[keyof typeof AccessRoles]

/**
 * Returns the key (role name) for a given AccessRole value
 * @param roleValue - The role value
 * @returns The role key (e.g., "INSTRUCTOR") or undefined
 */
export const getAccessRoleKey = (
  roleValue: string | undefined
): string | undefined => {
  if (!roleValue) return undefined
  return Object.keys(AccessRoles).find(
    (key) => AccessRoles[key as keyof typeof AccessRoles] === roleValue
  )
}
