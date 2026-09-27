// File: frontend/src/modules/checkout/components/form-sections/CustomerInfo.tsx

'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { CheckoutFormData } from '../../schemas/checkout.schema';
import { InputV2 } from '@/components/ui/InputV2';
import { SelectV2 } from '@/components/ui/SelectV2';
import { Lock } from 'lucide-react';

interface CustomerInfoProps {
  isAuth: boolean;
}

export default function CustomerInfo({ isAuth }: CustomerInfoProps) {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<CheckoutFormData>();
  const router = useRouter();

  const tipoDocumento = useWatch({
    control,
    name: 'customerProfile.tipoDocumento',
  });

  const isDni = tipoDocumento === 'DNI';
  const isRuc = tipoDocumento === 'RUC';
  const maxDocLength = isDni ? 8 : isRuc ? 11 : 15;

  return (
    <section>
      <div className="flex items-center justify-between gap-2 mb-3">
        <h2 className="text-sm font-semibold text-neutral-900">Contacto</h2>

        {!isAuth && (
          <button
            type="button"
            onClick={() => router.push('/auth/login?redirect=/checkout-v2')}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer group"
          >
            <span>¿Ya tienes cuenta?</span>
            <span className="font-medium underline underline-offset-2 flex items-center gap-1 text-neutral-900">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              Inicia sesión
            </span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* Email */}
        <div className="sm:col-span-2">
          <div className="relative">
            <InputV2
              label="Correo electrónico *"
              type="email"
              readOnly={isAuth}
              tabIndex={isAuth ? -1 : 0}
              className={isAuth ? 'bg-neutral-100/70 text-neutral-600 cursor-not-allowed select-none pr-8' : ''}
              {...register('customerProfile.email')}
              aria-invalid={!!errors.customerProfile?.email}
            />
            {isAuth && (
              <Lock
                size={13}
                className="hidden absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
              />
            )}
          </div>
          {errors.customerProfile?.email && (
            <p className="text-[11px] text-rose-500 font-medium mt-1 ml-0.5">
              {errors.customerProfile.email.message}
            </p>
          )}
        </div>

        {/* Nombres */}
        <div>
          <InputV2
            label="Nombres *"
            type="text"
            {...register('customerProfile.nombre')}
            aria-invalid={!!errors.customerProfile?.nombre}
          />
          {errors.customerProfile?.nombre && (
            <p className="text-[11px] text-rose-500 font-medium mt-1 ml-0.5">
              {errors.customerProfile.nombre.message}
            </p>
          )}
        </div>

        {/* Apellidos */}
        <div>
          <InputV2
            label="Apellidos *"
            type="text"
            {...register('customerProfile.apellidos')}
            aria-invalid={!!errors.customerProfile?.apellidos}
          />
          {errors.customerProfile?.apellidos && (
            <p className="text-[11px] text-rose-500 font-medium mt-1 ml-0.5">
              {errors.customerProfile.apellidos.message}
            </p>
          )}
        </div>

        {/* Tipo de Documento */}
        <div>
          <SelectV2
            label="Tipo de documento *"
            {...register('customerProfile.tipoDocumento')}
            aria-invalid={!!errors.customerProfile?.tipoDocumento}
          >
            <option value="DNI">DNI</option>
            <option value="CE">Carnet de Extranjería</option>
            <option value="RUC">RUC</option>
            <option value="PASAPORTE">Pasaporte</option>
          </SelectV2>
          {errors.customerProfile?.tipoDocumento && (
            <p className="text-[11px] text-rose-500 font-medium mt-1 ml-0.5">
              {errors.customerProfile.tipoDocumento.message}
            </p>
          )}
        </div>

        {/* Número de Documento */}
        <div>
          <InputV2
            label={`Número de ${tipoDocumento || 'documento'} *`}
            type="text"
            maxLength={maxDocLength}
            {...register('customerProfile.numeroDocumento', {
              onChange: (e) => {
                if (isDni || isRuc) {
                  const cleaned = e.target.value.replace(/\D/g, '');
                  setValue('customerProfile.numeroDocumento', cleaned, { shouldValidate: true });
                }
              },
            })}
            aria-invalid={!!errors.customerProfile?.numeroDocumento}
          />
          {errors.customerProfile?.numeroDocumento && (
            <p className="text-[11px] text-rose-500 font-medium mt-1 ml-0.5">
              {errors.customerProfile.numeroDocumento.message}
            </p>
          )}
        </div>

        {/* Teléfono móvil */}
        <div className="sm:col-span-2">
          <InputV2
            label="Teléfono móvil (9 dígitos) *"
            type="tel"
            maxLength={9}
            placeholder="9XXXXXXXX"
            {...register('customerProfile.telefono', {
              onChange: (e) => {
                const cleaned = e.target.value.replace(/\D/g, '');
                setValue('customerProfile.telefono', cleaned, { shouldValidate: true });
              },
            })}
            aria-invalid={!!errors.customerProfile?.telefono}
          />
          {errors.customerProfile?.telefono && (
            <p className="text-[11px] text-rose-500 font-medium mt-1 ml-0.5">
              {errors.customerProfile.telefono.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}