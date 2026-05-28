"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LabelList
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

type ProductData = {
    productId: string;
    nombre: string;
    margin: number;
    totalQuantity: number;
    totalSales: number;
}[];

export default function ChartsProducts({ data }: { data: ProductData }) {
    const maxSales = Math.max(...data.map((item) => item.totalSales));

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            {/* Gráfico de Ventas */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                        Total Ventas por Producto
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            barSize={24}
                        >
                            <XAxis
                                type="number"
                                hide
                                domain={[0, maxSales * 1.1]}
                            />
                            <YAxis
                                dataKey="nombre"
                                type="category"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                                width={100}
                            />
                            <Tooltip
                                cursor={{ fill: "hsl(var(--muted))" }}
                                formatter={(value: number) => formatCurrency(value)}
                                contentStyle={{ 
                                    backgroundColor: "hsl(var(--card))",
                                    borderColor: "hsl(var(--border))",
                                    borderRadius: "8px" 
                                }}
                            />
                            <Bar
                                dataKey="totalSales"
                                fill="hsl(var(--primary))"
                                radius={[0, 4, 4, 0]}
                            >
                                <LabelList
                                    dataKey="totalSales"
                                    position="right"
                                    formatter={(value: number) => formatCurrency(value)}
                                    style={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Detalle de Productos (Tabla) */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                        Detalle de Productos
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-border">
                                <TableHead>Producto</TableHead>
                                <TableHead className="text-right">Cant.</TableHead>
                                <TableHead className="text-right">Ventas</TableHead>
                                <TableHead className="text-right">Margen</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((p) => (
                                <TableRow key={p.productId} className="border-border">
                                    <TableCell className="font-medium">{p.nombre}</TableCell>
                                    <TableCell className="text-right text-muted-foreground">{p.totalQuantity}</TableCell>
                                    <TableCell className="text-right font-semibold">{formatCurrency(p.totalSales)}</TableCell>
                                    <TableCell className="text-right text-muted-foreground">{formatCurrency(p.margin)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}