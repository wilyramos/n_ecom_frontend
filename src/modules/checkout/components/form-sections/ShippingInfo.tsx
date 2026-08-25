'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { CheckoutFormData } from '../../schemas/checkout.schema';
import { InputV2 } from '@/components/ui/InputV2';
import UbigeoSelector from './UbigeoSelector';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function ShippingInfo() {
  const { register, control, formState: { errors } } = useFormContext<CheckoutFormData>();

  return (
    <section>
      <div className="mb-2.5">
        <h2 className="text-sm font-semibold text-neutral-900">Entrega</h2>
      </div>

      <Controller
        control={control}
        name="deliveryMethod"
        render={({ field }) => (
          <Tabs
            value={field.value}
            onValueChange={field.onChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 h-9 p-0.5 bg-neutral-100 rounded-md border border-neutral-200">
              <TabsTrigger
                value="shipping"
                className="rounded text-xs font-medium py-1.5 data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-xs"
              >
                Envío a domicilio
              </TabsTrigger>
              <TabsTrigger
                value="pickup"
                className="rounded text-xs font-medium py-1.5 data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-xs"
              >
                Retiro en tienda
              </TabsTrigger>
            </TabsList>

            <TabsContent value="shipping" className="mt-3 space-y-2">
              <UbigeoSelector />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="sm:col-span-2">
                  <InputV2 label="Dirección y número" type="text" {...register('shippingAddress.direccion')} aria-invalid={!!errors.shippingAddress?.direccion} />
                </div>
                <div>
                  <InputV2 label="Departamento / Interior (Opcional)" type="text" {...register('shippingAddress.pisoDpto')} />
                </div>
                <div>
                  <InputV2 label="Referencia (Opcional)" type="text" {...register('shippingAddress.referencia')} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pickup" className="mt-3">
              <div className="p-3 rounded-md border border-neutral-200 bg-neutral-50/50 text-xs text-neutral-600 space-y-1">
                <p className="font-semibold text-neutral-900">NEOSHOP Surco</p>
                <p>Av. Caminos del Inca 257, Tienda 326, Santiago de Surco, Lima</p>
                <p className="text-neutral-500 pt-1">Horario: Lun a Sáb 9:00am - 7:00pm (Gratis)</p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      />
    </section>
  );
}