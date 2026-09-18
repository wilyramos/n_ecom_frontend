import React from 'react';
import { cn } from '@/lib/utils';

export type StatusType =
  // Productos
  | 'active'
  | 'inactive'
  // Logística pedidos
  | 'awaiting_payment'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'canceled'
  | 'paid_but_out_of_stock'
  // Cobro pedidos
  | 'approved'
  | 'pending'
  | 'rejected'
  | string;

const STATUS_MAP: Record<string, { label: string; bg: string }> = {
  // Productos
  active: {
    label: 'Activo',
    bg: 'bg-emerald-600',
  },
  inactive: {
    label: 'Inactivo',
    bg: 'bg-zinc-500',
  },

  // Logística pedidos
  awaiting_payment: {
    label: 'Esperando Pago',
    bg: 'bg-amber-600',
  },
  processing: {
    label: 'En Preparación',
    bg: 'bg-blue-600',
  },
  shipped: {
    label: 'Enviado',
    bg: 'bg-indigo-600',
  },
  delivered: {
    label: 'Entregado',
    bg: 'bg-emerald-600',
  },
  canceled: {
    label: 'Cancelado',
    bg: 'bg-zinc-500',
  },
  paid_but_out_of_stock: {
    label: 'Sin Stock',
    bg: 'bg-rose-600',
  },

  // Cobro pedidos
  approved: {
    label: 'Pagado',
    bg: 'bg-emerald-600',
  },
  pending: {
    label: 'Pendiente',
    bg: 'bg-amber-600',
  },
  rejected: {
    label: 'Rechazado',
    bg: 'bg-rose-600',
  },
};

interface AdminStatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function AdminStatusBadge({ status, className }: AdminStatusBadgeProps) {
  const item = STATUS_MAP[status] || {
    label: status.replace(/_/g, ' '),
    bg: 'bg-zinc-600',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium text-white select-none whitespace-nowrap',
        item.bg,
        className
      )}
    >
      {item.label}
    </span>
  );
}