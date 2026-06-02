// File: src/lib/routes.ts

interface CatalogParams {
    category?: string;
    brand?: string;
    line?: string;
}

export const routes = {
    home: () => "/",
    
    // Generador de rutas del catálogo
    catalog: (params?: CatalogParams) => {
        const parts = ['/catalogo'];
        
        // El orden importa para la jerarquía visual (SEO): Categoria -> Marca -> Linea
        if (params?.category) parts.push(params.category);
        if (params?.brand) parts.push(params.brand);
        if (params?.line) parts.push(params.line);
        
        return parts.join('/');
    },

    // Para un producto específico
    product: (slug: string) => `/producto/${slug}`,
    
    // Para contacto
    whatsapp: (productName?: string) => {
        const phone = "51902900653"; // Tu número
        const text = productName 
            ? `Hola, estoy interesado en el producto: ${productName}`
            : `Hola, tengo una consulta sobre la tienda.`;
        return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    }
};