// File: frontend/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverActions: {
    bodySizeLimit: "4mb", // Límite de seguridad
  },

  // 1. Configuración de Imágenes (Cloudinary)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "www.neoshopimportaciones.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" }, 
    ],
  },

  // 2. Redirecciones SEO
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