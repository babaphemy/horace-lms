import { Feature } from '../../../types/types';

interface FeatureCardProps {
  feature: Feature;
}
const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  const Icon = feature.icon;
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-6">
      <Icon />
      <div className="font-bold text-xl mb-2">{feature.title}</div>
      <p className="text-gray-700 text-base">{feature.description}</p>
    </div>
  );
};
export default FeatureCard;
