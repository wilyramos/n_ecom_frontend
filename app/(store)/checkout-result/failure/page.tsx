// File: frontend/app/(store)/checkout-result/failure/page.tsx

import Link from 'next/link';
import { X, RefreshCw, ShoppingBag, AlertCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FailurePageProps {
  searchParams: Promise<{
    order?: string;
    reason?: string;
  }>;
}

export default async function FailurePage({ searchParams }: FailurePageProps) {
  const resolvedParams = await searchParams;
  const orderNumber = resolvedParams?.order;
  const reason = resolvedParams?.reason?.toLowerCase();

  const getErrorMessage = () => {
    switch (reason) {
      case 'canceled':
        return 'La operación fue cancelada durante el proceso de pago o evaluación.';
      case 'expired':
        return 'El tiempo límite para completar la transacción ha expirado.';
      default:
        return 'No pudimos procesar la transacción con el medio de pago seleccionado.';
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-[var(--color-surface-primary)]">
      <div className="w-full max-w-xl bg-[var(--color-surface-primary)] border border-[var(--color-border-default)] rounded-3xl p-6 sm:p-10 space-y-8">
        
        {/* Indicador Visual de Error */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-[var(--color-brand-action-muted)] text-[var(--color-fg-primary)] flex items-center justify-center">
            <X size={26} strokeWidth={2.5} />
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--color-fg-primary)]">
              No se pudo completar el pago
            </h1>
            <p className="text-xs text-[var(--color-fg-muted)] max-w-sm mx-auto">
              {getErrorMessage()}
            </p>
          </div>
        </div>

        {/* Resumen del Intento */}
        {orderNumber && (
          <div className="border border-[var(--color-border-default)] rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-default)]">
              <span className="text-xs font-medium text-[var(--color-fg-muted)] uppercase tracking-wider">
                Referencia de Orden
              </span>
              <span className="font-mono text-sm font-semibold text-[var(--color-fg-primary)] select-all">
                #{orderNumber}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--color-fg-muted)] uppercase tracking-wider">
                Estado del Cargo
              </span>
              <span className="text-xs font-medium text-[var(--color-fg-primary)] capitalize">
                {reason || 'Declinado / Sin cargo'}
              </span>
            </div>
          </div>
        )}

        {/* Recomendaciones */}
        <div className="border border-[var(--color-border-default)] bg-[var(--color-brand-action-muted)] rounded-2xl p-5 space-y-3 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-fg-primary)]">
            <AlertCircle size={15} />
            <span>Sugerencias para continuar:</span>
          </div>
          <ul className="text-[11px] text-[var(--color-fg-primary)]/80 space-y-1.5 list-disc list-inside leading-relaxed">
            <li>Verifica que la tarjeta cuente con saldo disponible y compras por internet habilitadas.</li>
            <li>Si utilizaste cuotas o financiamiento, revisa que los datos de identidad ingresados coincidan exactamente.</li>
            <li>Puedes reintentar el pago seleccionando otro método como Transferencia directa, Yape u otra tarjeta.</li>
          </ul>
        </div>

        {/* Soporte Directo */}
        <div className="flex items-center justify-between p-4 border border-[var(--color-border-default)] rounded-2xl text-xs">
          <div className="flex items-center gap-2 text-[var(--color-fg-muted)]">
            <HelpCircle size={15} />
            <span>¿Tienes inconvenientes con tu pago?</span>
          </div>
          <a
            href="https://wa.me/51902900653?text=Hola,%20tuve%20un%20problema%20al%20realizar%20mi%20pago"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-[var(--color-fg-primary)] hover:underline"
          >
            Contactar Asesor
          </a>
        </div>

        {/* Acciones */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <Button asChild className="w-full sm:flex-1 h-12 bg-[var(--color-action-primary)] hover:bg-[var(--color-action-primary-hover)] text-[var(--color-fg-inverse)] rounded-full text-xs font-medium transition-colors">
            <Link href="/checkout-v2">
              <RefreshCw className="mr-2" size={14} /> Reintentar checkout
            </Link>
          </Button>

          <Button asChild variant="ghost" className="w-full sm:w-auto h-12 px-6 rounded-full text-[var(--color-fg-primary)] hover:bg-[var(--color-brand-action-muted)] text-xs font-medium">
            <Link href="/">
              <ShoppingBag className="mr-2" size={14} /> Volver a la tienda
            </Link>
          </Button>
        </div>

      </div>
    </main>
  );
}