export const AccessRoles = {
  ADMIN: "ROLE_ADMIN",
  INSTRUCTOR: "ROLE_INSTRUCTOR",
  MENTOR: "ROLE_MENTOR",
  STUDENT: "ROLE_STUDENT",
  USER: "ROLE_USER",
  GUEST: "ROLE_GUEST",
} as const

export type AccessRole = (typeof AccessRoles)[keyof typeof AccessRoles]
