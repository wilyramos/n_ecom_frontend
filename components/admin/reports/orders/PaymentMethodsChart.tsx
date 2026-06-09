// frontend/src/components/admin/reports/orders/PaymentMethodsChart.tsx

"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import type { TOrdersByPaymentMethod } from "@/src/schemas"; // Asegúrate de tener este tipo

const COLORS = ["#93c5fd", "#bae6fd", "#60a5fa", "#7dd3fc"];

export default function PaymentMethodsChart({ data }: { data: TOrdersByPaymentMethod[] }) {

    // Transformar los datos del backend al formato que espera Recharts
    const chartData = (data || []).map(item => ({
        name: item.provider || "Desconocido", // Ajusta 'provider' según el campo de tu esquema
        value: item.totalSales // o numberOfOrders, según quieras graficar
    }));

    return (
        <div className="p-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Métodos de Pago</h3>
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100" />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                            {chartData.map((_, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}