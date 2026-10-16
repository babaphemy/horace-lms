import type { SkillTrack } from "@/data/skillTracks"
import type { LabSubmission } from "@/utils/labs"

export function getTrackEligibility(
  track: SkillTrack,
  submissions: LabSubmission[]
) {
  const projects = submissions.filter(
    (submission) =>
      submission.courseId === track.id &&
      submission.status === "Reviewed" &&
      submission.outcome === "Pass" &&
      track.modules.some((module) => module.lab === submission.lessonTitle)
  )
  const missingProjects = track.modules.filter(
    (module) => !projects.some((project) => project.lessonTitle === module.lab)
  )
  const skills = new Set(projects.flatMap((project) => project.skills))
  const missingSkills = track.skills.filter((skill) => !skills.has(skill))
  return {
    projects,
    missingProjects,
    skills,
    missingSkills,
    eligible:
      projects.length > 0 &&
      missingProjects.length === 0 &&
      missingSkills.length === 0,
  }
}
