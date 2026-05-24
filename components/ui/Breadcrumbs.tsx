//File: frontend/components/ui/Breadcrumbs.tsx

import Link from "next/link";
import { ChevronRight, Home, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface Props {
    items: BreadcrumbItem[];
    current?: string;
    className?: string;
}

export default function Breadcrumbs({ items, current, className }: Props) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://neoshopimportaciones.com";
    
    // Lógica de colapso: si hay más de 3 items, mostramos el primero, ... y el último
    const shouldCollapse = items.length > 4;
    const displayItems = shouldCollapse 
        ? [items[0], { label: "...", href: "#" }, items[items.length - 1]] 
        : items;

    const schemaItems = [
        {
            "@type": "ListItem",
            "position": 1,
            "name": "Inicio",
            "item": baseUrl
        },
        ...items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 2,
            "name": item.label,
            "item": `${baseUrl}${item.href}`
        }))
    ];

    if (current) {
        schemaItems.push({
            "@type": "ListItem",
            "position": schemaItems.length + 1,
            "name": current,
            "item": typeof window !== 'undefined' ? window.location.href : `${baseUrl}/#`
        });
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": schemaItems
    };

    return (
        <nav
            aria-label="Breadcrumb"
            className={cn("w-full overflow-hidden px-2", className)}
        >
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <ol className="flex items-center whitespace-nowrap overflow-hidden py-2 text-xs text-[var(--store-text-muted)]">
                {/* Home */}
                <li className="flex items-center shrink-0">
                    <Link
                        href="/"
                        className="flex items-center gap-1 hover:text-[var(--store-primary)] transition-colors"
                        title="Ir al inicio"
                    >
                        <Home className="w-3.5 h-3.5 mb-0.5" />
                        <span className="sr-only">Inicio</span>
                    </Link>
                </li>

                {/* Items con lógica de elipsis */}
                {displayItems.map((item, index) => (
                    <li key={`${item.label}-${index}`} className="flex items-center min-w-0">
                        <ChevronRight className="w-3 h-3 mx-2 text-gray-300 shrink-0" />
                        {item.label === "..." ? (
                            <span className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-gray-100 transition-colors cursor-default">
                                <MoreHorizontal className="w-4 h-4" />
                            </span>
                        ) : (
                            <Link
                                href={item.href}
                                className="font-medium hover:text-[var(--store-primary)] hover:underline decoration-1 underline-offset-2 truncate min-w-0 max-w-[100px] sm:max-w-[180px]"
                            >
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}

                {/* Actual */}
                {current && (
                    <li className="sr-only" aria-current="page">
                        {current}
                    </li>
                )}
            </ol>
        </nav>
    );
}