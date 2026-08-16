// File: frontend/components/admin/attendance/AttendanceTable.tsx
"use client";

import type { AdminAttendance } from "@/src/schemas/attendance.schema";
import { ArrowRight, Clock } from "lucide-react";
import { formatDecimalHours } from "@/lib/utils";
import {
    AdminTable,
    AdminTableHead,
    AdminTableRow,
    AdminTableHeaderCell,
    AdminTableCell,
    AdminTableEmpty,
} from "@/src/components/admin/layout/admin-table";

interface AttendanceTableProps {
    data: AdminAttendance[];
}

export default function AttendanceTable({ data }: AttendanceTableProps) {
    if (data.length === 0) {
        return (
            <AdminTable>
                <tbody>
                    <AdminTableEmpty
                        title="No se encontraron registros de asistencia"
                        description="Intenta cambiar los rangos de fechas o el texto de búsqueda."
                        colSpan={6}
                    />
                </tbody>
            </AdminTable>
        );
    }

    const totalHorasLote = parseFloat(
        data.reduce((acc, curr) => acc + (curr.workHours ?? 0), 0).toFixed(2)
    );

    return (
        <AdminTable>
            <AdminTableHead>
                <tr>
                    <AdminTableHeaderCell width="240px">Colaborador</AdminTableHeaderCell>
                    <AdminTableHeaderCell width="120px">Documento</AdminTableHeaderCell>
                    <AdminTableHeaderCell width="100px">Rol</AdminTableHeaderCell>
                    <AdminTableHeaderCell width="120px">Fecha Jornada</AdminTableHeaderCell>
                    <AdminTableHeaderCell>Marcaciones (Entrada / Salida)</AdminTableHeaderCell>
                    <AdminTableHeaderCell width="140px" align="right">Horas Calculadas</AdminTableHeaderCell>
                </tr>
            </AdminTableHead>
            <tbody>
                {data.map((row) => {
                    const user = row.userId;
                    return (
                        <AdminTableRow key={row._id} id={row._id}>
                            <AdminTableCell bold>
                                <div className="flex flex-col">
                                    <span className="text-zinc-900 text-xs font-semibold">
                                        {user.nombre} {user.apellidos || ""}
                                    </span>
                                    <span className="text-[11px] text-zinc-400 font-normal">{user.email}</span>
                                </div>
                            </AdminTableCell>

                            <AdminTableCell>
                                <span className="text-xs font-mono text-zinc-600">
                                    {user.numeroDocumento || "—"}
                                </span>
                            </AdminTableCell>

                            <AdminTableCell>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-800 uppercase tracking-wide">
                                    {user.rol}
                                </span>
                            </AdminTableCell>

                            <AdminTableCell>
                                <span className="text-xs text-zinc-600">
                                    {new Date(row.date).toLocaleDateString("es-ES", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        timeZone: "UTC",
                                    })}
                                </span>
                            </AdminTableCell>

                            <AdminTableCell>
                                <div className="flex items-center gap-1.5 text-[11px]">
                                    <span className="text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded font-medium">
                                        ENT: {new Date(row.checkIn.timestamp).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                                    </span>

                                    {row.checkOut?.timestamp ? (
                                        <>
                                            <ArrowRight className="h-3 w-3 text-zinc-300" />
                                            <span className="text-rose-700 bg-rose-50 border border-rose-200/60 px-2 py-0.5 rounded font-medium">
                                                SAL: {new Date(row.checkOut.timestamp).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <ArrowRight className="h-3 w-3 text-zinc-300" />
                                            <span className="text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded font-medium animate-pulse">
                                                Jornada Abierta
                                            </span>
                                        </>
                                    )}
                                </div>
                            </AdminTableCell>

                            <AdminTableCell align="right">
                                {row.workHours !== undefined ? (
                                    <div className="inline-flex items-center gap-1 font-mono font-semibold text-xs text-zinc-900 bg-zinc-100 px-2 py-1 rounded-md">
                                        <Clock className="h-3 w-3 text-zinc-400" />
                                        <span>{formatDecimalHours(row.workHours)}</span>
                                    </div>
                                ) : (
                                    <span className="text-xs italic text-zinc-400">En curso...</span>
                                )}
                            </AdminTableCell>
                        </AdminTableRow>
                    );
                })}
            </tbody>
            <tfoot>
                <tr className="bg-zinc-50 border-t border-zinc-200 font-medium">
                    <td colSpan={5} className="p-3 text-xs text-zinc-600 font-semibold">
                        Total horas de los registros en esta página
                    </td>
                    <td className="p-3 text-right text-xs font-mono font-bold text-zinc-900">
                        {formatDecimalHours(totalHorasLote)}
                    </td>
                </tr>
            </tfoot>
        </AdminTable>
    );
}