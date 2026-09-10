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
  userId: string
  courseId: string
  lessonId: string
  lessonTitle: string
  artifactUrl: string
  notes: string
  status: LabSubmissionStatus
  outcome?: LabReviewOutcome
  public: boolean
  submittedAt: string
  dueAt: string
  skills: string[]
  reviewerComments?: string
  rubricScores?: Record<string, string>
  reviewedAt?: string
}

export interface SkillCertificate {
  id: string
  certificateId: string
  verificationCode: string
  learnerName: string
  userId: string
  trackTitle: string
  issuedAt: string
  projectIds: string[]
  projects: {
    title: string
    artifactUrl: string
  }[]
  skills: string[]
  competencies: string[]
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

export function getAllLabSubmissionsKey() {
  return "horace.lab.submissions.all"
}

export function getLabNotificationsKey(userId: string) {
  return `horace.lab.notifications.${userId || "guest"}`
}

export function getSkillCertificatesKey(userId: string) {
  return `horace.skill.certificates.${userId || "guest"}`
}

export function getAllSkillCertificatesKey() {
  return "horace.skill.certificates.all"
}

export function createSubmissionId(courseId: string, lessonId: string) {
  return `${courseId}-${lessonId}-${Date.now()}`
}

export function createSkillCertificateId(userId: string) {
  return `HLS-${userId || "guest"}-${Date.now()}`
}

export function createVerificationCode(certificateId: string) {
  return certificateId.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
}

export function getLabRubric() {
  return [
    {
      id: "requirements",
      label: "Meets lab requirements",
      description: "The submitted artifact addresses the required scenario.",
    },
    {
      id: "testing",
      label: "Testing and checkpoints",
      description:
        "The learner documented test results or checkpoint evidence.",
    },
    {
      id: "documentation",
      label: "Documentation quality",
      description:
        "The notes explain the approach, tradeoffs, and final state.",
    },
  ]
}
