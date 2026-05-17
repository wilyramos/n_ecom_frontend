"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

interface Props {
    currentPage: number;
    totalPages: number;
    siblingCount?: number;
}

export default function CatalogPagination({
    currentPage,
    totalPages,
    siblingCount = 1
}: Props) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Si no hay suficientes páginas, no renderizamos nada
    if (totalPages <= 1) return null;

    // Helper para generar URLs manteniendo los filtros existentes
    const createPageUrl = (page: number | string) => {
        const params = new URLSearchParams(searchParams.toString());

        // Si es la página 1, es más limpio quitar el param (opcional, pero buena práctica SEO)
        if (Number(page) === 1) {
            params.delete("page");
        } else {
            params.set("page", page.toString());
        }

        return `${pathname}?${params.toString()}`;
    };

    // Algoritmo robusto para generar el array de paginación (ej: [1, '...', 4, 5, 6, '...', 10])
    const generatePagination = () => {
        // Total de números a mostrar: siblings + current + first + last + 2 ellipsis
        const totalNumbers = siblingCount + 5;

        // Caso 1: Si el total de páginas es menor que lo que queremos mostrar, mostramos todo
        if (totalPages <= totalNumbers) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

        const firstPageIndex = 1;
        const lastPageIndex = totalPages;

        // Caso 2: Puntos solo a la derecha
        if (!shouldShowLeftDots && shouldShowRightDots) {
            const leftItemCount = 3 + 2 * siblingCount;
            const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
            return [...leftRange, "...", totalPages];
        }

        // Caso 3: Puntos solo a la izquierda
        if (shouldShowLeftDots && !shouldShowRightDots) {
            const rightItemCount = 3 + 2 * siblingCount;
            const rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1);
            return [firstPageIndex, "...", ...rightRange];
        }

        // Caso 4: Puntos a ambos lados
        if (shouldShowLeftDots && shouldShowRightDots) {
            const middleRange = Array.from(
                { length: rightSiblingIndex - leftSiblingIndex + 1 },
                (_, i) => leftSiblingIndex + i
            );
            return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
        }

        return [];
    };

    const pages = generatePagination();

    return (
        <nav aria-label="Navegación del catálogo" className="flex justify-center items-center gap-2 select-none">
            {/* Botón Anterior */}
            <PaginationButton
                href={createPageUrl(currentPage - 1)}
                isDisabled={currentPage <= 1}
                aria-label="Ir a la página anterior"
            >
                <ChevronLeft className="w-4 h-4" />
            </PaginationButton>

            {/* Números de página */}
            {pages.map((p, i) => {
                if (p === "...") {
                    return (
                        <span
                            key={`ellipsis-${i}`}
                            className="px-2 py-2 text-sm text-[var(--store-text-muted)]"
                            aria-hidden="true"
                        >
                            ...
                        </span>
                    );
                }

                return (
                    <PaginationButton
                        key={p}
                        href={createPageUrl(p)}
                        isActive={currentPage === p}
                        aria-label={`Ir a la página ${p}`}
                        aria-current={currentPage === p ? "page" : undefined}
                    >
                        {p}
                    </PaginationButton>
                );
            })}

            {/* Botón Siguiente */}
            <PaginationButton
                href={createPageUrl(currentPage + 1)}
                isDisabled={currentPage >= totalPages}
                aria-label="Ir a la página siguiente"
            >
                <ChevronRight className="w-4 h-4" />
            </PaginationButton>
        </nav>
    );
}

// ---------------------------------------------------------
// Sub-componente Tipado Correctamente (Sin 'any')
// ---------------------------------------------------------

// Extendemos de las props nativas de NextLink, omitiendo href para redefinirlo o controlarlo
type PaginationButtonProps = Omit<React.ComponentProps<typeof Link>, "href"> & {
    href: string;
    isActive?: boolean;
    isDisabled?: boolean;
    children: React.ReactNode;
};

function PaginationButton({
    href,
    isActive,
    isDisabled,
    children,
    className,
    ...props
}: PaginationButtonProps) {

    // Clases base compartidas
    const baseStyles = "flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 border";

    // Si está deshabilitado, renderizamos un span para que no sea clicable ni navegable por teclado
    if (isDisabled) {
        return (
            <span
                className={cn(baseStyles, "border-transparent text-[var(--store-text-muted)] opacity-30 cursor-not-allowed")}
                aria-disabled="true"
            >
                {children}
            </span>
        );
    }

    return (
        <Link
            href={href}
            scroll={false} // UX: Evita el salto al inicio de la página al paginar
            className={cn(
                baseStyles,
                isActive
                    ? "bg-[var(--store-text)] text-[var(--store-surface)] border-[var(--store-text)] shadow-sm pointer-events-none"
                    : "bg-white text-[var(--store-text)] border-transparent hover:border-[var(--store-border)] hover:bg-gray-50 active:scale-95",
                className
            )}
            {...props}
        >
            {children}
        </Link>
    );
}