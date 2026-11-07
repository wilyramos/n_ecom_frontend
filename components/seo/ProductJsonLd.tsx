
import type { ProductWithCategoryResponse } from "@/src/schemas";

const BASE_URL = "https://www.neoshopimportaciones.com";

type Props = {
    producto: ProductWithCategoryResponse;
};

function stripHtml(value?: string | null): string {
    return (value ?? "")
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, " ")
        .trim();
}

export default function ProductJsonLd({ producto }: Props) {
    if (!producto) return null;

    const images = (producto.imagenes ?? []).filter(
        (image): image is string =>
            typeof image === "string" && image.trim().length > 0
    );

    const url = `${BASE_URL}/productos/${encodeURIComponent(producto.slug)}`;

    const brandName =
        producto.brand &&
            typeof producto.brand === "object" &&
            "nombre" in producto.brand
            ? String(producto.brand.nombre)
            : typeof producto.atributos?.Marca === "string"
                ? producto.atributos.Marca
                : "Neoshop";

    const price = Number(producto.precio);

    const availability =
        Number(producto.stock ?? 0) > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock";

    const description =
        stripHtml(producto.descripcion) ||
        `Conoce ${producto.nombre} en Neoshop Importaciones.`;

    const sku =
        typeof producto.sku === "string" && producto.sku.trim()
            ? producto.sku.trim()
            : undefined;

    const barcode =
        typeof producto.barcode === "string"
            ? producto.barcode.replace(/\D/g, "")
            : "";

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: producto.nombre,
        description,
        image: images.length ? images : undefined,
        url,
        ...(sku ? { sku } : {}),
        ...(barcode.length === 13 ? { gtin13: barcode } : {}),
        ...(producto.categoria?.nombre
            ? { category: producto.categoria.nombre }
            : {}),
        brand: {
            "@type": "Brand",
            name: brandName,
        },
        ...(Number.isFinite(price) && price >= 0
            ? {
                offers: {
                    "@type": "Offer",
                    url,
                    price: price.toFixed(2),
                    priceCurrency: "PEN",
                    availability,
                    seller: {
                        "@type": "Organization",
                        name: "Neoshop Importaciones",
                        url: BASE_URL,
                    },
                },
            }
            : {}),
    };

    // Evita que contenido del producto pueda cerrar la etiqueta script.
    const jsonLd = JSON.stringify(structuredData)
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026");

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
    );
}
