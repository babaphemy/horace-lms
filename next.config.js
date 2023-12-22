/** @type {import('next').NextConfig} */

const courseIds = [
  "657d3543437cba483c41e07c",
  "657d3585437cba483c41e07d",
  "657d35a8437cba483c41e07e",
  "657d35ce437cba483c41e07f",
  "657d35f2437cba483c41e080",
  "657d3613437cba483c41e081",
  "657d364f437cba483c41e082",
]

const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  experimental: {
    images: {
      unoptimized: true,
      caches: true 
    },
  },
  async headers() {
    return [
      {
        source: '/(.*).(js|css|jpg|jpeg|png|gif|ico|svg|webp|woff|woff2|eot|ttf|otf)$', 
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000', 
          },
        ],
      },
    ];
  },
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    const courseDetailPathMap = courseIds?.reduce((acc, course) => {
      acc[`/course/detailb`] = {
        page: '/course/detailb',
        query: { cid: course },
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
      '/user/confirmed': { page: '/user/confirmed' }
    };
  },
  trailingSlash: true,
};

module.exports = nextConfig;


