import type { NextConfig } from "next";

// basePath is set when deploying to GitHub Pages without a custom domain (e.g., /workfolio).
// When local or when a custom domain (e.g., divyanshu.me) is used, basePath remains empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath ? basePath : undefined,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;

