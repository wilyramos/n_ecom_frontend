// File: frontend/src/modules/checkout/components/form-sections/ShippingInfo.tsx

'use client';

import { useFormContext, Controller, useWatch } from 'react-hook-form';
import { CheckoutFormData } from '../../schemas/checkout.schema';
import { InputV2 } from '@/components/ui/InputV2';
import { SelectV2 } from '@/components/ui/SelectV2';
import UbigeoSelector from './UbigeoSelector';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MapPin, ExternalLink, Clock } from 'lucide-react';

const STORE_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Neoshop+Importaciones+Av+caminos+del+inca+257+Surco';

export default function ShippingInfo() {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<CheckoutFormData>();

  const hasDifferentReceiver = useWatch({ control, name: 'hasDifferentReceiver' });
  const deliveryMethod = useWatch({ control, name: 'deliveryMethod' });
  const tipoDocReceptor = useWatch({ control, name: 'receiverInfo.tipoDocumento' });

  const isDniReceptor = tipoDocReceptor === 'DNI';
  const maxDocLength = isDniReceptor ? 8 : 15;

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
                  <InputV2
                    label="Dirección y número *"
                    type="text"
                    {...register('shippingAddress.direccion')}
                    aria-invalid={!!errors.shippingAddress?.direccion}
                  />
                  {errors.shippingAddress?.direccion && (
                    <p className="text-[11px] text-rose-500 font-medium mt-1 ml-0.5">
                      {errors.shippingAddress.direccion.message}
                    </p>
                  )}
                </div>
                <div>
                  <InputV2
                    label="Departamento / Interior (Opcional)"
                    type="text"
                    {...register('shippingAddress.pisoDpto')}
                  />
                </div>
                <div>
                  <InputV2
                    label="Referencia (Opcional)"
                    type="text"
                    {...register('shippingAddress.referencia')}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pickup" className="mt-3">
              <div className="p-3.5 rounded-lg border border-neutral-200 bg-neutral-50/70 text-xs text-neutral-600 space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <p className="font-semibold text-neutral-900 text-sm">NEOSHOP Surco</p>
                    <p className="text-neutral-700 leading-snug">
                      Av. Caminos del Inca 257, Piso 3 - Tda 326, Santiago de Surco, Lima
                    </p>
                    <p className="text-[11.5px] text-neutral-500 flex items-center gap-1.5 pt-0.5">
                      <Clock size={13} className="shrink-0 text-neutral-400" />
                      <span>Lun a Sáb: 12:00 pm - 8:00 pm</span>
                    
                    </p>
                  </div>

                  <a
                    href={STORE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11.5px] font-semibold text-neutral-900 bg-white hover:bg-neutral-100 rounded-md   transition-colors shrink-0 cursor-pointer"
                    title="Ver ubicación en Google Maps"
                  >
                    <MapPin size={13} className="text-rose-500" />
                    <span>Ver mapa</span>
                    <ExternalLink size={12} className="text-neutral-400" />
                  </a>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      />

      <div className="mt-4 pt-4 border-t border-neutral-100 space-y-4">
        <Controller
          control={control}
          name="hasDifferentReceiver"
          render={({ field }) => (
            <label className="flex items-start gap-2.5 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 focus:ring-offset-0 transition-colors cursor-pointer"
              />
              <span className="text-xs text-neutral-800 font-medium leading-relaxed group-hover:text-neutral-900 transition-colors">
                Otra persona {deliveryMethod === 'pickup' ? 'recogerá' : 'recibirá'} el pedido
              </span>
            </label>
          )}
        />

        {hasDifferentReceiver && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div>
              <InputV2
                label="Nombres de quien recibe *"
                type="text"
                {...register('receiverInfo.nombre')}
                aria-invalid={!!errors.receiverInfo?.nombre}
              />
              {errors.receiverInfo?.nombre && (
                <p className="text-[11px] text-rose-500 font-medium mt-1 ml-0.5">
                  {errors.receiverInfo.nombre.message}
                </p>
              )}
            </div>

            <div>
              <InputV2
                label="Apellidos de quien recibe *"
                type="text"
                {...register('receiverInfo.apellidos')}
                aria-invalid={!!errors.receiverInfo?.apellidos}
              />
              {errors.receiverInfo?.apellidos && (
                <p className="text-[11px] text-rose-500 font-medium mt-1 ml-0.5">
                  {errors.receiverInfo.apellidos.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <InputV2
                label="Teléfono móvil (9 dígitos) *"
                type="tel"
                maxLength={9}
                placeholder="9XXXXXXXX"
                {...register('receiverInfo.telefono', {
                  onChange: (e) => {
                    const cleaned = e.target.value.replace(/\D/g, '');
                    setValue('receiverInfo.telefono', cleaned, { shouldValidate: true });
                  },
                })}
                aria-invalid={!!errors.receiverInfo?.telefono}
              />
              {errors.receiverInfo?.telefono && (
                <p className="text-[11px] text-rose-500 font-medium mt-1 ml-0.5">
                  {errors.receiverInfo.telefono.message}
                </p>
              )}
            </div>

            <div>
              <SelectV2
                label="Tipo de documento *"
                {...register('receiverInfo.tipoDocumento')}
                aria-invalid={!!errors.receiverInfo?.tipoDocumento}
              >
                <option value="DNI">DNI</option>
                <option value="CE">Carnet de Extranjería</option>
                <option value="PASAPORTE">Pasaporte</option>
              </SelectV2>
              {errors.receiverInfo?.tipoDocumento && (
                <p className="text-[11px] text-rose-500 font-medium mt-1 ml-0.5">
                  {errors.receiverInfo.tipoDocumento.message}
                </p>
              )}
            </div>

            <div>
              <InputV2
                label={`Número de ${tipoDocReceptor || 'documento'} *`}
                type="text"
                maxLength={maxDocLength}
                {...register('receiverInfo.numeroDocumento', {
                  onChange: (e) => {
                    if (isDniReceptor) {
                      const cleaned = e.target.value.replace(/\D/g, '');
                      setValue('receiverInfo.numeroDocumento', cleaned, { shouldValidate: true });
                    }
                  },
                })}
                aria-invalid={!!errors.receiverInfo?.numeroDocumento}
              />
              {errors.receiverInfo?.numeroDocumento && (
                <p className="text-[11px] text-rose-500 font-medium mt-1 ml-0.5">
                  {errors.receiverInfo.numeroDocumento.message}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4">
        <InputV2
          label="Instrucciones especiales de entrega (Opcional)"
          type="text"
          placeholder="Ej: Dejar en portería, agencia Shalom/Olva..."
          {...register('deliveryNotes')}
          aria-invalid={!!errors.deliveryNotes}
        />
        {errors.deliveryNotes && (
          <p className="text-[11px] text-rose-500 font-medium mt-1 ml-0.5">
            {errors.deliveryNotes.message}
          </p>
        )}
      </div>
    </section>
  );
}