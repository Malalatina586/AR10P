import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "axpphohoduozckzfkaqg.supabase.co",
        pathname: "/storage/v1/object/public/publication-images/**",
      },
    ],
  },
};

export default nextConfig;
