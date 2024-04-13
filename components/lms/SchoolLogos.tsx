interface SchoolLogo {
  imageUrl: string;
  websiteUrl?: string; // Optional if you want to make the logos clickable
  altText: string;
}

const logos: SchoolLogo[] = [
  {
    imageUrl: '/logos/school1.png',
    websiteUrl: 'https://www.school1.edu',
    altText: 'School 1 Logo',
  },
  {
    imageUrl: '/logos/school2.png',
    websiteUrl: 'https://www.school2.edu',
    altText: 'School 2 Logo',
  },
  {
    imageUrl: '/logos/school3.png',
    websiteUrl: 'https://www.school3.edu',
    altText: 'School 3 Logo',
  },
  // Add more logos as needed
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
