import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "standalone",
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: 'http://34.122.21.18:4000/api/auth/:path*'
      },
      {
        source: '/api/attendance/:path*',
        destination: 'http://35.193.28.139:4002/api/employee/attendance/:path*'
      },
      {
        source: '/api/admin/:path*',
        destination: 'http://35.232.21.216:4001/api/admin/:path*'
      }
    ];
  }
};

export default nextConfig;