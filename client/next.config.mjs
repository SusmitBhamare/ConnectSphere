/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        // pathname : "/"
      },
    ],
  },
  async rewrites(){
    return [{
      source : '/api/user/:path*',
      destination : 'http://localhost:8081/:path*'
    }, 
    {
      source : '/api/messages/:path*',
      destination : 'http://localhost:8082/:path*'
    },
    {
      source : '/api/workspace/:path*',
      destination : 'http://localhost:8083/:path*'
    }
  ]
  }
};

export default nextConfig;
