// File: frontend/app/(store)/profile/pedidos/page.tsx

import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Package,
  ChevronRight,
  Clock,
  Check,
  X,
  CreditCard,
  Zap,
  ReceiptText,
} from 'lucide-react';
import getToken from '@/src/auth/token';
import { obtenerMisPedidos } from '@/src/modules/checkout/services/pedido.service';
import { IPedido, EstadoPedido, EstadoPago } from '@/src/modules/checkout/types/pedido.types';

function renderPaymentBadge(provider: string) {
  const p = provider.toLowerCase();
  if (p === 'powerpay') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground">
        <Zap size={12} className="text-foreground" /> Powerpay
      </span>
    );
  }
  if (p === 'transferencia') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground">
        <ReceiptText size={12} className="text-muted-foreground" /> Transferencia
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground uppercase tracking-wide">
      <CreditCard size={12} className="text-muted-foreground" /> {provider}
    </span>
  );
}

function renderStatusBadge(status: EstadoPedido, paymentStatus: EstadoPago) {
  if (paymentStatus === 'approved') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-secondary text-foreground border border-border">
        <Check size={11} className="stroke-[2.5]" />
        {status === 'delivered' ? 'Entregado' : status === 'shipped' ? 'En camino' : 'En preparación'}
      </span>
    );
  }
  if (paymentStatus === 'rejected' || status === 'canceled') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-destructive/10 text-destructive border border-destructive/20">
        <X size={11} className="stroke-[2.5]" /> Cancelado
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-secondary text-muted-foreground border border-border">
      <Clock size={11} /> Pendiente de pago
    </span>
  );
}

export default async function ProfilePedidosPage() {
  const token = await getToken();

  if (!token) {
    redirect('/auth/login?redirect=/profile/pedidos');
  }

  const pedidos = await obtenerMisPedidos(token);

  if (!pedidos || pedidos.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-10 text-center space-y-4 shadow-2xs">
        <div className="w-12 h-12 rounded-full bg-secondary text-muted-foreground flex items-center justify-center mx-auto border border-border">
          <Package size={22} className="stroke-[1.5]" />
        </div>
        <div className="space-y-1">
          <h2 className="text-sm font-semibold text-foreground tracking-tight">
            Aún no tienes pedidos registrados
          </h2>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Cuando realices una compra en la tienda, podrás hacer seguimiento a su estado y detalles aquí.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center h-9 px-5 rounded-lg bg-foreground hover:bg-neutral-800 text-background text-xs font-medium transition-colors"
          >
            Explorar catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Mis compras
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Historial y seguimiento de pedidos generados con tu cuenta.
          </p>
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {pedidos.length} {pedidos.length === 1 ? 'orden' : 'órdenes'}
        </span>
      </div>

      <div className="space-y-3">
        {pedidos.map((pedido: IPedido) => (
          <Link
            key={pedido._id}
            href={`/profile/pedidos/${pedido._id}`}
            className="group block bg-card border border-border hover:border-neutral-400/80 rounded-xl p-4 sm:p-5 transition-all shadow-2xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Bloque Identificador y Fecha */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-foreground tracking-tight">
                    #{pedido.orderNumber}
                  </span>
                  {renderStatusBadge(pedido.status, pedido.payment.status)}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {new Date(pedido.createdAt).toLocaleDateString('es-PE', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>

              {/* Total y Método */}
              <div className="flex items-center justify-between sm:flex-col sm:items-end gap-1">
                <div className="text-sm font-semibold text-foreground tracking-tight">
                  S/ {pedido.totalPrice.toFixed(2)}
                </div>
                <div>{renderPaymentBadge(pedido.payment.provider)}</div>
              </div>

              {/* Icono Flecha */}
              <div className="hidden sm:flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground group-hover:text-foreground group-hover:bg-secondary transition-colors">
                <ChevronRight size={16} />
              </div>
            </div>

            {/* Resumen de artículos */}
            <div className="mt-3 pt-2.5 border-t border-border/80 text-[11px] text-muted-foreground truncate">
              {pedido.items.map((it) => `${it.quantity}x ${it.nombre}`).join(' • ')}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}