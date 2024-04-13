import { Plan } from '../../../types/types';
import PricingPlan from './PricingPlan';

const Pricing: React.FC = () => {
  const plans: Plan[] = [
    {
      name: 'Basic',
      price: '$10/month',
      description: 'Ideal for small schools or individual educators.',
    },
    {
      name: 'Professional',
      price: '$30/month',
      description: 'Perfect for mid-sized schools with additional features.',
    },
    {
      name: 'Enterprise',
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
          href="/path_to_your_brochure/Horace_LMS_Brochure.pdf"
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
