// File: frontend/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverActions: {
    bodySizeLimit: "4mb",
  },
  
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "www.neoshopimportaciones.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" }, 
    ],
  },

  async redirects() {
    return [
      {
        source: '/productos',
        destination: '/catalogo',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;