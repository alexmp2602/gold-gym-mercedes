import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  distDir: ".next-vercel",
  webpack(config) {
    config.resolve.alias["@club/runtime"] = path.resolve(process.cwd(), "lib/runtime-node.ts");
    return config;
  },
};

export default nextConfig;
