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
        hostname: "material-ui.com",
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
              "media-src 'self' https://essl.b-cdn.net https://horacevids.s3.amazonaws.com https://horacelms.com",
              "img-src 'self' femi.b-cdn.net essl.b-cdn.net data: blob: *.youtube.com *.ytimg.com essluploads.s3.amazonaws.com essluploads2.s3.amazonaws.com *.googleusercontent.com *.google.com https://google.com *.googleadservices.com *.doubleclick.net https://material-ui.com",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googletagmanager.com *.youtube.com *.stripe.com *.googleads.g.doubleclick.net *.googleadservices.com *.google.com https://google.com http://unpkg.com/pdfjs-dist@5.3.31/legacy/build/pdf.worker.min.mjs",
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
              "font-src 'self' fonts.gstatic.com",
              "connect-src 'self' *.googletagmanager.com *.google-analytics.com *.google.com https://google.com *.googleadservices.com *.doubleclick.net https://horacelms.com https://essluploads.s3.amazonaws.com https://troveapi.horacelearning.us https://treasureapi.horacelearning.us *.horacelearning.us https://al-ihsan.horacelearning.com *.horacelearning.com *.s3.amazonaws.com https://essl.b-cdn.net https://robiatschools.com",
              "frame-src 'self' *.youtube.com *.youtube-nocookie.com *.stripe.com *.doubleclick.net *.googletagmanager.com *.googleadservices.com",
              "frame-ancestors 'none'",
              "worker-src 'self' blob:;",
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
