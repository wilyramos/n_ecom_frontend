// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/", // Permite todo por defecto
        disallow: [
          "/admin",
          "/checkout",
          "/carrito",
          "/profile",
          "/pos",
          "/api",
          "/auth", // Bloquea acceso a login/registro
          "/search?", // Bloquea parámetros de búsqueda
        ],
      },
    ],
    sitemap: "https://www.neoshopimportaciones.com/sitemap.xml",
  };
}