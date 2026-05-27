// File: app/(admin)/admin/claims/components/ClaimsTable.tsx
"use client";

import { useRouter } from "next/navigation";
import { Claim } from "@/src/schemas/claim.schema";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Pagination from "@/components/ui/Pagination";

interface ClaimsTableProps {
    claims: Claim[];
    total: number;
    page: number;
    pages: number;
}

export default function ClaimsTable({ claims, total, page, pages }: ClaimsTableProps) {
    const router = useRouter();

    // Mapeo estricto utilizando únicamente las variables definidas en tu archivo de estilos CSS
    const getStatusStyles = (estado: string) => {
        switch (estado) {
            case "Resuelto":
                return "text-success border-success bg-background-secondary";
            case "En Proceso":
                return "text-warning border-warning bg-background-secondary";
            default:
                return "text-[var(--destructivered)] border-[var(--destructivered)] bg-background-secondary";
        }
    };

    return (
        <div className="space-y-4">
            <div className="rounded-lg  overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[140px] font-semibold">Correlativo</TableHead>
                            <TableHead className="font-semibold">Consumidor</TableHead>
                            <TableHead className="w-[120px] font-semibold">Documento</TableHead>
                            <TableHead className="w-[110px] font-semibold">Tipo</TableHead>
                            <TableHead className="w-[120px] font-semibold">Estado</TableHead>
                            <TableHead className="w-[140px] font-semibold text-right">Fecha Registro</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {claims.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground text-sm">
                                    No se encontraron hojas de reclamación con los filtros aplicados.
                                </TableCell>
                            </TableRow>
                        ) : (
                            claims.map((claim) => (
                                <TableRow
                                    key={claim._id}
                                    className="cursor-pointer transition-colors"
                                    onClick={() => router.push(`/admin/claims/${claim._id}`)}
                                >
                                    <TableCell className="font-mono text-xs font-semibold text-action-cta">
                                        {claim.correlativo}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">{claim.consumer.nombres}</span>
                                            <span className="text-xs text-muted-foreground">{claim.consumer.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs font-medium">
                                        <div className="flex flex-col">
                                            <span>{claim.consumer.numeroDocumento}</span>
                                            <span className="text-[10px] text-muted-foreground uppercase">{claim.consumer.tipoDocumento}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`text-xs font-semibold ${claim.detail.tipoReclamo === "Queja" ? "text-primary" : "text-action-cta"}`}>
                                            {claim.detail.tipoReclamo}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(claim.resolution.estado)}`}>
                                            {claim.resolution.estado}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right text-muted-foreground text-xs font-medium">
                                        {new Date(claim.createdAt).toLocaleDateString("es-PE", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric"
                                        })}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Bloque de Control de Paginación */}
            {pages > 1 && (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-border pt-4 px-1">
                    <p className="text-xs text-muted-foreground font-medium text-center sm:text-left">
                        Mostrando página <span className="font-semibold text-foreground">{page}</span> de <span className="font-semibold text-foreground">{pages}</span> ({total} reclamos en total)
                    </p>
                    <Pagination
                        currentPage={page}
                        totalPages={pages}
                        limit={10}
                        pathname="/admin/claims"
                    />
                </div>
            )}
        </div>
    );
}