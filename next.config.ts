import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

   images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'xlyuewakwxekqfsoyjhh.supabase.co', pathname: '/storage/**' },
      { protocol: 'https', hostname: 'i0.wp.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.mitamotorsports.com', pathname: '/**' },
    ],
  },

};

export default nextConfig;


