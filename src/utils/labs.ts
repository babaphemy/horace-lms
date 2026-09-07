import { LessonDto } from "@/types/types"

export type LabSubmissionStatus = "Submitted" | "In Review" | "Reviewed"
export type LabReviewOutcome = "Pass" | "Revise"

export interface LabCheckpoint {
  id: string
  label: string
  hint: string
  keyword?: string
  minimumLength?: number
}

export interface LabSubmission {
  id: string
  courseId: string
  lessonId: string
  lessonTitle: string
  artifactUrl: string
  notes: string
  status: LabSubmissionStatus
  outcome: LabReviewOutcome
  public: boolean
  submittedAt: string
  skills: string[]
}

const LAB_TYPES = ["code", "handson", "hands-on", "lab", "project", "exercise"]

export const labKeywords = [
  "lab",
  "project",
  "build",
  "practice",
  "hands-on",
  "hands on",
  "exercise",
  "implement",
  "prototype",
]

export function isHandsOnLesson(lesson?: LessonDto | null) {
  if (!lesson) return false

  const type = lesson.type?.toLowerCase() || ""
  const title = lesson.title?.toLowerCase() || ""
  const content = lesson.content?.toLowerCase() || ""

  return (
    LAB_TYPES.includes(type) ||
    labKeywords.some(
      (keyword) => title.includes(keyword) || content.includes(keyword)
    )
  )
}

export function getLabCheckpoints(lessonTitle: string): LabCheckpoint[] {
  const normalizedTitle = lessonTitle || "this lab"

  return [
    {
      id: "plan",
      label: "Explain your implementation plan",
      hint: `Add a short plan for ${normalizedTitle} before submitting.`,
      minimumLength: 80,
    },
    {
      id: "artifact",
      label: "Attach or link the final artifact",
      hint: "Paste a repo, document, file, demo, or in-platform artifact link.",
      keyword: "artifact",
    },
    {
      id: "reflection",
      label: "Document what changed after testing",
      hint: "Include a test note, checkpoint result, or revision decision.",
      keyword: "test",
    },
  ]
}

export function getLabWorkspaceKey(courseId: string, lessonId: string) {
  return `horace.lab.workspace.${courseId}.${lessonId}`
}

export function getLabSubmissionsKey(userId: string) {
  return `horace.lab.submissions.${userId || "guest"}`
}

export function createSubmissionId(courseId: string, lessonId: string) {
  return `${courseId}-${lessonId}-${Date.now()}`
}
