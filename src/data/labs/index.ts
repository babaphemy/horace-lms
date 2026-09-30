import { m1 } from "./security-plus/m1"
import { m2 } from "./security-plus/m2"
import { m3 } from "./security-plus/m3"
import { m4 } from "./security-plus/m4"
import { m5 } from "./security-plus/m5"
import { m6 } from "./security-plus/m6"
import { m7 } from "./security-plus/m7"
import { slugify } from "./security-plus/factory"

export * from "./types"
export { slugify }

export const labDefinitions = [...m1, ...m2, ...m3, ...m4, ...m5, ...m6, ...m7]
const registry = new Map(
  labDefinitions.map((definition) => [definition.slug, definition])
)

export function getLabDefinition(lessonTitle: string) {
  return registry.get(slugify(lessonTitle))
}
