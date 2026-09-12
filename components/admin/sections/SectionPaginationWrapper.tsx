// File: components/admin/sections/SectionPaginationWrapper.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AdminTablePagination } from "@/src/components/admin/layout/admin-table-pagination";

interface SectionPaginationWrapperProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
}

export default function SectionPaginationWrapper({
    currentPage,
    totalPages,
    pageSize,
    totalItems,
}: SectionPaginationWrapperProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const updateParams = (page: number, limit: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        params.set("limit", limit.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <AdminTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={(p) => updateParams(p, pageSize)}
            onPageSizeChange={(s) => updateParams(1, s)}
        />
    );
}