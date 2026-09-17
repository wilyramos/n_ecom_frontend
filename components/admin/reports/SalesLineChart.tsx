// File: frontend/src/components/admin/reports/SalesLineChart.tsx
'use client';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartProps {
  data: Array<{ periodo: string; totalRecaudado: number; cantidadPedidos: number }>;
}

export default function SalesLineChart({ data }: ChartProps) {
  if (!data || data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-sm text-slate-400">No hay datos para el periodo seleccionado</div>;
  }

  return (
    <div className="h-72 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="periodo" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `S/ ${val}`} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => [`S/ ${value.toFixed(2)}`, 'Ventas']}
            labelStyle={{ color: '#0f172a', fontWeight: 'bold', marginBottom: '4px' }}
          />
          <Line type="monotone" dataKey="totalRecaudado" stroke="#0f172a" strokeWidth={3} dot={{ r: 3, fill: '#0f172a' }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}