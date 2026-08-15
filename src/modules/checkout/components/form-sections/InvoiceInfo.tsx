// File: frontend/src/modules/checkout/components/form-sections/InvoiceInfo.tsx
'use client';

import React, { useEffect } from 'react';
import { useFormContext, Controller, useWatch } from 'react-hook-form';
import { CheckoutFormData } from '../../schemas/checkout.schema';
import { InputV2 } from '@/components/ui/InputV2';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function InvoiceInfo() {
  const { register, control, formState: { errors }, setValue } = useFormContext<CheckoutFormData>();
  const invoiceType = useWatch({ control, name: 'invoiceInfo.type' });

  useEffect(() => {
    if (invoiceType === 'boleta') {
      setValue('invoiceInfo.businessName', '');
      setValue('invoiceInfo.documentNumber', '');
    }
  }, [invoiceType, setValue]);

  return (
    <section className="pt-6 border-t border-slate-200 mt-6 hidden">
      <h2 className="text-base font-semibold text-slate-900 mb-3 hidden">Comprobante de pago</h2>

      <Controller
        control={control}
        name="invoiceInfo.type"
        render={({ field }) => (
          <Tabs value={field.value} onValueChange={field.onChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-10 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <TabsTrigger value="boleta" className="rounded-lg text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900">
                Boleta
              </TabsTrigger>
              <TabsTrigger value="factura" className="rounded-lg text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900">
                Factura
              </TabsTrigger>
            </TabsList>

            <TabsContent value="factura" className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 animate-in fade-in-50 duration-200">
              <div>
                <InputV2 label="RUC" type="text" {...register('invoiceInfo.documentNumber')} aria-invalid={!!errors.invoiceInfo?.documentNumber} />
              </div>
              <div className="sm:col-span-2">
                <InputV2 label="Razón Social" type="text" {...register('invoiceInfo.businessName')} aria-invalid={!!errors.invoiceInfo?.businessName} />
              </div>
            </TabsContent>
          </Tabs>
        )}
      />
    </section>
  );
}