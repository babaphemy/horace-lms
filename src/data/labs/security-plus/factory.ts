import { LabDefinition, LabEnvironment, PlaygroundToolId } from "../types"

const defaultRubric = [
  {
    id: "analysis",
    label: "Accurate analysis",
    description: "Findings are supported by the supplied evidence.",
  },
  {
    id: "execution",
    label: "Complete workflow",
    description: "Every required action and checkpoint is completed.",
  },
  {
    id: "communication",
    label: "Clear documentation",
    description:
      "The submission explains decisions and recommended next steps.",
  },
]

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function lab(
  title: string,
  domain: LabDefinition["domain"],
  environment: LabEnvironment,
  tools: PlaygroundToolId[],
  objective: string,
  actions: string[],
  deliverables: string[],
  skills: string[]
): LabDefinition {
  return {
    slug: slugify(title),
    domain,
    environment,
    estimatedMinutes: environment === "local-vm" ? 60 : 45,
    objective,
    prerequisites:
      environment === "browser" ? [] : ["Build a safe cybersecurity lab"],
    tools,
    steps: actions.map((title, index) => ({
      id: `step-${index + 1}`,
      title,
      instructions: `${title}. Record the evidence you used and explain the decision you made.`,
      evidence:
        index === actions.length - 1
          ? "file-link"
          : tools.length
            ? "tool-result"
            : "note",
      autoCheck:
        index === 1 && tools[0]
          ? { tool: tools[0], rule: "complete" }
          : undefined,
    })),
    deliverables,
    rubric: defaultRubric,
    skills,
  }
}
