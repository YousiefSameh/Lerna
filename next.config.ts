import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        hostname: 'lerna-lms.t3.storage.dev',
        port: '',
        protocol: "https"
      }
    ]
  }
};

export default nextConfig;
