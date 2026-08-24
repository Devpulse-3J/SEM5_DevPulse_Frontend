import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Single Next.js app. No monorepo / transpilePackages needed.
  reactStrictMode: true,
  // Allow HMR and other dev assets when the app is opened from the LAN IP.
  allowedDevOrigins: ["10.10.20.92"],
};

export default nextConfig;
