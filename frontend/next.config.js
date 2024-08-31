/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'api.nour.com',
          pathname: '**',
        },
      ]
    },
    async headers() {
      return [
        {
          source: '/api/auth/:path*',
          headers: [
            {
              key: 'Access-Control-Allow-Origin',
              value: 'http://admin.nour.com',
            },
            {
              key: 'Access-Control-Allow-Methods',
              value: 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
            },
            {
              key: 'Access-Control-Allow-Headers',
              value: 'X-Requested-With, Content-Type, Authorization'
            },
            {
              key: 'Access-Control-Allow-Credentials',
              value: 'true'
            }
          ]
        }
      ]
    }, // end headers
    async redirects() {
      return [
        {
          source: '/store/:domain/settings',
          destination: '/store/:domain/settings/general',
          permanent: true,
        }
      ]
    }
  };
  
  module.exports = nextConfig;
  