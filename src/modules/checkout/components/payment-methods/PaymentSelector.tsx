// File: frontend/src/modules/checkout/components/payment-methods/PaymentSelector.tsx
'use client';

import { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { CheckoutFormData } from '../../schemas/checkout.schema';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { InputV2 } from '@/components/ui/InputV2';
import { CreditCard, Building2, Wallet, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function PaymentSelector() {
  const { control, register } = useFormContext<CheckoutFormData>();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copiado al portapapeles');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <div>
          <h2 className="text-base font-semibold text-black tracking-tight">Pago</h2>
          <p className="text-xs text-slate-500 mt-0.5">Todas las transacciones son seguras y están encriptadas.</p>
        </div>
      </div>

      <Controller
        control={control}
        name="payment.provider"
        render={({ field }) => (
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            className="flex flex-col bg-white border border-slate-300 rounded-2xl overflow-hidden "
          >
            {/* Mercado Pago */}
            <label className={cn(
              "relative flex flex-col p-4 cursor-pointer transition-colors border-b border-slate-200 last:border-b-0",
              field.value === 'mercadopago' ? "bg-slate-50/80" : "hover:bg-slate-50/50"
            )}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="mercadopago" id="mercadopago" className="sr-only" />
                  <div className={cn("w-4 h-4 rounded-full border flex flex-shrink-0 items-center justify-center transition-colors", field.value === 'mercadopago' ? "border-blue-600 bg-blue-600" : "border-slate-300 bg-white")}>
                    {field.value === 'mercadopago' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900">Mercado Pago</span>
                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Hasta 12 cuotas
                    </span>
                  </div>
                </div>
                <Wallet size={20} className={field.value === 'mercadopago' ? "text-blue-600" : "text-slate-400"} />
              </div>
              {field.value === 'mercadopago' && (
                <div className="mt-3 text-xs text-slate-600 font-normal leading-relaxed pl-7 animate-in fade-in duration-200">
                  Serás redirigido de forma segura a la pasarela de Mercado Pago para autorizar tu tarjeta o saldo.
                </div>
              )}
            </label>

            {/* Culqi */}
            <label className={cn(
              "relative flex flex-col p-4 cursor-pointer transition-colors border-b border-slate-200 last:border-b-0",
              field.value === 'culqi' ? "bg-slate-50/80" : "hover:bg-slate-50/50"
            )}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="culqi" id="culqi" className="sr-only" />
                  <div className={cn("w-4 h-4 rounded-full border flex flex-shrink-0 items-center justify-center transition-colors", field.value === 'culqi' ? "border-blue-600 bg-blue-600" : "border-slate-300 bg-white")}>
                    {field.value === 'culqi' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <span className="text-sm font-medium text-slate-900">Tarjeta de Débito / Crédito</span>
                </div>
                <CreditCard size={20} className={field.value === 'culqi' ? "text-blue-600" : "text-slate-400"} />
              </div>
              {field.value === 'culqi' && (
                <div className="mt-3 text-xs text-slate-600 font-normal leading-relaxed pl-7 animate-in fade-in duration-200">
                  Pago directo con Visa, Mastercard, Diners o Amex a través del formulario protegido de Culqi.
                </div>
              )}
            </label>

            {/* Transferencia */}
            <label className={cn(
              "relative flex flex-col p-4 cursor-pointer transition-colors border-b border-slate-200 last:border-b-0",
              field.value === 'transferencia' ? "bg-slate-50/80" : "hover:bg-slate-50/50"
            )}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="transferencia" id="transferencia" className="sr-only" />
                  <div className={cn("w-4 h-4 rounded-full border flex flex-shrink-0 items-center justify-center transition-colors", field.value === 'transferencia' ? "border-blue-600 bg-blue-600" : "border-slate-300 bg-white")}>
                    {field.value === 'transferencia' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <span className="text-sm font-medium text-slate-900">Transferencia Bancaria / Yape</span>
                </div>
                <Building2 size={20} className={field.value === 'transferencia' ? "text-blue-600" : "text-slate-400"} />
              </div>
              
              {field.value === 'transferencia' && (
                <div className="mt-4 space-y-4 pl-7 animate-in fade-in duration-200">
                  <p className="text-xs text-slate-600 font-normal">Realiza tu depósito directo a nuestra cuenta oficial:</p>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 flex flex-col gap-2 ">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">BCP Soles: <span className="font-mono text-slate-900 font-medium ml-1">191-987654321-0-12</span></span>
                      <button type="button" onClick={() => copyToClipboard('191-987654321-0-12')} className="text-slate-400 hover:text-blue-600 transition-colors p-1" title="Copiar número de cuenta">
                        {copied ? <Check size={16} className="text-blue-600" /> : <Copy size={16} />}
                      </button>
                    </div>
                    <div className="h-px w-full bg-slate-100"></div>
                    <span className="text-slate-600">Titular: <span className="font-medium text-slate-900 ml-1">NEOSHOP.</span></span>
                  </div>
                  <div>
                    <InputV2 
                      label="N° de Operación o Constancia Yape (Opcional)" 
                      type="text" 
                      {...register('payment.paymentCode')} 
                    />
                  </div>
                </div>
              )}
            </label>
          </RadioGroup>
        )}
      />
    </section>
  );
}