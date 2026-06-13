// File: frontend/components/admin/attendance/AttendanceStats.tsx
"use client";

import { AdminAttendance } from "@/src/schemas/attendance.schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AttendanceStatsProps {
    records: AdminAttendance[];
}

export default function AttendanceStats({ records }: AttendanceStatsProps) {
    // Cálculos dinámicos basados en la data actual
    const totalRegistros = records.length;
    const jornadasAbiertas = records.filter(r => !r.checkOut?.timestamp).length;
    const jornadasCompletadas = totalRegistros - jornadasAbiertas;
    
    const horasTotales = records.reduce((acc, curr) => acc + (curr.workHours ?? 0), 0);
    const promedioHoras = totalRegistros > 0 ? (horasTotales / totalRegistros).toFixed(1) : "0";

    return (
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card className=" border-neutral-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Total Marcas
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-zinc-900">{totalRegistros}</div>
                </CardContent>
            </Card>

            <Card className="shadow-sm border-neutral-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Jornadas Activas
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-amber-600">{jornadasAbiertas}</div>
                </CardContent>
            </Card>

            <Card className="shadow-sm border-neutral-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Altas Completas
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-emerald-600">{jornadasCompletadas}</div>
                </CardContent>
            </Card>

            <Card className="shadow-sm border-neutral-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Carga Horaria Promedio
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-zinc-900">{promedioHoras} hrs</div>
                </CardContent>
            </Card>
        </div>
    );
}