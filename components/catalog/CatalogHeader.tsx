// File: src/components/catalog/CatalogHeader.tsx
"use client";

import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import CatalogMobileSort from "./CatalogMobileSort";
import type { CatalogFilters } from "@/src/schemas/catalog";

interface Props {
    title: string;
    totalProducts: number;
    breadcrumbs: { label: string; href: string }[];
    filters: CatalogFilters;
}

export default function CatalogHeader({
    title,
    totalProducts,
    breadcrumbs,
}: Props) {
    return (
        <div className="w-full flex flex-col gap-6 py-6 md:py-8 border-b border-fg-secondary">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="flex items-center">
                <ol className="flex items-center flex-wrap gap-x-1.5 text-sm text-[var(--color-fg-secondary)]">
                    {breadcrumbs.map((crumb, index) => {
                        const isLast = index === breadcrumbs.length - 1;
                        const isFirst = index === 0;

                        return (
                            <li
                                key={`${crumb.label}-${index}`}
                                className="flex items-center gap-1.5"
                            >
                                {index > 0 && (
                                    <ChevronRight className="w-3.5 h-3.5 opacity-40 flex-shrink-0" />
                                )}

                                {isLast ? (
                                    <span
                                        className="text-fg-secondary font-medium"
                                        aria-current="page"
                                    >
                                        {crumb.label}
                                    </span>
                                ) : (
                                    <Link
                                        href={crumb.href}
                                        className="flex items-center gap-1 text-[var(--color-fg-secondary)] hover:text-[var(--color-fg-primary)] transition-colors duration-200"
                                    >
                                        {isFirst && (
                                            <Home className="w-3.5 h-3.5" />
                                        )}

                                        {crumb.label}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </nav>

            {/* Title */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-baseline gap-3">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-fg-secondary uppercase">
                        {title}
                    </h1>

                    <div className="flex items-center gap-1.5 text-xs text-[var(--color-fg-secondary)] whitespace-nowrap">
                        <span>({totalProducts.toLocaleString()})</span>
                    </div>
                </div>

                {/* Sort */}
                <div className="hidden sm:block">
                    <CatalogMobileSort />
                </div>
            </div>
        </div>
    );
}