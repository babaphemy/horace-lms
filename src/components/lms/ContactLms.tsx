import Link from "next/link"

const ContactLms: React.FC = () => (
  <section className="bg-blue-600 text-white py-12 text-center">
    <div className="max-w-4xl mx-auto px-6">
      <h2 className="text-3xl font-bold text-balance">
        Get Started with Horace LMS Today!
      </h2>
      <p className="mt-4 text-lg">
        Contact us to schedule a demo or sign up for a free trial.
      </p>
      <Link
        href="/contact"
        passHref
        className="inline-block mt-6 bg-white text-blue-600 font-semibold py-2 px-6 rounded shadow hover:bg-gray-100 transition-colors duration-200"
      >
        Contact Us
      </Link>
    </div>
  </section>
)

export default ContactLms
