import { skillTracks, type SkillTrack } from "@/data/skillTracks"
import type { LabSubmission } from "@/utils/labs"

export function getLabTrackId(title: string) {
  const matches = skillTracks.filter((track) =>
    track.modules.some((module) => module.lab === title)
  )
  return matches.length === 1 ? matches[0].id : undefined
}

export function belongsToTrack(submission: LabSubmission, track: SkillTrack) {
  // Legacy classroom submissions use backend course IDs. Resolve only exact,
  // uniquely registered module titles, never overlapping competency names.
  const trackId =
    submission.trackId ||
    (skillTracks.some((item) => item.id === submission.courseId)
      ? submission.courseId
      : getLabTrackId(submission.lessonTitle))
  return (
    trackId === track.id &&
    track.modules.some((module) => module.lab === submission.lessonTitle)
  )
}

export function getTrackEligibility(
  track: SkillTrack,
  submissions: LabSubmission[]
) {
  const projects = submissions.filter(
    (submission) =>
      belongsToTrack(submission, track) &&
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
