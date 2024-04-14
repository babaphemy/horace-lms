import { Feature } from '../../../types/types';
import FeatureCard from './FeatureCard';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import QuizIcon from '@mui/icons-material/Quiz';
import BiotechIcon from '@mui/icons-material/Biotech';
import SecurityIcon from '@mui/icons-material/Security';
import {
  AccountTreeRounded,
  CardGiftcard,
  MobileFriendly,
  Payment,
} from '@mui/icons-material';

const features: Feature[] = [
  {
    icon: HowToRegIcon,
    title: 'Automated Enrollment',
    description:
      'Streamline your student intake with automated enrollment processes.',
  },
  {
    icon: SchoolIcon,
    title: 'Course and Classroom Management',
    description:
      'Easily create, manage, and distribute course materials from a single dashboard.',
  },
  {
    icon: PersonIcon,
    title: 'Student Information Management ',
    description:
      'Monitor student progress and generate reports in just a few clicks.',
  },
  {
    icon: CastForEducationIcon,
    title: 'Staff Information Management ',
    description:
      'Monitor staff progress, activities and generate reports in just a few clicks.',
  },
  {
    icon: AdminPanelSettingsIcon,
    title: 'Admin Management ',
    description:
      'A small ERP that empowers you to manage your school from your phone or a laptop.',
  },
  {
    icon: MarkUnreadChatAltIcon,
    title: 'Messaging System ',
    description: 'Email, SMS and in-app communication between all users.',
  },
  {
    icon: LibraryBooksIcon,
    title: 'Digital Library ',
    description:
      'Share and access books and resources from top libraries globally.',
  },
  {
    icon: AnalyticsIcon,
    title: 'Reporting, AI & Analytics ',
    description:
      'AI powered reports to monitor and measure students performance and advise for improvement.',
  },
  {
    icon: QuizIcon,
    title: 'CBT',
    description: 'Create and manage Computer Based Tests for your school.',
  },
  {
    icon: BiotechIcon,
    title: 'STEM Handson Projects ',
    description:
      'Robotics, AI and animation project for all students and teachers.',
  },
  {
    icon: SecurityIcon,
    title: 'Security & Privacy ',
    description:
      'Role based access control of resources and enhanced security of school data with periodic back-up.',
  },
  {
    icon: SchoolIcon,
    title: 'LMS Integration & Customization ',
    description: 'Integration to leading LMS solutions like Google Classroom.',
  },
  {
    icon: MobileFriendly,
    title: 'Mobile Accessibility ',
    description: 'Responsive and mobile first design .',
  },
  {
    icon: Payment,
    title: 'Tuition Payment System ',
    description:
      'Automated fee and transaction management system. Manage debtors with just a click',
  },
  {
    icon: AccountTreeRounded,
    title: 'Attendance Management System ',
    description: 'Manage student and staff attendance .',
  },
  {
    icon: CardGiftcard,
    title: 'Schorlaship Management',
    description: 'Manage schorlaship and awards for students and staff.',
  },
];
const FeatureList: React.FC = () => (
  <div className="p-8 bg-gray-100">
    <h2 className="text-3xl font-semibold text-center mb-10">Key Features</h2>
    <div className="flex flex-wrap justify-center gap-10">
      {features.map((feature, index) => (
        <FeatureCard key={index} feature={feature} />
      ))}
    </div>
  </div>
);
export default FeatureList;
