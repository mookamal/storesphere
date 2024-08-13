/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['api.nour.com'],
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
    } // end headers
  };
  
  module.exports = nextConfig;
  