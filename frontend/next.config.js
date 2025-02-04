/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "api.nour.com",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "admin.nour.com",
        pathname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/api/auth/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*.nour.com" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  }, // end headers
  async redirects() {
    return [
      {
        source: "/store/:domain/settings",
        destination: "/store/:domain/settings/general",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "accounts.nour.com",
          },
        ],
        destination: "/accounts/:path*",
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "admin.nour.com",
          },
        ],
        destination: "/admin/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
