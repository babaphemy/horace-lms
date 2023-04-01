/** @type {import('next').NextConfig} */

const fetchCourses = async () => {
  const response = await fetch(
    `https://horacelearning.com/api/v1/course/ids`,
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
  exportPathMap: async function () {
    const paths = {
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
    const courseIds = await fetchCourses();
    courseIds.forEach((courseId) => {
      paths[`/course/detailb/${courseId}`] = {
        page: '/course/detailb/[cid]',
        query: { cid: courseId },
      };
    });

    return paths;
  },
  trailingSlash: true,
};

module.exports = nextConfig;
