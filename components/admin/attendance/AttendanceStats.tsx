// File: frontend/components/admin/attendance/AttendanceStats.tsx
"use client";

import { useState } from "react";
import {
    Calculator,
    Wallet,
    CalendarDays,
    Hourglass,
    CheckCircle2,
    Clock,
} from "lucide-react";

import { AdminAttendance, AttendanceGlobalStats } from "@/src/schemas/attendance.schema";
import { AdminMetricsBar, type MetricItem } from "@/src/components/admin/layout/admin-metrics-bar";
import { AdminInput } from "@/src/components/admin/layout/admin-form-group";
import { AdminButton } from "@/src/components/admin/layout/admin-button";
import { formatDecimalHours } from "@/lib/utils";

interface AttendanceStatsProps {
    records: AdminAttendance[];
    globalStats: AttendanceGlobalStats;
}

export default function AttendanceStats({
    records,
    globalStats,
}: AttendanceStatsProps) {
    const [hourlyRate, setHourlyRate] = useState<number>(0);
    const [showCalculator, setShowCalculator] = useState<boolean>(false);

    const totalDiasRango = globalStats.globalActiveDays;
    const horasTotalesRango = globalStats.globalWorkHours;
    const totalRegistrosRango = globalStats.globalTotalRecords;
    const promedioHorasDecimal =
        totalRegistrosRango > 0 ? horasTotalesRango / totalRegistrosRango : 0;
    const sueldoEstimadoGlobal = parseFloat(
        (horasTotalesRango * hourlyRate).toFixed(2)
    );
    const jornadasAbiertasVista = records.filter((r) => !r.checkOut?.timestamp).length;

    const metrics: MetricItem[] = [
        {
            label: "Total Marcas",
            value: totalRegistrosRango,
            icon: CheckCircle2,
            hint: "En el rango",
            hintColor: "zinc",
        },
        {
            label: "Días con Actividad",
            value: `${totalDiasRango} días`,
            icon: CalendarDays,
            hint: "Únicos",
            hintColor: "blue",
        },
        {
            label: "Jornadas Abiertas",
            value: jornadasAbiertasVista,
            icon: Clock,
            hint: jornadasAbiertasVista > 0 ? "Sin salida" : "Al día",
            hintColor: jornadasAbiertasVista > 0 ? "amber" : "emerald",
        },
        {
            label: "Horas Acumuladas",
            value: formatDecimalHours(horasTotalesRango),
            icon: Hourglass,
            hint: `Prom. ${formatDecimalHours(promedioHorasDecimal)}`,
            hintColor: "emerald",
        },
    ];

    return (
        <div className="space-y-2.5">
            {/* Barra compacta y colapsable de métricas */}
            <AdminMetricsBar metrics={metrics} defaultOpen={true} />

            {/* Disparador y Calculadora de Liquidación */}
            <div className="flex justify-end">
                <AdminButton
                    type="button"
                    variant={showCalculator ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setShowCalculator(!showCalculator)}
                    icon={Calculator}
                    className="h-7 text-xs"
                >
                    {showCalculator ? "Ocultar Calculadora" : "Calcular Liquidación"}
                </AdminButton>
            </div>

            {showCalculator && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-in fade-in duration-200">
                    <div className="md:col-span-2 p-3.5 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                        <div className="space-y-0.5">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                                Liquidación de Horas
                            </h4>
                            <p className="text-xs text-slate-500">
                                Calculado sobre las{" "}
                                <strong className="text-slate-900 font-semibold">
                                    {formatDecimalHours(horasTotalesRango)}
                                </strong>{" "}
                                acumuladas en el filtro actual.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 max-w-xs w-full">
                            <span className="text-xs font-semibold text-slate-500 uppercase shrink-0">
                                S/ x Hora:
                            </span>
                            <AdminInput
                                type="number"
                                min="0"
                                step="0.5"
                                placeholder="0.00"
                                value={hourlyRate || ""}
                                onChange={(e) =>
                                    setHourlyRate(Math.max(0, parseFloat(e.target.value) || 0))
                                }
                                className="h-8 text-right font-mono text-xs w-28"
                            />
                        </div>
                    </div>

                    <div className="border border-zinc-900 bg-zinc-900 text-white rounded-xl shadow-2xs flex flex-col justify-center p-3.5">
                        <div className="flex items-center justify-between pb-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                                Total Estimado
                            </span>
                            <Wallet className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div className="text-xl font-bold font-mono tracking-tight text-emerald-400">
                            {new Intl.NumberFormat("es-PE", {
                                style: "currency",
                                currency: "PEN",
                            }).format(sueldoEstimadoGlobal)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}