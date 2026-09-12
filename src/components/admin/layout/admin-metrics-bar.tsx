// File: src/components/admin/layout/admin-metrics-bar.tsx
'use client';

import React, { useState } from 'react';
import { LucideIcon, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface MetricItem {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  hint?: string;
  hintColor?: 'zinc' | 'blue' | 'amber' | 'emerald';
}

interface AdminMetricsBarProps {
  metrics: MetricItem[];
  defaultOpen?: boolean;
  className?: string;
}

const HINT_COLORS = {
  zinc: 'text-slate-400',
  blue: 'text-blue-600 font-medium',
  amber: 'text-amber-600 font-medium',
  emerald: 'text-emerald-600 font-medium',
};

export function AdminMetricsBar({
  metrics,
  defaultOpen = false,
  className,
}: AdminMetricsBarProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white transition-all overflow-hidden shadow-xs',
        className
      )}
    >
      {/* Barra superior de control / estado colapsado */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50/70 border-b border-slate-200 text-[11px] font-medium text-slate-500">
        <span className="text-slate-600 font-semibold tracking-tight uppercase text-[10px]">
          Resumen
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen((prev) => !prev)}
          className="h-6 px-1.5 text-[11px] text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 flex items-center gap-1 font-normal cursor-pointer"
        >
          {isOpen ? (
            <>
              Ocultar <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              Mostrar <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </Button>
      </div>

      {/* Contenedor horizontal ultra compacto */}
      {isOpen && (
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-white">
          {metrics.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="px-3.5 py-2 flex items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
              >
                <div className="min-w-0">
                  <span className="text-[10px] font-medium text-slate-400 block truncate">
                    {item.label}
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-sm font-semibold text-slate-900 tracking-tight">
                      {item.value}
                    </span>
                    {item.hint && (
                      <span className={cn('text-[10px]', HINT_COLORS[item.hintColor || 'zinc'])}>
                        {item.hint}
                      </span>
                    )}
                  </div>
                </div>

                {Icon && (
                  <div className="p-1 rounded bg-slate-100 text-slate-400 shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}