import { Metadata } from "next";
import { getAllSubcategories } from "@/src/services/categorys";
import CategoryCard from "@/components/category/category-card";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Link from "next/link";
import React from "react";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
    title: "Categorías | neoshop",
    description:
        "Explora todas nuestras subcategorías y encuentra productos específicos organizados para ti.",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/categorias`,
    },
};

export default async function CategoriesPage() {
    const subcategories = await getAllSubcategories();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Subcategorías de Productos",
        itemListElement: subcategories.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/categoria/${c.slug}`,
        })),
    };

    return (
        <main className="bg-[var(--color-bg-primary)] min-h-screen py-8">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="max-w-7xl mx-auto px-4">
                <Breadcrumbs
                    items={[
                        { label: "Inicio", href: "/" },
                        { label: "Categorías", href: "/categorias" },
                    ]}
                />

                <header className="mt-6 mb-10">
                    <h1 className="text-3xl font-semibold text-[var(--color-text-primary)]">
                        Categorías
                    </h1>
                    <p className="text-[var(--color-text-secondary)] mt-2 max-w-xl">
                        Navega por nuestras subcategorías.
                    </p>
                </header>

                {/* Grid */}
                <section>
                    <h2 className="text-xs uppercase tracking-widest text-[var(--color-text-tertiary)] mb-6">
                        Catálogo
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {subcategories.map((c) => (
                            <CategoryCard key={c._id} category={c} />
                        ))}
                    </div>
                </section>

                {/* Sitemap */}
                <section className="mt-16 pt-8 border-t border-[var(--color-border-subtle)]">
                    <h2 className="text-xs uppercase tracking-widest text-[var(--color-text-tertiary)] mb-6">
                        Índice
                    </h2>

                    <div className="columns-2 md:columns-3 lg:columns-4 gap-8 space-y-3">
                        {[...subcategories]
                            .sort((a, b) => a.nombre.localeCompare(b.nombre))
                            .map((c) => (
                                <Link
                                    key={c._id}
                                    href={routes.catalog({ category: c.slug })}
                                    className="block text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent-warm)]"
                                >
                                    {c.nombre}
                                </Link>
                            ))}
                    </div>
                </section>
            </div>
        </main>
    );
}