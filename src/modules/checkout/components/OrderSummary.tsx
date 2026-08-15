// File: frontend/src/modules/checkout/components/OrderSummary.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { useFormContext, useWatch } from 'react-hook-form';
import { useCartStore } from '@/src/store/cartStore';
import { MdOutlineImageNotSupported } from 'react-icons/md';

const MP_SURCHARGE_RATE = 0.12;

export default function OrderSummary() {
  const { cart, total } = useCartStore();
  const { control } = useFormContext();
  const paymentProvider = useWatch({ control, name: 'payment.provider' });
  const deliveryMethod = useWatch({ control, name: 'deliveryMethod' });

  const shippingCost = deliveryMethod === 'shipping' ? 15 : 0;
  const recargoFinanciero = paymentProvider === 'mercadopago' ? total * MP_SURCHARGE_RATE : 0;
  const totalFinal = total + shippingCost + recargoFinanciero;

  if (cart.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm font-medium text-slate-500">
          Tu carrito está vacío.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Lista de Productos */}
      <div className="flex-1 overflow-y-auto space-y-4 max-h-[380px] lg:max-h-none pr-2 scrollbar-thin">
        {cart.map((item) => {
          const imageSrc = item.variant?.imagenes?.[0] ?? item.imagenes?.[0];
          const price = item.variant?.precio ?? item.precio ?? 0;
          const atributos = item.variant?.atributos ? Object.values(item.variant.atributos).join(' / ') : null;

          return (
            <div key={`${item._id}-${item.variant?._id ?? 'no-variant'}`} className="flex items-center gap-4">
              <div className="relative w-16 h-16 flex-shrink-0 rounded-xl border bg-white border-slate-200 flex items-center justify-center overflow-visible">
                {imageSrc ? (
                  <Image src={imageSrc} alt={item.nombre} fill className="object-cover rounded-xl" sizes="64px" unoptimized />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-slate-300">
                    <MdOutlineImageNotSupported size={24} />
                  </div>
                )}
                <span className="absolute -top-0 -right-2 text-white text-xs font-medium h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center z-20 shadow-sm bg-slate-500">
                  {item.cantidad}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium leading-snug truncate text-slate-900">
                  {item.nombre}
                </h4>
                {atributos && (
                  <p className="text-xs mt-0.5 truncate text-slate-500">
                    {atributos}
                  </p>
                )}
              </div>

              <div className="text-sm font-medium whitespace-nowrap text-slate-900">
                S/ {(price * item.cantidad).toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desglose de Totales */}
      <div className="space-y-3 pt-6 mt-6 border-t border-slate-200">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-600">Subtotal</span>
          <span className="font-medium text-slate-900">S/ {total.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-600">Envío</span>
          <span className="font-medium text-slate-900">
            {shippingCost === 0 ? <span className="text-blue-600">Gratis</span> : `S/ ${shippingCost.toFixed(2)}`}
          </span>
        </div>

        {paymentProvider === 'mercadopago' && (
          <div className="flex justify-between items-center text-sm animate-in fade-in duration-200">
            <span className="text-blue-700">Recargo (12 Cuotas)</span>
            <span className="font-medium text-slate-900">
              S/ {recargoFinanciero.toFixed(2)}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-200">
          <span className="text-base font-medium text-slate-900">Total</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold text-slate-900">
              S/ {totalFinal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}