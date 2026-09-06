import Link from "next/link"

const ContactLms: React.FC = () => (
  <section className="bg-[#0F5E76] text-white py-16 text-center">
    <div className="max-w-4xl mx-auto px-6">
      <h2 className="text-3xl md:text-5xl font-extrabold text-balance">
        Start with a track, leave with proof of skill.
      </h2>
      <p className="mt-4 text-lg text-white/85">
        Explore practical tracks for individuals or build a hands-on upskilling
        program for your team.
      </p>
      <Link
        href="/courses"
        passHref
        className="inline-block mt-6 bg-white text-[#0F5E76] font-semibold py-3 px-6 rounded shadow hover:bg-gray-100 transition-colors duration-200"
      >
        Browse Skill Tracks
      </Link>
    </div>
  </section>
)

export default ContactLms
