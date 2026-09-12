// File: frontend/src/modules/checkout/components/CheckoutClient.tsx

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { useForm, FormProvider, Path, Controller } from 'react-hook-form';
import { checkoutSchema, CheckoutFormData } from '../schemas/checkout.schema';
import CustomerInfo from './form-sections/CustomerInfo';
import ShippingInfo from './form-sections/ShippingInfo';
import InvoiceInfo from './form-sections/InvoiceInfo';
import PaymentSelector from './payment-methods/PaymentSelector';
import OrderSummary from './OrderSummary';
import { crearPedidoAction, procesarCargoCulqiAction } from '../actions/checkout.actions';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/src/store/cartStore';
import { useCulqi } from '../hooks/useCulqi';
import { toast } from 'sonner';
import { Loader2, Lock, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import PowerpayCheckoutWidget from '@/src/components/powerpay/PowerpayCheckoutWidget';

interface CheckoutClientProps {
  initialCustomerData: {
    nombre: string;
    apellidos: string;
    email: string;
    telefono: string;
  } | null;
  isAuth: boolean;
  token?: string;
}

const MP_SURCHARGE_RATE = 0.12;

export default function CheckoutClient({ initialCustomerData, isAuth }: CheckoutClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cart, total, clearCart } = useCartStore();

  const activeOrderNumberRef = useRef<string | null>(null);
  const activeCulqiTokenRef = useRef<string | null>(null);

  const methods = useForm<CheckoutFormData>({
    defaultValues: {
      customerProfile: {
        nombre: initialCustomerData?.nombre || '',
        apellidos: initialCustomerData?.apellidos || '',
        email: initialCustomerData?.email || '',
        telefono: initialCustomerData?.telefono || '',
        tipoDocumento: 'DNI',
        numeroDocumento: '',
      },
      deliveryMethod: 'shipping',
      shippingAddress: {
        departamento: '',
        provincia: '',
        distrito: '',
        direccion: '',
        numero: '',
        pisoDpto: '',
        referencia: '',
      },
      invoiceInfo: { type: 'boleta', documentNumber: '', businessName: '' },
      payment: { provider: 'culqi', method: 'online', paymentCode: '' },
      acceptTerms: true,
    },
  });

  const paymentProvider = methods.watch('payment.provider');
  const deliveryMethod = methods.watch('deliveryMethod');

  const shippingCost = deliveryMethod === 'shipping' ? 0 : 0;
  const recargoFinanciero = paymentProvider === 'mercadopago' ? total * MP_SURCHARGE_RATE : 0;
  const totalFinalCalculado = total + shippingCost + recargoFinanciero;

  // 🔴 1. GESTIÓN DEL FLUJO DE CARGO Y 3DS
  const handleCulqiTokenSuccess = useCallback(
    async (tokenOrOrderId: string) => {
      // console.log('✅ [CheckoutClient] handleCulqiTokenSuccess invocado con ID:', tokenOrOrderId);
      
      const orderNumber = activeOrderNumberRef.current;
      if (!orderNumber) {
        // console.error('❌ [CheckoutClient] No se encontró activeOrderNumberRef.');
        toast.error('No se encontró una orden activa.');
        return;
      }

      setIsSubmitting(true);
      activeCulqiTokenRef.current = tokenOrOrderId;
      // console.log(`🔑 [CheckoutClient] Token o ID de orden guardado: ${tokenOrOrderId}`);
      // console.log(`📦 [CheckoutClient] Token o ID de orden guardado: ${tokenOrOrderId}`);

      try {
        // console.log(`📡 [CheckoutClient] Enviando petición a procesarCargoCulqiAction para la orden ${orderNumber}...`);
        const resultadoCargo = await procesarCargoCulqiAction(orderNumber, tokenOrOrderId);
        // console.log('📥 [CheckoutClient] Respuesta de procesarCargoCulqiAction:', resultadoCargo);


        if (!resultadoCargo) {
           throw new Error('El servidor no respondió correctamente. Por favor recarga la página e intenta de nuevo.');
        }

        if (!resultadoCargo.success) {
          // console.warn('⚠️ [CheckoutClient] El servidor rechazó la transacción:', resultadoCargo.message);
          toast.error(resultadoCargo.message || 'El pago fue rechazado. Revisa tu tarjeta e intenta nuevamente.');
          setIsSubmitting(false);
          return;
        }

        // 🛡️ SI EL BANCO PIDE VALIDACIÓN 3D SECURE (SMS/CLAVE)
        if (resultadoCargo.data?.status === 'requires_3ds') {
          // console.log('🛡️ [3DS] Iniciando validación 3D Secure con el banco...');
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const culqi3DS = (window as any).Culqi3DS;

          if (culqi3DS) {
            culqi3DS.publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY;
            culqi3DS.settings = {
              charge: {
                totalAmount: Math.round(totalFinalCalculado * 100),
                returnUrl: window.location.origin + `/checkout-result/verifying?orderNumber=${orderNumber}`
              },
              card: { email: methods.getValues('customerProfile.email').trim().toLowerCase() }
            };
            
            // Abre la pantallita flotante de "Verified by Visa / Mastercard SecureCode"
            culqi3DS.initAuthentication(tokenOrOrderId);
            return; 
          } else {
            // console.error('❌ [3DS] window.Culqi3DS no está definido.');
            toast.error('Librería de seguridad del banco no disponible.');
            setIsSubmitting(false);
            return;
          }
        }

        // console.log('🚀 [CheckoutClient] Transacción pre-aprobada por el servidor. Redirigiendo a Verifying...');
        clearCart();
        router.push(`/checkout-result/verifying?orderNumber=${orderNumber}`);
        
      } catch (error) {
        console.error('Excepción al procesar el cargo:', error);
        toast.error('Error de conexión al verificar el pago con el servidor.');
        setIsSubmitting(false);
      }
    },
    [clearCart, router, methods, totalFinalCalculado]
  );

  // 🔴 2. ESCUCHADOR DEL RESULTADO DE LA PANTALLA 3DS DEL BANCO
  useEffect(() => {
    const handle3DSMessage = async (event: MessageEvent) => {
      if (event.origin === window.location.origin) {
        const response = event.data;
        
        // Si el usuario validó el SMS con éxito
        if (response.parameters3DS) {
          // console.log('✅ [3DS] Autenticación completada. Re-enviando cargo al backend con el token de seguridad...');
          const orderNumber = activeOrderNumberRef.current;
          const token = activeCulqiTokenRef.current;

          if (orderNumber && token) {
            try {
              const res = await procesarCargoCulqiAction(orderNumber, token, response.parameters3DS);
              
              if (res.success && res.data?.status === 'approved') {
                // console.log('🚀 [3DS] Cobro final aprobado por el banco.');
                clearCart();
                router.push(`/checkout-result/verifying?orderNumber=${orderNumber}`);
              } else {
                toast.error(res.message || 'Transacción denegada tras validar tu identidad.');
                setIsSubmitting(false);
              }
            } catch {
              toast.error('Error procesando el cobro final.');
              setIsSubmitting(false);
            }
          }
        } 
        // Si el usuario cerró la ventana del banco o falló
        else if (response.error) {
          console.error('❌ [3DS] Fallo/Cierre del modal bancario:', response.error);
          toast.error(typeof response.error === 'string' ? response.error : 'Validación de identidad cancelada o fallida.');
          setIsSubmitting(false);
        }
      }
    };

    window.addEventListener('message', handle3DSMessage);
    return () => window.removeEventListener('message', handle3DSMessage);
  }, [clearCart, router]);

  const {
    isScriptLoaded,
    isProcessing: isCulqiProcessing,
    openCulqiModal,
    handleScriptLoad,
    handleScriptError,
  } = useCulqi({
    onSuccess: handleCulqiTokenSuccess,
    onError: (errorMessage) => {
      console.warn('⚠️ [CheckoutClient] Transacción denegada o abortada detectada en hook:', errorMessage);
    },
    onClose: () => {
      // console.log('🛑 [CheckoutClient] Modal cerrado por el usuario detectado en hook.');
      toast.info('Cancelaste el proceso de pago. Puedes volver a intentarlo cuando desees.');
    },
  });

  const onSubmit = async (formData: CheckoutFormData) => {
    // console.log('📋 [CheckoutClient] onSubmit iniciado con datos:', formData);

    if (cart.length === 0) {
      toast.error('Tu carrito está vacío.');
      return;
    }

    const parsed = checkoutSchema.safeParse(formData);
    if (!parsed.success) {
      // console.warn('⚠️ [CheckoutClient] Errores de validación en formulario:', parsed.error.issues);
      parsed.error.issues.forEach((issue) => {
        methods.setError(issue.path.join('.') as Path<CheckoutFormData>, {
          type: 'manual',
          message: issue.message,
        });
      });
      toast.error('Por favor, completa los campos requeridos y acepta los términos.');
      document.querySelector('[aria-invalid="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const orderPayload = {
      ...parsed.data,
      shippingAddress:
        formData.deliveryMethod === 'pickup'
          ? {
              departamento: 'Lima',
              provincia: 'Lima',
              distrito: 'Santiago de Surco',
              direccion: 'Av. Caminos del Inca 257 (Recojo en Tienda)',
              numero: '',
              pisoDpto: '',
              referencia: 'Tienda Oficial',
            }
          : formData.shippingAddress,
      invoiceInfo: parsed.data.invoiceInfo?.type === 'factura' ? parsed.data.invoiceInfo : undefined,
      items: cart.map((item) => ({
        productId: item._id,
        variantId: item.variant?._id,
        variantAttributes: item.variant?.atributos,
        quantity: item.cantidad,
        price: item.variant?.precio ?? item.precio ?? 0,
        nombre: item.nombre,
        imagen: item.variant?.imagenes?.[0] ?? item.imagenes?.[0],
      })),
      shippingCost,
      currency: 'PEN',
      payment: {
        provider: parsed.data.payment.provider,
        method: parsed.data.payment.method || parsed.data.payment.provider,
        paymentCode: parsed.data.payment.paymentCode,
      },
    };

    // console.log('📦 [CheckoutClient] Payload preparado para crearPedidoAction:', orderPayload);
    setIsSubmitting(true);

    try {
      const response = await crearPedidoAction(orderPayload);
      // console.log('📥 [CheckoutClient] Respuesta de crearPedidoAction:', response);

      if (!response.success || !response.data) {
        // console.error('❌ [CheckoutClient] Error al crear pedido en BD:', response.message);
        toast.error(response.message || 'No se pudo crear el pedido.');
        setIsSubmitting(false);
        return;
      }

      const pedidoCreado = response.data.pedido;
      const culqiOrderId = response.data.culqiOrderId || undefined;
      const initPointUrl = response.data.initPoint;

      activeOrderNumberRef.current = pedidoCreado.orderNumber;

      if (formData.payment.provider === 'culqi') {
        const amountInCents = Math.round(totalFinalCalculado * 100);
        const cleanPhone = formData.customerProfile.telefono.replace(/\D/g, '').substring(0, 15);

        // console.log(`💳 [CheckoutClient] Abriendo modal de Culqi. Monto: ${amountInCents}, Orden: ${culqiOrderId}`);
        openCulqiModal(
          amountInCents,
          {
            email: formData.customerProfile.email.trim().toLowerCase(),
            first_name: formData.customerProfile.nombre.trim(),
            last_name: formData.customerProfile.apellidos.trim(),
            phone_number: cleanPhone || '999999999',
          },
          pedidoCreado.orderNumber,
          culqiOrderId
        );
        setIsSubmitting(false);
      } else if (formData.payment.provider === 'mercadopago' || formData.payment.provider === 'powerpay') {
        clearCart();
        if (initPointUrl) {
          // console.log(`🔗 [CheckoutClient] Redirigiendo a pasarela externa: ${initPointUrl}`);
          window.location.href = initPointUrl;
        } else {
          // console.error('❌ [CheckoutClient] Faltó el initPointUrl para redirección externa.');
          toast.error('Error al redirigir al portal de pago.');
          setIsSubmitting(false);
        }
      } else {
        toast.success('Pedido registrado.');
        clearCart();
        router.push(`/checkout-result/verifying?orderNumber=${pedidoCreado.orderNumber}`);
      }
    } catch (e) {
      console.error(' Excepción durante el proceso de submit:', e);
      toast.error('Ocurrió un error inesperado al procesar la solicitud.');
      setIsSubmitting(false);
    }
  };

  const isCulqiWaiting = paymentProvider === 'culqi' && !isScriptLoaded;
  const isFormLocked = isSubmitting || isCulqiProcessing || cart.length === 0 || isCulqiWaiting;

  return (
    <FormProvider {...methods}>
      <Script
        id="culqi-checkout-v4"
        src="https://checkout.culqi.com/js/v4"
        strategy="afterInteractive"
        onLoad={() => {
          // console.log('✅ [Script] culqi.com/js/v4 cargado correctamente.');
          handleScriptLoad();
        }}
        onError={() => {
          // console.error('❌ [Script] Error cargando culqi.com/js/v4.');
          handleScriptError();
        }}
      />
      {/* 🔴 SCRIPT OFICIAL DEL BANCO PARA 3DS - Cargado temprano */}
      <Script id="culqi-3ds-v1" src="https://3ds.culqi.com" strategy="afterInteractive" />

      <div className="w-full flex flex-col lg:flex-row min-h-[calc(100vh-57px)]">
        <div className="block lg:hidden w-full bg-[#FAFAFA] border-b border-neutral-200">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="summary" className="border-b-0">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center justify-between w-full pr-2 text-xs font-medium text-neutral-800">
                  <span>Mostrar resumen de compra</span>
                  <span className="font-semibold text-neutral-900 text-sm">
                    S/ {totalFinalCalculado.toFixed(2)}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-6 pt-2 bg-white border-t border-neutral-100">
                <OrderSummary />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="w-full lg:w-[58%] bg-white flex justify-center lg:justify-end lg:border-r lg:border-neutral-200">
          <div className="w-full max-w-xl px-4 sm:px-8 lg:pr-14 py-8 sm:py-10">
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
              
              <CustomerInfo isAuth={isAuth} />
              
              <ShippingInfo />
              
              <div>
                <PaymentSelector />
                {paymentProvider === 'powerpay' && (
                  <div className="mt-3">
                    <PowerpayCheckoutWidget total={totalFinalCalculado} />
                  </div>
                )}
              </div>
              
              <InvoiceInfo />

              <div className="bg-blue-50/60 border border-blue-100 rounded-lg p-3.5 sm:p-4 flex gap-3 items-start">
                <Info className="text-gray-500 mt-0.5 flex-shrink-0" size={18} />
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-gray-900">Emisión de Comprobante</h4>
                  <p className="text-[11px] text-gray-800/80 leading-relaxed">
                    Tu comprobante de pago electrónico será emitido utilizando los <strong>datos personales y el domicilio</strong> que has registrado en este formulario.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Controller
                  control={methods.control}
                  name="acceptTerms"
                  render={({ field, fieldState: { error } }) => (
                    <div className="space-y-1.5">
                      <label className="flex items-start gap-2.5 cursor-pointer select-none group">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 focus:ring-offset-0 transition-colors cursor-pointer"
                        />
                        <span className="text-xs text-neutral-600 leading-relaxed group-hover:text-neutral-900 transition-colors">
                          He leído y acepto los{' '}
                          <Link
                            href="/terminos-y-condiciones"
                            target="_blank"
                            className="font-medium text-neutral-900 underline underline-offset-2 hover:text-black"
                          >
                            términos y condiciones
                          </Link>{' '}
                          y las políticas de privacidad de la tienda.
                        </span>
                      </label>
                      {error && <p className="text-[11px] text-red-600 font-medium pl-6">{error.message}</p>}
                    </div>
                  )}
                />
              </div>

              <div className="pt-1">
                <Button
                  type="submit"
                  disabled={isFormLocked}
                  className="w-full h-12 bg-neutral-900 hover:bg-black text-white font-medium rounded-lg text-sm transition-all duration-150 disabled:opacity-50 shadow-sm cursor-pointer"
                >
                  {isSubmitting || isCulqiProcessing ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin" size={16} />
                      <span>Procesando pedido...</span>
                    </div>
                  ) : isCulqiWaiting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin" size={16} />
                      <span>Conectando pasarela segura...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Lock size={15} />
                      <span>Pagar S/ {totalFinalCalculado.toFixed(2)}</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="hidden lg:flex w-full lg:w-[42%] bg-[#F5F5F7] justify-start">
          <div className="w-full max-w-md px-8 lg:pl-12 py-10 sticky top-[57px] h-fit">
            <OrderSummary />
          </div>
        </div>
      </div>
    </FormProvider>
  );
}