import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // img.clerk.com
  images: {
    domains: [
      "img.clerk.com",
      "res.cloudinary.com",
    ],
    unoptimized: true,
  },
};

export default nextConfig;
