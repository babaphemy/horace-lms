import BackendCourseDetail from "@/components/courses/BackendCourseDetail"
import SkillTrackDetail from "@/components/courses/SkillTrackDetail"
import { getSkillTrack } from "@/data/skillTracks"

interface CourseDetailPageProps {
  params: Promise<{ cid: string }>
}

const CourseDetailPage = async ({ params }: CourseDetailPageProps) => {
  const { cid } = await params
  const track = getSkillTrack(cid)

  return track ? <SkillTrackDetail track={track} /> : <BackendCourseDetail />
}

export default CourseDetailPage
