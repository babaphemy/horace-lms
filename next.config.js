/** @type {import('next').NextConfig} */

const fetchCourses = async () => {
  const response = await fetch(
    `https://horacelearning.com/api/v1/course/courses`,
    {
      headers: { Authorization: `Basic ${process.env.NEXT_PUBLIC_APIKEY}` },
    }
  );
  if (!response.ok) {
    return { error: response.status };
  }
  const data = response.json();
  return data;
};

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    images: {
      unoptimized: true,
    },
  },
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    const coursesData = await fetchCourses();
    const courses = coursesData;
    const courseDetailPathMap = courses?.reduce((acc, course) => {
      acc[`/course/detailb`] = {
        page: '/courses/detailb',
        query: { cid: course.id },
      };

      return acc;
    }, {});

    return {
      ...courseDetailPathMap,
      '/': { page: '/' },
      '/home': { page: '/' },
      '/sign-up': { page: '/sign-up' },
      '/login': { page: '/login' },
      '/forgot-password': { page: '/forgot-password' },
      '/forgot-password/reset': { page: '/forgot-password/reset' },
      '/about': { page: '/about' },
      '/contact': { page: '/contact' },
      '/courses': { page: '/courses' },
      '/course/classroom': { page: '/course/classroom' },
      '/user/confirmed': { page: '/user/confirmed' },
    };
  },
  trailingSlash: true,
};

module.exports = nextConfig;
