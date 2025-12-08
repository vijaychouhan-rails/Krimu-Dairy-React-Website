import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // images: {
  //   unoptimized: true, // disables Next.js optimization globally
  // },
  images: {
    remotePatterns: [
       {
        hostname: '192.168.1.118',
        port: '3000',
      },
    ],
  }
};

export default nextConfig;
