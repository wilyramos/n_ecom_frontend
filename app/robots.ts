// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",

                allow: [
                    "/",
                    "/productos",
                    "/categoria",
                    "/ofertas",
                    "/marca",
                    "/hc",             
                    "/terminos-y-condiciones",       
                    "/cookies",        
                    "/auth",
                    "/search",
                ],

                disallow: [
                    "/admin",
                    "/checkout",
                    "/carrito",
                    "/profile",
                    "/pos",
                    "/api",
                    "/search?*sort=",
                    "/search?*priceRange=",
                    "/search?*min=",
                    "/search?*max=",
                ],
            },
        ],

        sitemap: "https://www.neoshopimportaciones.com/sitemap.xml",
    };
}