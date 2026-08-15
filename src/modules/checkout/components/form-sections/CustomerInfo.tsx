// File: frontend/src/modules/checkout/components/form-sections/CustomerInfo.tsx
'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { CheckoutFormData } from '../../schemas/checkout.schema';
import { InputV2 } from '@/components/ui/InputV2';
import { SelectV2 } from '@/components/ui/SelectV2';

interface CustomerInfoProps {
  isAuth: boolean;
}

export default function CustomerInfo({ isAuth }: CustomerInfoProps) {
  const { register, formState: { errors } } = useFormContext<CheckoutFormData>();
  const router = useRouter();

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
     
          <h2 className="text-base font-semibold text-black tracking-tight">Contacto</h2>
        </div>

        {!isAuth && (
          <div className="text-xs text-slate-600 font-medium">
            <span>¿Tienes cuenta? </span>
            <button 
              type="button" 
              onClick={() => router.push('/auth/login?redirect=/checkout-v2')}
              className="text-slate-900 font-bold hover:underline focus:outline-none ml-0.5 transition-colors"
            >
              Iniciar sesión
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div className="sm:col-span-2">
          <InputV2 
            label="Correo electrónico" type="email"
            {...register('customerProfile.email')} aria-invalid={!!errors.customerProfile?.email}
          />
        </div>
        <div>
          <InputV2 
            label="Nombres" type="text"
            {...register('customerProfile.nombre')} aria-invalid={!!errors.customerProfile?.nombre}
          />
        </div>
        <div>
          <InputV2 
            label="Apellidos" type="text"
            {...register('customerProfile.apellidos')} aria-invalid={!!errors.customerProfile?.apellidos}
          />
        </div>
        
        {/* Selector reutilizable con SelectV2 */}
        <div>
          <SelectV2
            label="Tipo de Documento"
            {...register('customerProfile.tipoDocumento')}
            aria-invalid={!!errors.customerProfile?.tipoDocumento}
          >
            <option value="DNI">DNI</option>
            <option value="CE">Carnet de Extranjería</option>
            <option value="RUC">RUC</option>
            <option value="PASAPORTE">Pasaporte</option>
          </SelectV2>
        </div>

        <div>
          <InputV2 
            label="Número de Documento" type="text"
            {...register('customerProfile.numeroDocumento')} aria-invalid={!!errors.customerProfile?.numeroDocumento}
          />
        </div>
        
        <div className="sm:col-span-2">
          <InputV2 
            label="Teléfono móvil" type="tel"
            {...register('customerProfile.telefono')} aria-invalid={!!errors.customerProfile?.telefono}
          />
        </div>
      </div>
    </section>
  );
}