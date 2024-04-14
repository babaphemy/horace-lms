interface SchoolLogo {
  imageUrl: string;
  websiteUrl?: string; // Optional if you want to make the logos clickable
  altText: string;
}

const logos: SchoolLogo[] = [
  {
    imageUrl: '/img/champion.png',
    websiteUrl: '/login',
    altText: 'Champions Academy',
  },
  {
    imageUrl: '/img/topbrains.png',
    websiteUrl: '/login',
    altText: 'Top Brains Academy',
  },
  {
    imageUrl: '/img/trove.jpeg',
    websiteUrl: '/login',
    altText: 'Trove High School',
  },
  {
    imageUrl: '/img/forte.png',
    websiteUrl: '/login',
    altText: 'Forte Kids Texas',
  },
];

const SchoolLogos = () => {
  return (
    <div className="bg-gray-100 p-8">
      <h2 className="text-3xl font-semibold text-center mb-6">
        Trusted by Leading Schools
      </h2>
      <div className="flex flex-wrap justify-center items-center gap-10">
        {logos.map((logo, index) => (
          <a
            key={index}
            href={logo.websiteUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={logo.imageUrl}
              alt={logo.altText}
              className="h-12 md:h-24"
            />
          </a>
        ))}
      </div>
    </div>
  );
};
export default SchoolLogos;
