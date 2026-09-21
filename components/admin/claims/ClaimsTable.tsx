// File: components/admin/claims/ClaimsTable.tsx
"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Eye, FileText, AlertCircle } from "lucide-react";
import type { Claim } from "@/src/schemas/claim.schema";
import { AdminCardWrapper } from "@/src/components/admin/layout/admin-card-wrapper";
import {
    AdminTable,
    AdminTableHead,
    AdminTableHeaderCell,
    AdminTableRow,
    AdminTableCell,
    AdminTableEmpty,
} from "@/src/components/admin/layout/admin-table";
import { AdminTablePagination } from "@/src/components/admin/layout/admin-table-pagination";
import { AdminButton } from "@/src/components/admin/layout/admin-button";
import { cn } from "@/lib/utils";

interface ClaimsTableProps {
    claims: Claim[];
    total: number;
    page: number;
    pages: number;
    limit: number;
}

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
    Resuelto: {
        label: "Resuelto",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    },
    "En Proceso": {
        label: "En Proceso",
        className: "bg-blue-50 text-blue-700 border-blue-200/80",
    },
    Pendiente: {
        label: "Pendiente",
        className: "bg-amber-50 text-amber-700 border-amber-200/80",
    },
};

export default function ClaimsTable({
    claims,
    total,
    page,
    pages,
    limit,
}: ClaimsTableProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(newPage));
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleLimitChange = (newLimit: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("limit", String(newLimit));
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <AdminCardWrapper padding="none">
            <AdminTable>
                <AdminTableHead>
                    <tr>
                        <AdminTableHeaderCell width="140px">Correlativo</AdminTableHeaderCell>
                        <AdminTableHeaderCell width="30%">Consumidor</AdminTableHeaderCell>
                        <AdminTableHeaderCell width="130px">Documento</AdminTableHeaderCell>
                        <AdminTableHeaderCell width="110px">Tipo</AdminTableHeaderCell>
                        <AdminTableHeaderCell width="120px">Estado</AdminTableHeaderCell>
                        <AdminTableHeaderCell width="120px">Fecha Registro</AdminTableHeaderCell>
                        <AdminTableHeaderCell width="60px" align="right">
                            Acción
                        </AdminTableHeaderCell>
                    </tr>
                </AdminTableHead>

                <tbody>
                    {claims.length === 0 ? (
                        <AdminTableEmpty
                            title="Sin hojas de reclamación"
                            description="No se encontraron registros con los criterios o filtros aplicados."
                            colSpan={7}
                        />
                    ) : (
                        claims.map((claim) => {
                            const status =
                                STATUS_BADGES[claim.resolution.estado] || {
                                    label: claim.resolution.estado,
                                    className: "bg-slate-100 text-slate-700 border-slate-200",
                                };

                            const isQueja = claim.detail.tipoReclamo === "Queja";

                            return (
                                <AdminTableRow
                                    key={claim._id}
                                    id={claim._id}
                                    className="cursor-pointer hover:bg-slate-50/80 transition-colors"
                                    onClick={() => router.push(`/admin/claims/${claim._id}`)}
                                >
                                    {/* Correlativo */}
                                    <AdminTableCell bold>
                                        <span className="font-mono text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/70">
                                            {claim.correlativo}
                                        </span>
                                    </AdminTableCell>

                                    {/* Consumidor */}
                                    <AdminTableCell>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-medium text-xs text-slate-900 truncate">
                                                {claim.consumer.nombres}
                                            </span>
                                            <span className="text-[11px] text-slate-400 truncate">
                                                {claim.consumer.email}
                                            </span>
                                        </div>
                                    </AdminTableCell>

                                    {/* Documento */}
                                    <AdminTableCell>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                                            <span className="text-[10px] font-bold text-slate-400">
                                                {claim.consumer.tipoDocumento}
                                            </span>
                                            <span>{claim.consumer.numeroDocumento}</span>
                                        </div>
                                    </AdminTableCell>

                                    {/* Tipo de Reclamación */}
                                    <AdminTableCell>
                                        <span
                                            className={cn(
                                                "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border",
                                                isQueja
                                                    ? "bg-purple-50 text-purple-700 border-purple-200/60"
                                                    : "bg-sky-50 text-sky-700 border-sky-200/60"
                                            )}
                                        >
                                            {isQueja ? (
                                                <AlertCircle className="w-3 h-3 shrink-0" />
                                            ) : (
                                                <FileText className="w-3 h-3 shrink-0" />
                                            )}
                                            <span>{claim.detail.tipoReclamo}</span>
                                        </span>
                                    </AdminTableCell>

                                    {/* Estado */}
                                    <AdminTableCell>
                                        <span
                                            className={cn(
                                                "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border whitespace-nowrap",
                                                status.className
                                            )}
                                        >
                                            {status.label}
                                        </span>
                                    </AdminTableCell>

                                    {/* Fecha */}
                                    <AdminTableCell className="text-xs text-slate-500">
                                        {new Date(claim.createdAt).toLocaleDateString("es-PE", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        })}
                                    </AdminTableCell>

                                    {/* Acción */}
                                    <AdminTableCell align="right" onClick={(e) => e.stopPropagation()}>
                                        <AdminButton
                                            asChild
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-slate-500 hover:text-slate-900"
                                        >
                                            <Link
                                                href={`/admin/claims/${claim._id}`}
                                                title="Ver detalle del reclamo"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                            </Link>
                                        </AdminButton>
                                    </AdminTableCell>
                                </AdminTableRow>
                            );
                        })
                    )}
                </tbody>
            </AdminTable>

            {/* Paginador Unificado */}
            <AdminTablePagination
                currentPage={page}
                totalPages={pages}
                pageSize={limit}
                totalItems={total}
                onPageChange={handlePageChange}
                onPageSizeChange={handleLimitChange}
            />
        </AdminCardWrapper>
    );
}