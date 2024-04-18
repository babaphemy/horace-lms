import Link from 'next/link';

const ContactLms: React.FC = () => (
  <div className="bg-blue-600 text-white text-center p-8">
    <h2 className="text-2xl font-semibold">
      Get Started with Horace LMS Today!
    </h2>
    <p className="mt-4">
      Contact us to schedule a demo or sign up for a free trial.
    </p>
    <Link href="/contact" passHref>
      <button className="mt-4 bg-blue-700 hover:bg-blue-800 font-bold py-2 px-6 rounded">
        Contact Us
      </button>
    </Link>
  </div>
);
export default ContactLms;
