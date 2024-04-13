import { Feature } from '../../../types/types';

interface FeatureCardProps {
  feature: Feature;
}
const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => (
  <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-6">
    <img className="w-16 h-16 mb-4" src={feature.icon} alt="Feature icon" />
    <div className="font-bold text-xl mb-2">{feature.title}</div>
    <p className="text-gray-700 text-base">{feature.description}</p>
  </div>
);
export default FeatureCard;
