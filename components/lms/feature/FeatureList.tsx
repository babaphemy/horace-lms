import { Feature } from '../../../types/types';
import FeatureCard from './FeatureCard';

const features: Feature[] = [
  {
    icon: '/icons/feature-icon1.svg',
    title: 'Automated Enrollment',
    description:
      'Streamline your student intake with automated enrollment processes.',
  },
  {
    icon: '/icons/feature-icon2.svg',
    title: 'Course Management Tools',
    description:
      'Easily create, manage, and distribute course materials from a single dashboard.',
  },
  {
    icon: '/icons/feature-icon3.svg',
    title: 'Performance Tracking',
    description:
      'Monitor student progress and generate reports in just a few clicks.',
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
