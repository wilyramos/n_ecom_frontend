// File: src/components/admin/layout/admin-metrics-group.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricItem {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  badgeText?: string;
  badgeVariant?: 'default' | 'blue' | 'amber' | 'emerald';
}

interface AdminMetricsGroupProps {
  metrics: MetricItem[];
  className?: string;
}

const BADGE_STYLES = {
  default: 'text-zinc-600 bg-zinc-100 border-zinc-200',
  blue: 'text-blue-700 bg-blue-50 border-blue-200/60',
  amber: 'text-amber-700 bg-amber-50 border-amber-200/60',
  emerald: 'text-emerald-700 bg-emerald-50 border-emerald-200/60',
};

export function AdminMetricsGroup({ metrics, className }: AdminMetricsGroupProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-zinc-200/70 rounded-xl border border-zinc-200/80 bg-white shadow-xs overflow-hidden',
        className
      )}
    >
      {metrics.map((metric, idx) => {
        const Icon = metric.icon;
        return (
          <div key={idx} className="p-4 flex flex-col justify-between space-y-2 hover:bg-zinc-50/40 transition-colors">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                {metric.title}
              </span>
              {Icon && <Icon className="w-3.5 h-3.5 text-zinc-400 shrink-0" />}
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <span className="text-xl font-bold tracking-tight text-zinc-900">
                {metric.value}
              </span>
              {metric.badgeText && (
                <span
                  className={cn(
                    'text-[10px] font-medium px-1.5 py-0.5 rounded border',
                    BADGE_STYLES[metric.badgeVariant || 'default']
                  )}
                >
                  {metric.badgeText}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}