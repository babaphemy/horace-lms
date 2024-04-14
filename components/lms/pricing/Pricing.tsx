import { Plan } from '../../../types/types';
import PricingPlan from './PricingPlan';

const Pricing: React.FC = () => {
  const plans: Plan[] = [
    {
      name: 'Mars',
      price: '$10/month',
      description: 'Ideal for small schools or individual educators.',
    },
    {
      name: 'Saturn',
      price: '$30/month',
      description: 'Perfect for mid-sized schools with additional features.',
    },
    {
      name: 'Jupiter',
      price: 'Custom Pricing',
      description: 'Custom solutions for large institutions or districts.',
    },
  ];

  return (
    <div className="p-8 bg-gray-200">
      <h2 className="text-3xl font-semibold text-center mb-10">
        Pricing Plans
      </h2>
      <div className="flex flex-wrap justify-center gap-10">
        {plans.map((plan, index) => (
          <PricingPlan key={index} plan={plan} />
        ))}
      </div>
      <div className="text-center mt-10">
        <a
          href="https://essluploads.s3.amazonaws.com/HoraceProposal.pdf"
          target="_blank"
          rel="nofollow"
          download="Horace_LMS_Brochure.pdf"
        >
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Download Our Brochure
          </button>
        </a>
      </div>
    </div>
  );
};

export default Pricing;
