// File: frontend/components/admin/attendance/AttendanceTable.tsx
"use client";

import type { AdminAttendance } from "@/src/schemas/attendance.schema";
import { Clock, ArrowRight, UserCheck } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface AttendanceTableProps {
    data: AdminAttendance[];
}

export default function AttendanceTable({ data }: AttendanceTableProps) {
    if (data.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center flex flex-col items-center justify-center gap-3 shadow-sm">
                <div className="p-3 bg-zinc-50 rounded-full text-zinc-400">
                    <UserCheck className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-zinc-900">No se encontraron registros de marcas</p>
                <p className="text-xs text-zinc-400 max-w-xs">Intente modificar las fechas o parámetros de búsqueda.</p>
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[280px] p-4">Colaborador</TableHead>
                    <TableHead className="p-4">Documento</TableHead>
                    <TableHead className="p-4">Rol</TableHead>
                    <TableHead className="p-4">Fecha Jornada</TableHead>
                    <TableHead className="p-4">Marcas Oficiales</TableHead>
                    <TableHead className="text-right p-4">Horas Calculadas</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((row) => {
                    const user = row.userId;
                    return (
                        <TableRow key={row._id}>
                            <TableCell className="p-4">
                                <p className="font-semibold">{user.nombre} {user.apellidos || ""}</p>
                                <p className="text-xs ">{user.email}</p>
                            </TableCell>
                            <TableCell className="p-4 text-xs ">
                                {user.numeroDocumento ? `${ "DOC"}: ${user.numeroDocumento}` : "—"}
                            </TableCell>
                            <TableCell className="p-4">
                                <Badge variant="outline" className="rounded">
                                    {user.rol}
                                </Badge>
                            </TableCell>
                            <TableCell className="p-4 text-xs">
                                {new Date(row.date).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" })}
                            </TableCell>
                            <TableCell className="p-4">
                                <div className="flex items-center gap-2 text-xs ">
                                    <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded font-bold">
                                        ENTRADA: {new Date(row.checkIn.timestamp).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                                    </span>
                                    {row.checkOut?.timestamp ? (
                                        <>
                                            <ArrowRight className="h-3 w-3" />
                                            <span className="text-rose-600 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded font-bold">
                                                SALIDA: {new Date(row.checkOut.timestamp).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <ArrowRight className="h-3 w-3" />
                                            <span className="text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded font-bold animate-pulse">
                                                Jornada Abierta
                                            </span>
                                        </>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="p-4 text-right">
                                {row.workHours !== undefined ? (
                                    <div className="inline-flex items-center gap-1.5  font-bold bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1 text-xs">
                                        <Clock className="h-3.5 w-3.5" />
                                        {row.workHours} hrs
                                    </div>
                                ) : (
                                    <span className="text-xs italic">Calculando...</span>
                                )}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}