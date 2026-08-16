// File: frontend/components/admin/attendance/AttendanceStats.tsx
"use client";

import { useState } from "react";
import { AdminAttendance, AttendanceGlobalStats } from "@/src/schemas/attendance.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, Wallet, CalendarDays, Hourglass, CheckCircle2, Clock } from "lucide-react";
import { formatDecimalHours } from "@/lib/utils";
import { AdminMetricCard } from "@/src/components/admin/layout/admin-metric-card";

interface AttendanceStatsProps {
    records: AdminAttendance[];
    globalStats: AttendanceGlobalStats;
}

export default function AttendanceStats({ records, globalStats }: AttendanceStatsProps) {
    const [hourlyRate, setHourlyRate] = useState<number>(0);
    const [showCalculator, setShowCalculator] = useState<boolean>(false);

    const totalDiasRango = globalStats.globalActiveDays;
    const horasTotalesRango = globalStats.globalWorkHours;
    const totalRegistrosRango = globalStats.globalTotalRecords;
    const promedioHorasDecimal = totalRegistrosRango > 0 ? horasTotalesRango / totalRegistrosRango : 0;
    const sueldoEstimadoGlobal = parseFloat((horasTotalesRango * hourlyRate).toFixed(2));
    const jornadasAbiertasVista = records.filter((r) => !r.checkOut?.timestamp).length;

    return (
        <div className="space-y-3">
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <AdminMetricCard
                    title="Total Marcas"
                    value={totalRegistrosRango}
                    icon={CheckCircle2}
                    description="Marcaciones en el rango filtrado"
                />

                <AdminMetricCard
                    title="Días Laborados"
                    value={`${totalDiasRango} días`}
                    icon={CalendarDays}
                    description="Fechas únicas con actividad"
                />

                <AdminMetricCard
                    title="Jornadas Abiertas"
                    value={jornadasAbiertasVista}
                    icon={Clock}
                    description="Sin salida registrada en esta página"
                />

                <AdminMetricCard
                    title="Horas Acumuladas"
                    value={formatDecimalHours(horasTotalesRango)}
                    icon={Hourglass}
                    description={`Promedio: ${formatDecimalHours(promedioHorasDecimal)} / jornada`}
                />
            </div>

            <div className="flex justify-end">
                <Button
                    type="button"
                    variant={showCalculator ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowCalculator(!showCalculator)}
                    className="text-xs gap-1.5 h-8 font-medium cursor-pointer border-admin-border"
                >
                    <Calculator className="h-3.5 w-3.5" />
                    {showCalculator ? "Ocultar Calculadora" : "Calcular Liquidación de Horas"}
                </Button>
            </div>

            {showCalculator && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="md:col-span-2 p-4 bg-admin-card border border-admin-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                        <div className="space-y-0.5">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-admin-fg-heading">
                                Cálculo de Liquidación
                            </h4>
                            <p className="text-xs text-admin-fg-muted">
                                Multiplica la tarifa por las <strong>{formatDecimalHours(horasTotalesRango)} acumuladas</strong> en el filtro.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 max-w-xs w-full">
                            <span className="text-xs font-semibold text-admin-fg-subtle uppercase shrink-0">S/ x Hora:</span>
                            <Input
                                type="number"
                                min="0"
                                step="0.5"
                                placeholder="0.00"
                                value={hourlyRate || ""}
                                onChange={(e) => setHourlyRate(Math.max(0, parseFloat(e.target.value) || 0))}
                                className="h-8 text-right font-mono text-xs border-admin-border bg-admin-card focus-visible:border-admin-border-focus"
                            />
                        </div>
                    </div>

                    <div className="border border-zinc-900 bg-zinc-900 text-white rounded-xl shadow-xs flex flex-col justify-center p-4">
                        <div className="flex items-center justify-between space-y-0 pb-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                Total Estimado
                            </span>
                            <Wallet className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div className="text-2xl font-bold font-mono tracking-tight text-emerald-400">
                            {new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(sueldoEstimadoGlobal)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}