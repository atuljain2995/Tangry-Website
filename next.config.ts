import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["http://localhost:3000", "10.71.68.185"],
  // Avoid 400s when product images are missing/invalid (we use native <img> via ProductImage)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
