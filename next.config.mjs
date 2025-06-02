/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "youtube.com",
      },
      {
        protocol: "https",
        hostname: "essluploads.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "essluploads2.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "horacevids2.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "essl.b-cdn.net",
      },
    ],
  },
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "media-src 'self' https://essl.b-cdn.net https://horacevids.s3.amazonaws.com",
              "img-src 'self' femi.b-cdn.net essl.b-cdn.net data: blob: *.youtube.com *.ytimg.com essluploads.s3.amazonaws.com essluploads2.s3.amazonaws.com *.googleusercontent.com",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googletagmanager.com *.youtube.com *.stripe.com *.googleads.g.doubleclick.net",
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
              "font-src 'self' fonts.gstatic.com",
              "connect-src 'self' *.googletagmanager.com *.google-analytics.com https://*.google.com https://horacelms.com http://localhost:8000 http://localhost:5071 https://essluploads.s3.amazonaws.com https://troveapi.horacelearning.us https://treasureapi.horacelearning.us *.horacelearning.us https://al-ihsan.horacelearning.com *.horacelearning.com *.s3.amazonaws.com https://essl.b-cdn.net",
              "frame-src 'self' *.youtube.com *.youtube-nocookie.com *.stripe.com *.td.doubleclick.net *.googletagmanager.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ]
  },
  trailingSlash: true,
}

export default nextConfig
