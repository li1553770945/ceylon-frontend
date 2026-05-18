import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

if (
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_API_BASE_URL === "/api/v1"
) {
  nextConfig.rewrites = async () => [
    {
      source: "/api/v1/:path*",
      destination: "http://localhost:8000/api/v1/:path*",
    },
  ];
}

export default nextConfig;
