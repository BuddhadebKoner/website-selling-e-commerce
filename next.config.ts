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
  env: {
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
  },
};

export default nextConfig;
