interface SchoolLogo {
  imageUrl: string
  websiteUrl?: string
  altText: string
}

const logos: SchoolLogo[] = [
  {
    imageUrl: "/img/champion.png",
    websiteUrl: "/login",
    altText: "Champions Academy",
  },
  {
    imageUrl: "/img/topbrains.png",
    websiteUrl: "/login",
    altText: "Top Brains Academy",
  },
  {
    imageUrl: "/img/trove.jpeg",
    websiteUrl: "/login",
    altText: "Trove High School",
  },
  {
    imageUrl: "/img/forte.png",
    websiteUrl: "/login",
    altText: "Forte Kids Texas",
  },
]

const SchoolLogos = () => {
  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Trusted by Leading Schools and Corporates
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 items-center justify-items-center">
          {logos.map((logo, index) => (
            <a
              key={index}
              href={logo.websiteUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={logo.altText}
              title={logo.altText}
              className="transition-transform hover:scale-105"
            >
              <img
                src={logo.imageUrl}
                alt={logo.altText}
                className="h-16 sm:h-20 object-contain"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SchoolLogos
