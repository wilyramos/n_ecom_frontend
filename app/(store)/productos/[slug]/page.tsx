
import { cache, Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GetProductsBySlug } from "@/src/services/products";
import ProductPageServer from "@/components/home/product/ProductPageServer";
import SpinnerLoading from "@/components/ui/SpinnerLoading";
import ProductJsonLd from "@/components/seo/ProductJsonLd";

type Params = {
    params: Promise<{ slug: string }>;
};

const getProduct = cache(async (slug: string) => {
    return GetProductsBySlug(slug);
});

const BASE_URL = "https://www.neoshopimportaciones.com";

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

export async function generateMetadata({
    params,
}: Params): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    const title = product.metaTitle?.trim() || product.nombre;

    const description =
        product.metaDescription?.trim() ||
        stripHtml(product.descripcion).slice(0, 160) ||
        `Conoce ${product.nombre} en Neoshop Importaciones. Compra tecnología y accesorios en Perú.`;

    const canonicalUrl = `${BASE_URL}/productos/${encodeURIComponent(product.slug)}`;

    const images = (product.imagenes ?? []).filter(
        (image): image is string =>
            typeof image === "string" && image.trim().length > 0
    );

    const openGraphImages = images.length
        ? images.map((image) => ({
            url: image,
            alt: product.nombre,
        }))
        : [
            {
                url: "/miniaturagris.png",
                alt: "Neoshop Importaciones",
            },
        ];

    return {
        title,
        description,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            type: "website",
            locale: "es_PE",
            url: canonicalUrl,
            siteName: "Neoshop Importaciones",
            title,
            description,
            images: openGraphImages,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: openGraphImages.map((image) => image.url),
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-image-preview": "large",
                "max-snippet": -1,
                "max-video-preview": -1,
            },
        },
    };
}

export default async function ProductPage({ params }: Params) {
    const { slug } = await params;
    const producto = await getProduct(slug);

    if (!producto) {
        notFound();
    }

    return (
        <main className="mx-auto md:max-w-7xl">
            <ProductJsonLd producto={producto} />

            <Suspense fallback={<SpinnerLoading />}>
                <ProductPageServer producto={producto} />
            </Suspense>
        </main>
    );
}
