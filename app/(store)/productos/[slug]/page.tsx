// File: frontend/app/(store)/productos/[slug]/page.tsx

import { GetProductsBySlug } from '@/src/services/products';
import ProductPageServer from '@/components/home/product/ProductPageServer';
import { Suspense } from 'react';
import SpinnerLoading from '@/components/ui/SpinnerLoading';
import type { Metadata } from "next";
import { notFound } from 'next/navigation';
import ProductJsonLd from '@/components/seo/ProductJsonLd';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { slug } = await params;
    const product = await GetProductsBySlug(slug);

    if (!product) notFound();

    const categoryName = product.categoria?.nombre || 'General';
    const image = product.imagenes?.[0] || 'https://www.neoshopimportaciones.com/logoapp.png';
    const url = `https://www.neoshopimportaciones.com/productos/${product.slug}`;

    // ← Usar metaTitle/metaDescription si existen, sino fallback automático
    const title = product.metaTitle?.trim()
        || product.nombre;

    const description = product.metaDescription?.trim()
        || (product.descripcion
            ? product.descripcion.replace(/<[^>]+>/g, '').slice(0, 160)
            : 'Descubre nuestros productos en neoshop. Calidad y tecnología a tu alcance.');

    // Fusionar tags del producto con keywords base
    const productTags = product.tags ?? [];
    const keywords = [
        product.nombre,
        categoryName,
        ...productTags,
        'neoshop',
        'Lima - Perú',
        'Productos',
        'Tienda Online',
        'San Vicente de Lima - Perú',
        'Perú',
        'iPhone',
        'Celulares',
        'Accesorios',
        'Tecnología',
        'Smartphones',
    ].filter(Boolean);

    return {
        title,
        description,
        keywords,
        openGraph: {
            title,
            description,
            url,
            siteName: 'neoshop',
            type: 'website',
            images: [
                {
                    url: image,
                    alt: product.nombre,
                    width: 1200,
                    height: 630,
                },
            ],
            locale: 'es_PE',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
            creator: '@neoshop',
        },
        icons: {
            icon: "/logoapp.png",
            apple: "/logoapp.png",
        },
        alternates: {
            canonical: url,
        },
        robots: {
            index: true,
            follow: true,
        },
        other: {
            "product:category": categoryName,
            "product:availability": (product?.stock ?? 0) > 0 ? "in stock" : "out of stock",
            "product:price:amount": product?.precio ? product.precio.toFixed(2) : "",
            "product:price:currency": "PEN",
            ...(product.weight && {
                "product:weight": `${product.weight} kg`,
            }),
        }
    };
}

export default async function pageProduct({ params }: { params: Params }) {
    const { slug } = await params;
    const producto = await GetProductsBySlug(slug);

    return (
        <main className='md:max-w-7xl mx-auto'>
            <ProductJsonLd producto={producto} />
            <Suspense fallback={<SpinnerLoading />}>
                <ProductPageServer producto={producto} />
            </Suspense>
        </main>
    );
}