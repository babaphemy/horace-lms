/** @type {import('next').NextConfig} */

const courseIds = [
  "625beae7d4b3d163a5815639",
  "6266f9316bffde18912c3d87",
  "6285aed1097cff07b6a35dd5",
  "6287c046e8e4a635121b2c95",
  "6287c221e8e4a635121b2c96",
  "63ea9695f452fa6b117fc259",
  "63efc71ef1320354973713e5",
  "640e41ce5c17f2405a1721f7",
  "64128ebb4441e53dfbbe8fa8"
]

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
    // const courseDetailPathMap = courseIds?.reduce((acc, course) => {
    //   acc[`/course/detailb`] = {
    //     page: '/courses/detailb',
    //     query: { cid: course },
    //   };

    //   return acc;
    // }, {});
    return {
      // ...courseDetailPathMap,
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


