// File: frontend/components/admin/attendance/AttendanceStats.tsx
"use client";

import { useState } from "react";
import { AdminAttendance, AttendanceGlobalStats } from "@/src/schemas/attendance.schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, Wallet, CalendarDays, Hourglass } from "lucide-react";
import { formatDecimalHours } from "@/lib/utils"; // <-- Importamos la función de formato

interface AttendanceStatsProps {
    records: AdminAttendance[];
    globalStats: AttendanceGlobalStats;
}

export default function AttendanceStats({ records, globalStats }: AttendanceStatsProps) {
    const [hourlyRate, setHourlyRate] = useState<number>(0);
    const [showCalculator, setShowCalculator] = useState<boolean>(false);

    // Días activos de jornadas en el rango filtrado completo
    const totalDiasRango = globalStats.globalActiveDays;
    // Horas acumuladas reales en todo el rango
    const horasTotalesRango = globalStats.globalWorkHours;
    // Cantidad total de registros bajo los criterios del filtro
    const totalRegistrosRango = globalStats.globalTotalRecords;

    // Promedio matemático decimal del universo total filtrado
    const promedioHorasDecimal = totalRegistrosRango > 0 ? horasTotalesRango / totalRegistrosRango : 0;

    // Cálculo del sueldo sobre el acumulado de todas las páginas (mantiene el valor decimal numérico interno)
    const sueldoEstimadoGlobal = parseFloat((horasTotalesRango * hourlyRate).toFixed(2));

    // Cuántas jornadas de la página actual permanecen abiertas (métrica de control operativa en tiempo real)
    const jornadasAbiertasVista = records.filter(r => !r.checkOut?.timestamp).length;

    return (
        <div className="space-y-4">
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="border-neutral-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Total Marcas (Filtro)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-zinc-900">{totalRegistrosRango}</div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">En todo el rango</p>
                    </CardContent>
                </Card>

                <Card className="border-neutral-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Días con Actividad
                        </CardTitle>
                        <CalendarDays className="h-3.5 w-3.5 text-zinc-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{totalDiasRango} días</div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Fechas únicas laboradas</p>
                    </CardContent>
                </Card>

                <Card className="border-neutral-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Jornadas Abiertas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600">{jornadasAbiertasVista}</div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">En esta página</p>
                    </CardContent>
                </Card>

                <Card className="border-neutral-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Horas Totales Rango
                        </CardTitle>
                        <Hourglass className="h-3.5 w-3.5 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        {/* Se muestra con el formato estructurado de Horas y Minutos */}
                        <div className="text-2xl font-bold text-emerald-600">{formatDecimalHours(horasTotalesRango)}</div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                            Promedio: {formatDecimalHours(promedioHorasDecimal)} /jornada
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end">
                <Button
                    type="button"
                    variant={showCalculator ? "default" : "outline"}
                    onClick={() => setShowCalculator(!showCalculator)}
                    className="text-xs gap-2 border-zinc-200 font-medium"
                >
                    <Calculator className="h-4 w-4" />
                    {showCalculator ? "Ocultar Calculadora" : "Calcular Liquidación de Rango"}
                </Button>
            </div>

            {showCalculator && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="md:col-span-2 p-4 bg-white border border-neutral-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                        <div className="space-y-0.5">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700">Parámetros Administrativos de Pago</h4>
                            <p className="text-xs text-muted-foreground">
                                Se computará el monto por hora sobre las <strong>{formatDecimalHours(horasTotalesRango)} acumuladas reales</strong> del filtro activo.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 max-w-xs w-full">
                            <span className="text-xs font-semibold text-zinc-500 uppercase shrink-0">Monto por Hora:</span>
                            <Input
                                type="number"
                                min="0"
                                step="0.5"
                                placeholder="0.00"
                                value={hourlyRate || ""}
                                onChange={(e) => setHourlyRate(Math.max(0, parseFloat(e.target.value) || 0))}
                                className="h-9 text-right font-mono text-sm border-zinc-200 focus-visible:ring-zinc-900 bg-zinc-50/30"
                            />
                        </div>
                    </div>

                    <Card className="border-neutral-200 bg-zinc-900 text-white shadow-sm flex flex-col justify-center p-4">
                        <div className="flex items-center justify-between space-y-0 pb-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                Sueldo Total Proyectado
                            </span>
                            <Wallet className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div className="text-2xl font-bold font-mono tracking-tight mt-1 text-emerald-400">
                            {new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(sueldoEstimadoGlobal)}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}