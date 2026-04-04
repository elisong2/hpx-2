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
      new URL('https://xlyuewakwxekqfsoyjhh.supabase.co/storage/**'),
      new URL('https://i0.wp.com/**'),
      new URL('https://www.mitamotorsports.com/**'),
    ],
  },

};

export default nextConfig;


