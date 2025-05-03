import {
  AccountTreeRounded,
  CardGiftcard,
  MobileFriendly,
  Payment,
} from "@mui/icons-material"
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings"
import AnalyticsIcon from "@mui/icons-material/Analytics"
import BiotechIcon from "@mui/icons-material/Biotech"
import CastForEducationIcon from "@mui/icons-material/CastForEducation"
import HowToRegIcon from "@mui/icons-material/HowToReg"
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks"
import MarkUnreadChatAltIcon from "@mui/icons-material/MarkUnreadChatAlt"
import PersonIcon from "@mui/icons-material/Person"
import QuizIcon from "@mui/icons-material/Quiz"
import SchoolIcon from "@mui/icons-material/School"
import SecurityIcon from "@mui/icons-material/Security"
import { Feature } from "../../../types/types"
import FeatureCard from "./FeatureCard"

const features: Feature[] = [
  {
    icon: HowToRegIcon,
    title: "Automated Enrollment",
    description:
      "Streamline your student intake with automated enrollment processes.",
  },
  {
    icon: SchoolIcon,
    title: "Course and Classroom Management",
    description:
      "Easily create, manage, and distribute course materials from a single dashboard.",
  },
  {
    icon: PersonIcon,
    title: "Student Information Management ",
    description:
      "Monitor student progress and generate reports in just a few clicks.",
  },
  {
    icon: CastForEducationIcon,
    title: "AI Agent",
    description: "AI agent for course creation and content generation.",
  },
  {
    icon: AdminPanelSettingsIcon,
    title: "Admin Management ",
    description:
      "Manage videos, assets, certificates, video encoding and transcoding.",
  },
  {
    icon: MarkUnreadChatAltIcon,
    title: "Messaging System ",
    description: "Email, SMS and in-app communication between all users.",
  },
  {
    icon: LibraryBooksIcon,
    title: "Digital Library ",
    description:
      "Share and access books and resources from top libraries globally.",
  },
  {
    icon: AnalyticsIcon,
    title: "Reporting, AI & Analytics ",
    description:
      "AI powered reports and insightful vizualizations to monitor and measure performance and advise for improvement.",
  },
  {
    icon: QuizIcon,
    title: "CBT",
    description: "Create and manage Computer Based Tests for your students.",
  },
  {
    icon: BiotechIcon,
    title: "Hands-on Projects ",
    description:
      "Build and manage hands-on projects in Robotics, AI, Game Development, and Animation.",
  },
  {
    icon: SecurityIcon,
    title: "Security & Privacy ",
    description:
      "Role based access control of resources and enhanced security of data with periodic back-up.",
  },
  {
    icon: MobileFriendly,
    title: "Mobile Accessibility ",
    description: "Responsive and mobile first design .",
  },
  {
    icon: Payment,
    title: "Payment System ",
    description: "Automated fee and transaction management and payment system.",
  },
  {
    icon: AccountTreeRounded,
    title: "API Integration ",
    description:
      "Well documented API for integration with other systems and platforms.",
  },
  {
    icon: CardGiftcard,
    title: "Schorlaship Management",
    description: "Manage schorlaship and awards for students.",
  },
]
const FeatureList: React.FC = () => (
  <div className="p-8 max-w-7xl mx-auto">
    <h2 className="text-3xl md:text-4xl font-semibold text-center my-10">
      Key Features
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10 ">
      {features.map((feature, index) => (
        <FeatureCard key={index} feature={feature} />
      ))}
    </div>
  </div>
)
export default FeatureList
