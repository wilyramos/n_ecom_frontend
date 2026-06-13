// File: frontend/components/admin/attendance/AttendanceStats.tsx
"use client";

import { useState } from "react";
import { AdminAttendance } from "@/src/schemas/attendance.schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, Wallet } from "lucide-react";

interface AttendanceStatsProps {
    records: AdminAttendance[];
}

export default function AttendanceStats({ records }: AttendanceStatsProps) {
    const [hourlyRate, setHourlyRate] = useState<number>(0);
    const [showCalculator, setShowCalculator] = useState<boolean>(false);

    const totalRegistros = records.length;
    const jornadasAbiertas = records.filter(r => !r.checkOut?.timestamp).length;
    
    const horasTotales = parseFloat(
        records.reduce((acc, curr) => acc + (curr.workHours ?? 0), 0).toFixed(2)
    );
    
    const promedioHoras = totalRegistros > 0 ? (horasTotales / totalRegistros).toFixed(1) : "0";
    const sueldoEstimado = parseFloat((horasTotales * hourlyRate).toFixed(2));

    return (
        <div className="space-y-4">
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="border-neutral-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Total Marcas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-zinc-900">{totalRegistros}</div>
                    </CardContent>
                </Card>

                <Card className="border-neutral-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Jornadas Activas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600">{jornadasAbiertas}</div>
                    </CardContent>
                </Card>

                <Card className="border-neutral-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Horas Totales (Filtradas)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">{horasTotales} hrs</div>
                        <p className="text-[10px] text-muted-foreground mt-1">Promedio: {promedioHoras} h/jornada</p>
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
                    {showCalculator ? "Ocultar Calculadora" : "Usar Calculadora de Sueldo"}
                </Button>
            </div>

            {showCalculator && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="md:col-span-2 p-4 bg-white border border-neutral-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                        <div className="space-y-0.5">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700">Parámetros de Cálculo</h4>
                            <p className="text-xs text-muted-foreground">Establezca el monto por hora para las {horasTotales} horas acumuladas en los filtros actuales.</p>
                        </div>
                        <div className="flex items-center gap-2 max-w-xs w-full">
                            <span className="text-xs font-semibold text-zinc-500 uppercase shrink-0">Tarifa por Hora:</span>
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
                                Sueldo Proyectado
                            </span>
                            <Wallet className="h-4 w-4 text-zinc-400" />
                        </div>
                        <div className="text-2xl font-bold font-mono tracking-tight mt-1 text-emerald-400">
                            {new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(sueldoEstimado)}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}