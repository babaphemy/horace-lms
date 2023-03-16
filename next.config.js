/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	experimental: {
        images: {
            unoptimized: true
        }
    },
    exportPathMap: async function (
        defaultPathMap,
        { dev, dir, outDir, distDir, buildId }
    ) {
        return {
            '/': { page: '/' },
            '/home': { page: '/' },
            '/sign-up': { page: '/sign-up' },
            '/login': { page: '/login' },
            '/about': { page: '/about' },
            '/contact': { page: '/contact' },
            '/user/confirmed': { page: '/user/confirmed' }
        }
    },
    trailingSlash: true,
};

module.exports = nextConfig;
