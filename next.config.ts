import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Cronograma/Demandas attachments can be images/videos larger than the
      // 1MB server action default.
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
