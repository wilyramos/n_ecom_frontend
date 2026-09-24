// File: frontend/src/modules/checkout/components/OrderSummary.tsx

'use client';

import React from 'react';
import Image from 'next/image';
import { useFormContext, useWatch } from 'react-hook-form';
import { useCartStore } from '@/src/store/cartStore';
import { CheckoutFormData } from '../schemas/checkout.schema';
import { Package } from 'lucide-react';

const MP_SURCHARGE_RATE = 0.12;

export default function OrderSummary() {
  const { cart, total } = useCartStore();
  const { control } = useFormContext<CheckoutFormData>();

  const paymentProvider = useWatch({
    control,
    name: 'payment.provider',
  });

  const deliveryMethod = useWatch({
    control,
    name: 'deliveryMethod',
  });

  const shippingCost: number = deliveryMethod === 'shipping' ? 0 : 0;
  const safeTotal: number = typeof total === 'number' && !isNaN(total) ? total : 0;
  const recargoFinanciero: number =
    paymentProvider === 'mercadopago' ? safeTotal * MP_SURCHARGE_RATE : 0;
  const totalFinal: number = safeTotal + shippingCost + recargoFinanciero;

  if (cart.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
        <Package size={28} className="text-muted-foreground/40 stroke-[1.5]" />
        <span>Tu carrito está vacío</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      {/* Lista de productos con margen perimetral para evitar corte del badge */}
      <div className="space-y-1.5 max-h-[360px] overflow-y-auto pt-2 pb-2 pr-2 -mr-2">
        {cart.map((item) => {
          const imageSrc = item.variant?.imagenes?.[0] ?? item.imagenes?.[0];
          const price = Number(item.variant?.precio ?? item.precio ?? 0);
          const cantidad = Number(item.cantidad ?? 1);
          const atributos = item.variant?.atributos
            ? Object.values(item.variant.atributos).join(' • ')
            : null;

          return (
            <div
              key={`${item._id}-${item.variant?._id ?? 'no-variant'}`}
              className="flex items-center gap-3.5 py-2.5 first:pt-1 last:pb-1 group"
            >
              {/* Contenedor relativo con margen perimetral seguro */}
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-xl border border-neutral-200/90 bg-white overflow-hidden flex items-center justify-center shadow-2xs">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={item.nombre}
                      width={56}
                      height={56}
                      className="object-contain p-1.5 w-full h-full"
                      unoptimized
                    />
                  ) : (
                    <Package size={20} className="text-neutral-300" />
                  )}
                </div>

                {/* Badge de cantidad */}
                <span className="absolute -top-2 -right-2 z-10 flex items-center justify-center h-5 min-w-[20px] px-1.5 text-[11px] font-semibold text-white bg-neutral-600/95 backdrop-blur-xs rounded-full ring-2 ring-white shadow-xs tabular-nums select-none">
                  {cantidad}
                </span>
              </div>

              {/* Detalles del producto */}
              <div className="flex-1 min-w-0 space-y-0.5">
                <p className="text-xs font-medium text-neutral-900 truncate leading-snug" title={item.nombre}>
                  {item.nombre}
                </p>
                {atributos && (
                  <p className="text-[11px] text-neutral-500 truncate font-normal">
                    {atributos}
                  </p>
                )}
                <p className="text-[11px] text-neutral-400 font-mono">
                  S/ {price.toFixed(2)} c/u
                </p>
              </div>

              {/* Total por fila */}
              <div className="text-right shrink-0">
                <span className="text-xs font-semibold text-neutral-900 tabular-nums">
                  S/ {(price * cantidad).toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desglose de Totales */}
      <div className="space-y-2 pt-4 mt-2 border-t border-neutral-200/80 text-xs">
        <div className="flex justify-between text-neutral-600">
          <span>Subtotal</span>
          <span className="font-medium text-neutral-900 tabular-nums">
            S/ {safeTotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-neutral-600">
          <span>Envío</span>
          <span className="font-medium text-neutral-900">
            {shippingCost === 0 ? 'Gratis' : `S/ ${shippingCost.toFixed(2)}`}
          </span>
        </div>

        {paymentProvider === 'mercadopago' && recargoFinanciero > 0 && (
          <div className="flex justify-between text-neutral-600">
            <span>Recargo pasarela (12 cuotas)</span>
            <span className="font-medium text-neutral-900 tabular-nums">
              S/ {recargoFinanciero.toFixed(2)}
            </span>
          </div>
        )}

        <div className="flex justify-between items-baseline pt-3 mt-1 border-t border-neutral-200/80">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-neutral-900 tracking-tight">Total</span>
            <span className="text-[11px] text-neutral-400">Incluye IGV (18%)</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-neutral-900 tracking-tight tabular-nums">
              S/ {totalFinal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}