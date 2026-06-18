import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/UCSD-Skills-Library-Site",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
