import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

   images: {
    remotePatterns: [new URL('https://xlyuewakwxekqfsoyjhh.supabase.co/storage/**')],
  },

};

export default nextConfig;


