// File: frontend/src/components/admin/reports/GlobalDateRangePicker.tsx
'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, ChevronDown } from 'lucide-react';
import { AdminButton } from '@/src/components/admin/layout/admin-button';
import { AdminFilterDrawer } from '@/src/components/admin/layout/admin-filter-drawer';
import { format, subDays, startOfMonth, endOfMonth, startOfYear } from 'date-fns';

export default function GlobalDateRangePicker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const initialFrom = searchParams.get('dateFrom') || '';
  const initialTo = searchParams.get('dateTo') || '';

  const [dateFrom, setDateFrom] = useState(initialFrom);
  const [dateTo, setDateTo] = useState(initialTo);

  const applyFilters = (from: string, to: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (from) params.set('dateFrom', from);
    else params.delete('dateFrom');

    if (to) params.set('dateTo', to);
    else params.delete('dateTo');

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
    setIsOpen(false);
  };

  const setPreset = (days: number, isMonth = false, isYear = false) => {
    const today = new Date();
    let from = new Date();
    let to = today;

    if (isMonth) {
      from = startOfMonth(today);
      to = endOfMonth(today);
    } else if (isYear) {
      from = startOfYear(today);
    } else {
      from = subDays(today, days);
    }

    const fromStr = format(from, 'yyyy-MM-dd');
    const toStr = format(to, 'yyyy-MM-dd');
    
    setDateFrom(fromStr);
    setDateTo(toStr);
    applyFilters(fromStr, toStr);
  };

  const label = initialFrom && initialTo 
    ? `${initialFrom} - ${initialTo}`
    : initialFrom ? `Desde ${initialFrom}`
    : initialTo ? `Hasta ${initialTo}`
    : 'Filtrar por Fecha';

  return (
    <>
      <AdminButton 
        variant="outline" 
        size="default" 
        onClick={() => setIsOpen(true)}
        className="font-semibold text-slate-700 bg-white shadow-xs border-slate-200 w-full sm:w-auto"
        disabled={isPending}
      >
        <Calendar className="w-4 h-4 mr-1 text-slate-400" />
        {label}
        <ChevronDown className="w-3.5 h-3.5 ml-2 text-slate-400" />
      </AdminButton>

      <AdminFilterDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Rango de Fechas"
        description="Selecciona un rango para visualizar las métricas."
        onApply={() => applyFilters(dateFrom, dateTo)}
        onReset={() => {
          setDateFrom('');
          setDateTo('');
          applyFilters('', '');
        }}
      >
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setPreset(0)} className="text-xs p-2 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium text-slate-700 text-left">Hoy</button>
            <button type="button" onClick={() => setPreset(7)} className="text-xs p-2 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium text-slate-700 text-left">Últimos 7 días</button>
            <button type="button" onClick={() => setPreset(30)} className="text-xs p-2 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium text-slate-700 text-left">Últimos 30 días</button>
            <button type="button" onClick={() => setPreset(0, true)} className="text-xs p-2 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium text-slate-700 text-left">Este Mes</button>
            <button type="button" onClick={() => setPreset(0, false, true)} className="text-xs p-2 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium text-slate-700 col-span-2 text-center">Este Año</button>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Fecha Inicial</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-slate-900 outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Fecha Final</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-slate-900 outline-none focus:border-slate-400"
              />
            </div>
          </div>
        </div>
      </AdminFilterDrawer>
    </>
  );
}