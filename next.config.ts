import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // Serve modern, smaller formats where the browser supports them —
    // meaningful savings on the 60+ photo galleries over mobile data.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "fetfhywmyogoctvghldj.supabase.co",
      },
    ],
  },
};

export default nextConfig;