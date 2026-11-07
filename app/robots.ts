
import type { MetadataRoute } from "next";

const BASE_URL = "https://www.neoshopimportaciones.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/pos",
          "/staff",
          "/api",
          "/cash-shift",
          "/sales",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
