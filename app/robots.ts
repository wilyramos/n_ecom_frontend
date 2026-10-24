import type { MetadataRoute } from "next";

const BASE_URL = "https://www.neoshopimportaciones.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/pos/",
        "/staff/",
        "/carrito",
        "/checkout",
        "/checkout-v2",
        "/checkout-result/",
        "/profile/",
        "/auth/",
        "/search",
        "/api/",
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}