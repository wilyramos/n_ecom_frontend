import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Package, ChevronRight, Clock, Check, X, CreditCard, Zap, ReceiptText } from 'lucide-react';
import getToken from '@/src/auth/token';
import { obtenerMisPedidos } from '@/src/modules/checkout/services/pedido.service';
import { IPedido, EstadoPedido, EstadoPago } from '@/src/modules/checkout/types/pedido.types';

function renderPaymentBadge(provider: string) {
  const p = provider.toLowerCase();
  if (p === 'powerpay') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--color-fg-primary)]">
        <Zap size={13} className="text-[var(--color-fg-action)]" /> Powerpay (Cuotas)
      </span>
    );
  }
  if (p === 'transferencia') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--color-fg-primary)]">
        <ReceiptText size={13} className="text-[var(--color-fg-muted)]" /> Transferencia / Yape
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--color-fg-primary)]">
      <CreditCard size={13} className="text-[var(--color-fg-muted)]" /> {provider.toUpperCase()}
    </span>
  );
}

function renderStatusBadge(status: EstadoPedido, paymentStatus: EstadoPago) {
  if (paymentStatus === 'approved') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[var(--color-brand-action-muted)] text-[var(--color-fg-primary)]">
        <Check size={12} className="text-[var(--color-brand-action)]" />
        {status === 'delivered' ? 'Entregado' : status === 'shipped' ? 'Enviado' : 'En preparación'}
      </span>
    );
  }
  if (paymentStatus === 'rejected' || status === 'canceled') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[var(--color-surface-secondary)] text-[var(--color-fg-muted)]">
        <X size={12} /> Cancelado
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[var(--color-surface-secondary)]/50 text-[var(--color-fg-primary)]">
      <Clock size={12} className="text-[var(--color-fg-muted)]" /> Pendiente de pago
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
      <div className="bg-[var(--color-surface-primary)] border border-[var(--color-border-default)] rounded-3xl p-10 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-[var(--color-brand-action-muted)] text-[var(--color-fg-muted)] flex items-center justify-center mx-auto">
          <Package size={24} />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-[var(--color-fg-primary)] tracking-tight">
            Aún no tienes pedidos
          </h2>
          <p className="text-xs text-[var(--color-fg-muted)] max-w-sm mx-auto">
            Cuando realices una compra en la tienda, podrás hacer seguimiento a su estado y detalles aquí.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-[var(--color-action-primary)] hover:bg-[var(--color-action-primary-hover)] text-[var(--color-fg-inverse)] text-xs font-medium transition-colors"
        >
          Explorar catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--color-border-default)] pb-4">
        <h1 className="text-xl font-semibold tracking-tight text-[var(--color-fg-primary)]">
          Mis compras ({pedidos.length})
        </h1>
        <p className="text-xs text-[var(--color-fg-muted)] mt-0.5">
          Historial y seguimiento de órdenes generadas con tu cuenta.
        </p>
      </div>

      <div className="space-y-3">
        {pedidos.map((pedido: IPedido) => (
          <Link
            key={pedido._id}
            href={`/profile/pedidos/${pedido._id}`}
            className="group block bg-[var(--color-surface-primary)] border border-[var(--color-border-default)] hover:border-[var(--color-fg-primary)] rounded-2xl p-5 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              {/* Bloque Identificador y Fecha */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-[var(--color-fg-primary)]">
                    #{pedido.orderNumber}
                  </span>
                  {renderStatusBadge(pedido.status, pedido.payment.status)}
                </div>
                <p className="text-[11px] text-[var(--color-fg-muted)]">
                  {new Date(pedido.createdAt).toLocaleDateString('es-PE', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>

              {/* Items preview & Método */}
              <div className="text-left sm:text-right space-y-1">
                <div className="text-sm font-bold text-[var(--color-fg-primary)]">
                  S/ {pedido.totalPrice.toFixed(2)}
                </div>
                <div className="flex items-center sm:justify-end gap-2">
                  {renderPaymentBadge(pedido.payment.provider)}
                </div>
              </div>

              {/* Icono Flecha */}
              <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full text-[var(--color-fg-muted)] group-hover:text-[var(--color-fg-primary)] group-hover:bg-[var(--color-brand-action-muted)] transition-colors">
                <ChevronRight size={18} />
              </div>
            </div>

            {/* Resumen de artículos */}
            <div className="mt-3 pt-3 border-t border-[var(--color-border-default)] text-[11px] text-[var(--color-fg-muted)] truncate">
              {pedido.items.map((it) => `${it.quantity}x ${it.nombre}`).join(' • ')}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}