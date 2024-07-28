/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
        // pathname : "/"
      },
      {
        protocol : "https",
        hostname: "avatar.iran.liara.run",
        port : ""
      }
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
