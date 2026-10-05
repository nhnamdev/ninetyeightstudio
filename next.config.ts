import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev",
      },
    ],
  },
};

export default nextConfig;
