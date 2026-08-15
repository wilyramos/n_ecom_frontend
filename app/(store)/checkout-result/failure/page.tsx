// File: frontend/app/(store)/checkout-result/failure/page.tsx

import React from 'react';
import Link from 'next/link';
import { XCircle, RefreshCw, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FailurePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600">
            <XCircle size={40} />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">No se pudo procesar el pago</h1>
          <p className="text-sm text-gray-600">
            Tu transacción fue rechazada o cancelada en el portal de pago.
          </p>
        </div>

        <div className="bg-red-50 p-4 rounded-md border border-red-200 text-left text-xs text-red-700 space-y-1">
          <p>• Revisa que los datos de tu tarjeta o saldo disponible sean correctos.</p>
          <p>• Puedes intentar nuevamente seleccionando otro método de pago (Yape, Transferencia directa u otra tarjeta).</p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="default" className="bg-black hover:bg-gray-900">
            <Link href="/checkout-v2">
              <RefreshCw className="mr-2 h-4 w-4" /> Reintentar checkout
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <ShoppingBag className="mr-2 h-4 w-4" /> Volver a la tienda
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}