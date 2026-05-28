"use client";

import { VendorReport } from "@/src/services/sales";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { formatCurrency } from "@/src/utils/formatCurrency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const COLORS = ["#0077B6", "#00B4D8", "#90E0EF", "#48CAE4", "#5467C3", "#03045E"];

export default function ChartsByVendors({ data }: { data: VendorReport[] }) {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
                {/* Donut Chart */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-base">Ventas por Vendedor</CardTitle>
                    </CardHeader>
                    <CardContent className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    dataKey="totalSales"
                                    nameKey="nombre"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={3}
                                >
                                    {data.map((_, i) => (
                                        <Cell
                                            key={i}
                                            fill={COLORS[i % COLORS.length]}
                                            className="hover:opacity-80 transition"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(value: number) => formatCurrency(value)}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Lista Detalle */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Detalle de Vendedores</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {data.map((v, i) => (
                                <div key={i} className="flex justify-between text-sm py-2 border-b border-border last:border-0">
                                    <span className="text-muted-foreground">{v.nombre}</span>
                                    <span className="font-semibold">{formatCurrency(v.totalSales)}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabla Resumen */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Resumen de Ventas</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Vendedor</TableHead>
                                <TableHead className="text-right">Ventas</TableHead>
                                <TableHead className="text-right">Unidades</TableHead>
                                <TableHead className="text-right"># Ventas</TableHead>
                                <TableHead className="text-right">Margen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((v, i) => (
                                <TableRow key={i}>
                                    <TableCell className="font-medium">{v.nombre}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(v.totalSales)}</TableCell>
                                    <TableCell className="text-right">{v.totalUnits}</TableCell>
                                    <TableCell className="text-right">{v.numSales}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(v.margin)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}