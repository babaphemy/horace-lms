import type { LabStep, ToolResult } from "@/data/labs/types"

export function checkpointsReady(
  statuses: ("pending" | "recorded" | "passed")[]
) {
  return statuses.length > 0 && statuses.every((status) => status !== "pending")
}

export function isArtifactUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === "https:" || url.protocol === "http:"
  } catch {
    return false
  }
}

export function getCheckpointStatus(
  step: LabStep,
  evidence: string,
  results: Record<string, ToolResult>
): "pending" | "recorded" | "passed" {
  if (step.autoCheck) {
    const result = results[step.autoCheck.tool]
    return result?.rule === step.autoCheck.rule && result.passed
      ? "passed"
      : "pending"
  }
  if (step.evidence === "file-link") {
    return isArtifactUrl(evidence.trim()) ? "recorded" : "pending"
  }
  return evidence.trim().length >= 20 ? "recorded" : "pending"
}
