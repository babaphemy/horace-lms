export type LabEnvironment = "browser" | "local-vm" | "hybrid"

export type PlaygroundToolId =
  | "hash"
  | "crypto"
  | "cert"
  | "packets"
  | "logs"
  | "detection"
  | "controls"
  | "network"
  | "iam"
  | "phishing"
  | "tabletop"
  | "forms"

export interface ToolResult {
  tool: PlaygroundToolId
  rule?: string
  passed: boolean
  message: string
  data?: Record<string, unknown>
}

export interface ToolProps<S = Record<string, unknown>> {
  fixture?: unknown
  state: S
  onChange: (_next: S) => void
  onResult: (_result: ToolResult) => void
}

export interface LabStep {
  id: string
  title: string
  instructions: string
  evidence: "note" | "tool-result" | "file-link" | "none"
  autoCheck?: { tool: PlaygroundToolId; rule: string }
}

export interface LabDefinition {
  slug: string
  domain: 1 | 2 | 3 | 4 | 5 | null
  environment: LabEnvironment
  estimatedMinutes: number
  objective: string
  prerequisites: string[]
  steps: LabStep[]
  tools: PlaygroundToolId[]
  fixtures?: Record<string, string>
  deliverables: string[]
  rubric: { id: string; label: string; description: string }[]
  skills: string[]
}
