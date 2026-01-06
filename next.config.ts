import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // images: {
  //   unoptimized: true, // disables Next.js optimization globally
  // },
  images: {
    remotePatterns: [
      {
        hostname: '192.168.1.150',
        port: '3000',
      },
      {
        hostname: '127.0.0.1',
        port: '3000',
      },
      {
        protocol: "https",
        hostname: "api.krimu.in",
      }
    ],
  }
};

export default nextConfig;
