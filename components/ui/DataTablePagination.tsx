// File: frontend/components/ui/DataTablePagination.tsx
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type DataTablePaginationProps = {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit?: number;
    pathname: string;
    limitOptions?: number[];
    itemLabel?: string;
};

export default function DataTablePagination({
    currentPage,
    totalPages,
    totalItems,
    limit = 10,
    pathname,
    limitOptions = [5, 10, 20, 50, 100],
    itemLabel = "registros",
}: DataTablePaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const fromItem = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1;
    const toItem = Math.min(currentPage * limit, totalItems);

    const buildUrl = (page: number, newLimit: number = limit) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        params.set("limit", newLimit.toString());
        return `${pathname}?${params.toString()}`;
    };

    const handleLimitChange = (newLimitStr: string) => {
        const newLimit = Number(newLimitStr);
        router.push(buildUrl(1, newLimit));
    };

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }

        pages.push(1);
        if (currentPage > 3) pages.push("...");

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
            if (!pages.includes(i)) pages.push(i);
        }

        if (currentPage < totalPages - 2) pages.push("...");
        pages.push(totalPages);

        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-2 border-t border-border text-sm text-muted-foreground">
            {/* Contador de registros */}
            <div className="flex items-center gap-1 text-xs sm:text-sm">
                Mostrando <span className="font-semibold text-foreground">{fromItem}</span> a{" "}
                <span className="font-semibold text-foreground">{toItem}</span> de{" "}
                <span className="font-semibold text-foreground">{totalItems}</span> {itemLabel}
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                {/* Límite por página */}
                <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm">Mostrar</span>
                    <Select value={limit.toString()} onValueChange={handleLimitChange}>
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={limit.toString()} />
                        </SelectTrigger>
                        <SelectContent>
                            {limitOptions.map((option) => (
                                <SelectItem key={option} value={option.toString()}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Botones de navegación */}
                <nav className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        disabled={currentPage <= 1}
                        asChild={currentPage > 1}
                    >
                        {currentPage > 1 ? (
                            <Link href={buildUrl(1)}>
                                <ChevronsLeft className="h-4 w-4" />
                            </Link>
                        ) : (
                            <ChevronsLeft className="h-4 w-4" />
                        )}
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        disabled={currentPage <= 1}
                        asChild={currentPage > 1}
                    >
                        {currentPage > 1 ? (
                            <Link href={buildUrl(currentPage - 1)}>
                                <ChevronLeft className="h-4 w-4" />
                            </Link>
                        ) : (
                            <ChevronLeft className="h-4 w-4" />
                        )}
                    </Button>

                    {getPageNumbers().map((page, index) =>
                        typeof page === "number" ? (
                            <Button
                                key={page}
                                variant={page === currentPage ? "default" : "outline"}
                                size="sm"
                                className="h-8 w-8 text-xs font-medium"
                                asChild
                            >
                                <Link href={buildUrl(page)}>{page}</Link>
                            </Button>
                        ) : (
                            <span
                                key={`ellipsis-${index}`}
                                className="flex h-8 w-6 items-center justify-center text-xs text-muted-foreground"
                            >
                                ...
                            </span>
                        )
                    )}

                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        disabled={currentPage >= totalPages || totalPages === 0}
                        asChild={currentPage < totalPages}
                    >
                        {currentPage < totalPages ? (
                            <Link href={buildUrl(currentPage + 1)}>
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        disabled={currentPage >= totalPages || totalPages === 0}
                        asChild={currentPage < totalPages}
                    >
                        {currentPage < totalPages ? (
                            <Link href={buildUrl(totalPages)}>
                                <ChevronsRight className="h-4 w-4" />
                            </Link>
                        ) : (
                            <ChevronsRight className="h-4 w-4" />
                        )}
                    </Button>
                </nav>
            </div>
        </div>
    );
}