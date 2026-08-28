'use client';

import React from 'react';
import Image from 'next/image';
import { useFormContext, useWatch } from 'react-hook-form';
import { useCartStore } from '@/src/store/cartStore';

const MP_SURCHARGE_RATE = 0.12;

export default function OrderSummary() {
  const { cart, total } = useCartStore();
  const { control } = useFormContext();
  const paymentProvider = useWatch({ control, name: 'payment.provider' });
  const deliveryMethod = useWatch({ control, name: 'deliveryMethod' });

  const shippingCost = deliveryMethod === 'shipping' ? 0 : 0;
  const recargoFinanciero = paymentProvider === 'mercadopago' ? total * MP_SURCHARGE_RATE : 0;
  const totalFinal = total + shippingCost + recargoFinanciero;

  if (cart.length === 0) {
    return (
      <div className="py-6 text-center text-xs text-neutral-500">
        Tu carrito está vacío.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      {/* Lista de productos */}
      <div className="space-y-3 divide-y divide-neutral-200/60 max-h-[380px] overflow-y-auto pr-1">
        {cart.map((item) => {
          const imageSrc = item.variant?.imagenes?.[0] ?? item.imagenes?.[0];
          const price = item.variant?.precio ?? item.precio ?? 0;
          const atributos = item.variant?.atributos ? Object.values(item.variant.atributos).join(' / ') : null;

          return (
            <div key={`${item._id}-${item.variant?._id ?? 'no-variant'}`} className="flex items-center gap-3 pt-3 first:pt-0">
              <div className="relative w-12 h-12 flex-shrink-0 rounded border border-neutral-200 bg-white">
                {imageSrc && (
                  <Image src={imageSrc} alt={item.nombre} fill className="object-contain p-1" sizes="48px" unoptimized />
                )}
                <span className="absolute -top-1.5 -right-1.5 text-white text-[10px] font-medium h-4 w-4 rounded-full flex items-center justify-center bg-neutral-600">
                  {item.cantidad}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-neutral-900 truncate">
                  {item.nombre}
                </p>
                {atributos && (
                  <p className="text-[11px] text-neutral-500 truncate">
                    {atributos}
                  </p>
                )}
              </div>

              <div className="text-xs font-medium text-neutral-900 tabular-nums">
                S/ {(price * item.cantidad).toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desglose de Totales */}
      <div className="space-y-2 pt-4 mt-4 border-t border-neutral-200 text-xs">
        <div className="flex justify-between text-neutral-600">
          <span>Subtotal</span>
          <span className="font-medium text-neutral-900 tabular-nums">S/ {total.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-neutral-600">
          <span>Envío</span>
          <span className="font-medium text-neutral-900 tabular-nums">
            Gratis
          </span>
        </div>

        {paymentProvider === 'mercadopago' && (
          <div className="flex justify-between text-neutral-600">
            <span>Recargo pasarela (12 cuotas)</span>
            <span className="font-medium text-neutral-900 tabular-nums">
              S/ {recargoFinanciero.toFixed(2)}
            </span>
          </div>
        )}

        <div className="flex justify-between items-baseline pt-3 border-t border-neutral-200">
          <span className="text-sm font-semibold text-neutral-900">Total</span>
          <div className="text-right">
            <span className="text-lg font-bold text-neutral-900 tabular-nums">
              S/ {totalFinal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}