import Link from 'next/link';

const ContactLms: React.FC = () => (
  <div className="bg-blue-600 text-white text-center p-8">
    <div className='max-w-7xl mx-auto'>
      <h2 className="text-2xl font-semibold">
        Get Started with Horace LMS Today!
      </h2>
      <p className="mt-4">
        Contact us to schedule a demo or sign up for a free trial.
      </p>
      <Link href="/contact" passHref>
        <button className="mt-4 bg-white hover:bg-gray-100 text-blue-600 font-bold py-2 px-6 rounded">
          Contact Us
        </button>
      </Link>
    </div>
  </div>
);
export default ContactLms;
