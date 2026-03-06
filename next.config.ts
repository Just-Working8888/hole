import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/dyor/:path*",
        destination: "https://jetton-index.tonscan.org/public-dyor/:path*",
      },
    ];
  },
};

export default nextConfig;
