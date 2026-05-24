import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Configuración de Imágenes (Cloudinary)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "www.neoshopimportaciones.com",
      }
    ]
  },

  // 2. Redirecciones SEO (Vitales para no perder tráfico)
  async redirects() {
    return [
      // A) Migración de listado general antiguo
      // Si alguien entra a neoshopimportaciones.com/productos -> lo manda a /catalogo
      {
        source: '/productos',
        destination: '/catalogo',
        permanent: true,
      },
      
    ];
  },
};

export default nextConfig;