import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

// When a custom domain CNAME is present (e.g. datafolio.me), basePath is empty (root path).
// When deploying to standard GitHub Pages without a custom domain (e.g. username.github.io/workfolio),
// NEXT_PUBLIC_BASE_PATH is used.
const hasCustomDomain = fs.existsSync(path.join(process.cwd(), "public", "CNAME"));

const rawBasePath = hasCustomDomain
  ? ""
  : (process.env.NEXT_PUBLIC_BASE_PATH || "");

const basePath =
  rawBasePath && rawBasePath !== "/"
    ? (rawBasePath.startsWith("/") ? rawBasePath : `/${rawBasePath}`).replace(/\/$/, "")
    : undefined;

const nextConfig: NextConfig = {
  output: process.env.NODE_ENV === "development" ? undefined : "export",
  basePath: basePath,
  assetPrefix: basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath || "",
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;

