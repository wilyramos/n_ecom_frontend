// File: frontend/src/components/admin/reports/ReportsNavTabs.tsx
'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BarChart3, LineChart, PackageSearch, Users } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Resumen', path: '/admin/reports', icon: BarChart3, isImplemented: true },
  { label: 'Ventas y Finanzas', path: '/admin/reports/sales', icon: LineChart, isImplemented: false },
  { label: 'Productos', path: '/admin/reports/products', icon: PackageSearch, isImplemented: false },
  { label: 'Clientes', path: '/admin/reports/customers', icon: Users, isImplemented: false },
];

export default function ReportsNavTabs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="border-b border-slate-200 bg-white px-2">
      <nav className="-mb-px flex space-x-6 overflow-x-auto no-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path;
          const href = `${item.path}?${searchParams.toString()}`;
          const Icon = item.icon;

          if (!item.isImplemented) {
            return (
              <div
                key={item.path}
                className="whitespace-nowrap flex items-center gap-2 py-3.5 px-2 border-b-2 border-transparent font-medium text-sm text-slate-400 cursor-not-allowed select-none"
              >
                <Icon className="w-4 h-4 text-slate-300" />
                <span>{item.label}</span>
                <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-500 uppercase tracking-wider">
                  Pendiente
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.path}
              href={href}
              className={cn(
                'whitespace-nowrap flex items-center gap-2 py-3.5 px-2 border-b-2 font-medium text-sm transition-colors',
                isActive
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-slate-900" : "text-slate-400")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}