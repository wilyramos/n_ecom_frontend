// File: frontend/components/admin/layout/admin-stats-row.tsx
'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatItem {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  iconColor?: 'emerald' | 'blue' | 'amber' | 'neutral' | 'indigo';
  hint?: string;
  hintVariant?: 'emerald' | 'blue' | 'amber' | 'neutral';
  active?: boolean;
  onClick?: () => void;
}

interface AdminStatsRowProps {
  stats: StatItem[];
  className?: string;
}

const COLOR_VARIANTS = {
  emerald: {
    bg: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100/80',
    icon: 'text-emerald-600',
    activeBg: 'bg-emerald-600 text-white',
  },
  blue: {
    bg: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100/80',
    icon: 'text-blue-600',
    activeBg: 'bg-blue-600 text-white',
  },
  amber: {
    bg: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100/80',
    icon: 'text-amber-600',
    activeBg: 'bg-amber-600 text-white',
  },
  indigo: {
    bg: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100/80',
    icon: 'text-indigo-600',
    activeBg: 'bg-indigo-600 text-white',
  },
  neutral: {
    bg: 'bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200/80',
    icon: 'text-zinc-500',
    activeBg: 'bg-zinc-900 text-white',
  },
};

export function AdminStatsRow({ stats, className }: AdminStatsRowProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-zinc-200/80 rounded-xl border border-zinc-200/80 bg-white shadow-2xs overflow-hidden',
        className
      )}
    >
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        const isClickable = Boolean(stat.onClick);
        const palette = COLOR_VARIANTS[stat.iconColor || 'neutral'];

        return (
          <button
            key={idx}
            type="button"
            disabled={!isClickable}
            onClick={stat.onClick}
            className={cn(
              'group flex items-center justify-between gap-2.5 px-3.5 py-2 text-left transition-colors outline-none',
              isClickable && 'cursor-pointer hover:bg-zinc-50/70 active:bg-zinc-100/70',
              stat.active && 'bg-zinc-50/80'
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {Icon && (
                <div
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors',
                    stat.active ? palette.activeBg : palette.bg
                  )}
                >
                  <Icon
                    className={cn(
                      'h-3.5 w-3.5 transition-colors',
                      stat.active ? 'text-white' : palette.icon
                    )}
                  />
                </div>
              )}
              <span
                className={cn(
                  'text-[11.5px] truncate',
                  stat.active ? 'font-semibold text-zinc-900' : 'text-zinc-600 font-medium'
                )}
              >
                {stat.label}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className={cn(
                  'text-xs tracking-tight',
                  stat.active ? 'font-bold text-zinc-950' : 'font-semibold text-zinc-800'
                )}
              >
                {stat.value}
              </span>
              {stat.hint && (
                <span className="text-[10px] text-zinc-400 font-normal">
                  {stat.hint}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}