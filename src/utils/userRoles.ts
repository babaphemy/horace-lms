import { AccessRoles } from "@/utils/roles"

export function normalizeRoles(value: unknown): string[] {
  const roles =
    typeof value === "string" ? [value] : Array.isArray(value) ? value : []
  return [
    ...new Set(
      roles
        .filter(
          (role): role is string =>
            typeof role === "string" && role.trim().length > 0
        )
        .map((role) => role.trim())
    ),
  ]
}

export function buildRoleUpdate(id: string, roles: string[]) {
  const normalized = normalizeRoles(roles)
  if (!id.trim() || normalized.length === 0)
    throw new Error("A user and at least one role are required.")
  if (
    normalized.some(
      (role) => !Object.values(AccessRoles).some((known) => known === role)
    )
  )
    throw new Error("One or more roles are unsupported by this editor.")
  return { id, roles: normalized }
}
