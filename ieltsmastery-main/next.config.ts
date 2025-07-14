import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: "standalone", // Required for Vercel (SSR/ISR)
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
