import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {

    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3022',
        pathname: '/**',
      },
     
    ],
    
 
    formats: ['image/webp', 'image/avif'],
    
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;