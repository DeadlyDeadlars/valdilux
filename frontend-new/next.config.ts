import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['172.28.111.200'],
  images: {
    remotePatterns: [{ protocol: 'http', hostname: 'localhost', port: '4000' }],
  },
};

export default nextConfig;
