import "server-only"; // Asegura que esto solo corre en el servidor
import { CatalogResponseSchema, type CatalogResponse } from "@/src/schemas/catalog";

export const getCatalogData = async (
    slugs: string[],
    searchParams: { [key: string]: string | string[] | undefined }
): Promise<CatalogResponse | null> => {

    try {
        // 1. Construir URLSearchParams
        const params = new URLSearchParams();

        // Pasar los slugs como string separado por comas
        if (slugs.length > 0) {
            params.append("slugs", slugs.join(","));
        }

        // Pasar el resto de filtros (color, precio, sort, page)
        Object.entries(searchParams).forEach(([key, value]) => {
            if (value === undefined || value === null) return;
            if (Array.isArray(value)) {
                value.forEach(v => params.append(key, v));
            } else {
                params.append(key, value);
            }
        });

        // 2. Llamada al Backend
        const url = `${process.env.API_URL}/products/catalog/resolve?${params.toString()}`;

        const res = await fetch(url, {
            method: "GET",
            // next: { revalidate: 60 * 60 }, // Cachear 1 hora
        });

        if (!res.ok) {
            console.error(`Catalog API Error: ${res.status}`);
            return null;
        }

        const json = await res.json();
        const result = CatalogResponseSchema.parse(json);
        return result;

    } catch (error) {
        console.error("Error fetching catalog data:", error);
        return null;
    }
};

/**
 * Obtiene específicamente el catálogo de OFERTAS.
 * Apunta a un endpoint dedicado para mejor performance y lógica de negocio.
 */
export const getCatalogDataOffers = async (
    searchParams: { [key: string]: string | string[] | undefined }
): Promise<CatalogResponse | null> => {

    try {
        const params = new URLSearchParams();

        // Mapeamos los searchParams a query string
        Object.entries(searchParams).forEach(([key, value]) => {
            if (value === undefined || value === null) return;
            if (Array.isArray(value)) {
                value.forEach(v => params.append(key, v));
            } else {
                params.append(key, value);
            }
        });

        const url = `${process.env.API_URL}/products/offers/all?${params.toString()}`;

        const res = await fetch(url, {
            method: "GET",
            cache: "no-store",
            // next: { revalidate: 60 * 30 },
        });

        if (!res.ok) {
            console.error(`Offers API Error: ${res.status}`);
            return null;
        }

        const json = await res.json();

        // Validamos con el mismo esquema para poder reusar el CatalogLayout
        return CatalogResponseSchema.parse(json);

    } catch (error) {
        console.error("Error fetching offers data:", error);
        return null;
    }
};



export const getCatalogDataNewArrivals = async (
    searchParams: { [key: string]: string | string[] | undefined }
): Promise<CatalogResponse | null> => {
    try {
        const params = new URLSearchParams();
        Object.entries(searchParams).forEach(([key, value]) => {
            if (value === undefined || value === null) return;
            if (Array.isArray(value)) value.forEach(v => params.append(key, v));
            else params.append(key, value);
        });

        // Apunta al endpoint de novedades
        const url = `${process.env.API_URL}/products/newarrivals/all?${params.toString()}`;

        const res = await fetch(url, {
            method: "GET",
            // Novedades no cambia cada minuto, podemos cachear un poco más
            // next: { revalidate: 3600 } // 1 hora
        });

        if (!res.ok) return null;
        const json = await res.json();
        return CatalogResponseSchema.parse(json);

    } catch (error) {
        console.error("Error fetching news data:", error);
        return null;
    }
};