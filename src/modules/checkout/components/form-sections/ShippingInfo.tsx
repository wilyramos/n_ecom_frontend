// File: frontend/src/modules/checkout/components/form-sections/ShippingInfo.tsx
'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { CheckoutFormData } from '../../schemas/checkout.schema';
import { InputV2 } from '@/components/ui/InputV2';
import UbigeoSelector from './UbigeoSelector';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Truck, Store, MapPin } from 'lucide-react';

export default function ShippingInfo() {
  const { register, control, formState: { errors } } = useFormContext<CheckoutFormData>();

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-black tracking-tight">Entrega</h2>
        </div>
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
            <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-slate-100/80 rounded-2xl border border-slate-200">
              <TabsTrigger
                value="shipping"
                className="rounded-2xl py-2.5 text-xs font-semibold transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 flex items-center justify-center gap-2 text-slate-500 hover:text-slate-900"
              >
                <Truck size={16} />
                <span>Envío a domicilio</span>
              </TabsTrigger>
              <TabsTrigger
                value="pickup"
                className="rounded-2xl py-2.5 text-xs font-semibold transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 flex items-center justify-center gap-2 text-slate-500 hover:text-slate-900"
              >
                <Store size={16} />
                <span>Recojo en tienda</span>
                <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                  Gratis
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="shipping" className="mt-4 space-y-2.5 animate-in fade-in duration-200">
              <UbigeoSelector />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="sm:col-span-2">
                  <InputV2 label="Dirección (Calle, Av., Mz., Jr.)" type="text" {...register('shippingAddress.direccion')} aria-invalid={!!errors.shippingAddress?.direccion} />
                </div>
                <div>
                  <InputV2 label="Número / Lote" type="text" {...register('shippingAddress.numero')} />
                </div>
                <div>
                  <InputV2 label="Piso / Dpto. (Opcional)" type="text" {...register('shippingAddress.pisoDpto')} />
                </div>
                <div className="sm:col-span-2">
                  <InputV2 label="Referencia de ubicación" type="text" {...register('shippingAddress.referencia')} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pickup" className="mt-4 animate-in fade-in duration-200">
              <Card className="rounded-2xl border border-slate-300 bg-slate-50/80  overflow-hidden">
                <CardContent className="px-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="text-blue-600" size={16} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-semibold text-slate-900">NEOSHOP importaciones</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Av. Caminos del Inca 257, Piso/Dpto 3, Tda 326<br />
                      Santiago de Surco, Lima - Perú
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 text-[10px] font-medium px-2 py-1 rounded-lg w-max ">
                      Atención: Lun a Sáb de 9:00am a 7:00pm
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      />
    </section>
  );
}