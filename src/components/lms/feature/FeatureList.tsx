import {
  AccountTreeRounded,
  AssignmentTurnedInRounded,
  BuildRounded,
  GroupsRounded,
  WorkspacePremiumRounded,
} from "@mui/icons-material"
import AnalyticsIcon from "@mui/icons-material/Analytics"
import MarkUnreadChatAltIcon from "@mui/icons-material/MarkUnreadChatAlt"
import QuizIcon from "@mui/icons-material/Quiz"
import { Feature } from "../../../types/types"
import FeatureCard from "./FeatureCard"

const features: Feature[] = [
  {
    icon: AccountTreeRounded,
    title: "Role-Based Skill Tracks",
    description:
      "Programs are organized around target roles, outcomes, duration, level, and the practical skills learners need to prove.",
  },
  {
    icon: BuildRounded,
    title: "Hands-On Labs",
    description:
      "Every track moves learners into guided labs, checkpoints, and project work instead of passive content only.",
  },
  {
    icon: QuizIcon,
    title: "Checkpoint Feedback",
    description:
      "Automated checks and mentor review points help learners correct course before final submission.",
  },
  {
    icon: GroupsRounded,
    title: "Mentor Support",
    description:
      "Learners can get contextual help, book sessions, and receive project feedback tied to their active track.",
  },
  {
    icon: AssignmentTurnedInRounded,
    title: "Reviewed Projects",
    description:
      "Submissions can move from submitted to in review to pass or revise with rubrics that keep feedback actionable.",
  },
  {
    icon: WorkspacePremiumRounded,
    title: "Portfolio And Certificates",
    description:
      "Passed projects become portfolio entries and verified certificates list the specific competencies demonstrated.",
  },
  {
    icon: AnalyticsIcon,
    title: "Progress Analytics",
    description:
      "Learners and teams can see completed labs, verified skills, and progress toward job-readiness.",
  },
  {
    icon: MarkUnreadChatAltIcon,
    title: "Contextual Q&A",
    description:
      "Questions stay attached to the lab, lesson, and learner context so mentors can answer faster.",
  },
]
const FeatureList: React.FC = () => (
  <div className="px-4 py-16 max-w-7xl mx-auto">
    <p className="text-center font-bold uppercase text-[#00A9C1]">
      Platform workflow
    </p>
    <h2 className="text-3xl md:text-5xl font-extrabold text-center mt-3 mb-5 text-gray-900">
      Learn, build, get reviewed, and publish proof.
    </h2>
    <p className="text-center text-gray-600 max-w-3xl mx-auto text-lg">
      Horace combines structured curriculum with the practical workspace and
      mentorship layer learners need to turn training into evidence.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10 ">
      {features.map((feature, index) => (
        <FeatureCard key={index} feature={feature} />
      ))}
    </div>
  </div>
)
export default FeatureList
