'use client';

import Image from 'next/image';
import { useFormContext, Controller } from 'react-hook-form';
import { CheckoutFormData } from '../../schemas/checkout.schema';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

export default function PaymentSelector() {
  const { control } = useFormContext<CheckoutFormData>();

  return (
    <section>
      <div className="mb-2.5">
        <h2 className="text-sm font-semibold text-neutral-900">Pago</h2>
      </div>

      <Controller
        control={control}
        name="payment.provider"
        render={({ field }) => (
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            className="flex flex-col bg-white border border-neutral-300 rounded-md overflow-hidden divide-y divide-neutral-200"
          >
            {/* Tarjeta de Crédito / Débito (Culqi) */}
            <label
              className={cn(
                "flex items-center justify-between p-3.5 cursor-pointer transition-colors",
                field.value === 'culqi' ? "bg-neutral-50/60" : "hover:bg-neutral-50/30"
              )}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="culqi" id="culqi" className="sr-only" />
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
                    field.value === 'culqi' ? "border-neutral-900 bg-neutral-900" : "border-neutral-300 bg-white"
                  )}
                >
                  {field.value === 'culqi' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                <span className="text-xs font-medium text-neutral-900">Tarjeta</span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="h-5 w-8 relative flex items-center justify-center bg-white border border-neutral-200 rounded px-1">
                  <Image src="/payments/visa.png" alt="Visa" width={28} height={18} className="object-contain" />
                </div>
                <div className="h-5 w-8 relative flex items-center justify-center bg-white border border-neutral-200 rounded px-1">
                  <Image src="/payments/mastercard.png" alt="Mastercard" width={24} height={18} className="object-contain" />
                </div>
                <div className="h-5 w-8 relative flex items-center justify-center bg-white border border-neutral-200 rounded px-1">
                  <Image src="/payments/amex.png" alt="American Express" width={24} height={18} className="object-contain" />
                </div>
                <div className="h-5 w-8 relative flex items-center justify-center bg-white border border-neutral-200 rounded px-1">
                  <Image src="/payments/diners.png" alt="Diners Club" width={24} height={18} className="object-contain" />
                </div>
              </div>
            </label>

            {/* Powerpay */}
            <label
              className={cn(
                "flex items-center justify-between p-3.5 cursor-pointer transition-colors",
                field.value === 'powerpay' ? "bg-neutral-50/60" : "hover:bg-neutral-50/30"
              )}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="powerpay" id="powerpay" className="sr-only" />
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
                    field.value === 'powerpay' ? "border-neutral-900 bg-neutral-900" : "border-neutral-300 bg-white"
                  )}
                >
                  {field.value === 'powerpay' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-neutral-900">Powerpay</span>

                </div>
              </div>

              <div className="h-5 w-14 relative flex items-center justify-center">
                <Image src="/payments/powerpay.svg" alt="Powerpay" width={52} height={16} className="object-contain" />
              </div>
            </label>

            {/* Mercado Pago */}
            {/* <label
              className={cn(
                "flex items-center justify-between p-3.5 cursor-pointer transition-colors",
                field.value === 'mercadopago' ? "bg-neutral-50/60" : "hover:bg-neutral-50/30"
              )}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="mercadopago" id="mercadopago" className="sr-only" />
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
                    field.value === 'mercadopago' ? "border-neutral-900 bg-neutral-900" : "border-neutral-300 bg-white"
                  )}
                >
                  {field.value === 'mercadopago' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                <span className="text-xs font-medium text-neutral-900">Mercado Pago</span>
              </div>

              <div className="h-5 w-14 relative flex items-center justify-center">
                <Image src="/payments/mercadopago.png" alt="Mercado Pago" width={52} height={16} className="object-contain" />
              </div>
            </label> */}
          </RadioGroup>
        )}
      />
    </section>
  );
}