interface Plan {
  name: string;
  price: string;
  description: string;
}

interface PricingPlanProps {
  plan: Plan;
}

const PricingPlan: React.FC<PricingPlanProps> = ({ plan }) => (
  <div className="max-w-md rounded overflow-hidden shadow-lg bg-white p-6 text-center">
    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
    <p className="text-gray-700 mb-4">{plan.description}</p>
    <span className="text-2xl font-bold">{plan.price}</span>
    <div className="mt-4">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Choose Plan
      </button>
    </div>
  </div>
);
export default PricingPlan;
