"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DataPoint = { label: string; ventas: number; cantidadVentas: number; unidadesVendidas: number; };

export default function ChartsSales({ data }: { data: DataPoint[] }) {
    const formattedData = data.map((item) => {
        let newLabel = item.label;
        if (/^\d{4}-\d{2}$/.test(item.label)) {
            const [year, month] = item.label.split("-").map(Number);
            newLabel = format(new Date(year, month - 1), "MMM yyyy", { locale: es });
        } else if (/^\d{4}-\d{2}-\d{2}$/.test(item.label)) {
            const [year, month, day] = item.label.split("-").map(Number);
            newLabel = format(new Date(year, month - 1, day), "dd MMM", { locale: es });
        }
        return { ...item, label: newLabel };
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Evolución de Ventas</CardTitle>
            </CardHeader>
            <CardContent className="h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="label" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                        <Line type="monotone" dataKey="ventas" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} name="Ventas" />
                        <Line type="monotone" dataKey="cantidadVentas" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 3 }} name="Nº Ventas" />
                        <Line type="monotone" dataKey="unidadesVendidas" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={{ r: 3 }} name="Unidades" />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}