// File: frontend/lib/site.ts

/**
 * URL pública canónica del sitio (con https y www, sin barra final).
 * Se usa en canonical, Open Graph, JSON-LD, sitemap y robots.
 * Es fija a propósito: no depende de variables de entorno, para que un
 * entorno mal configurado no publique canonicals a localhost.
 */
export const SITE_URL = "https://www.neoshopimportaciones.com";

export const SITE_NAME = "Neoshop Importaciones";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/miniaturagris.png`;

/** Construye una URL absoluta a partir de una ruta interna ("/catalogo"). */
export function absoluteUrl(path = "/"): string {
    if (path === "/" || path === "") return SITE_URL;
    return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Metadatos robots para páginas que no deben aparecer en buscadores. */
export const NOINDEX_ROBOTS = {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
} as const;
