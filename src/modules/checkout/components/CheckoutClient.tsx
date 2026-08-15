// File: frontend/src/modules/checkout/components/CheckoutClient.tsx
'use client';

import { useTransition, useRef, useCallback } from 'react';
import Script from 'next/script';
import { useForm, FormProvider, Path } from 'react-hook-form';
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
import { Loader2, ShoppingBag, Lock } from 'lucide-react';
import { IPedido } from '../types/pedido.types';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
  const [isPending, startTransition] = useTransition();
  const { cart, total, clearCart } = useCartStore();

  const pedidoGuardadoRef = useRef<IPedido | null>(null);

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
        departamento: '', provincia: '', distrito: '', direccion: '', numero: '', pisoDpto: '', referencia: '',
      },
      invoiceInfo: { type: 'boleta', documentNumber: '', businessName: '' },
      payment: { provider: 'mercadopago', method: 'online', paymentCode: '' },
    },
  });

  const paymentProvider = methods.watch('payment.provider');
  const deliveryMethod = methods.watch('deliveryMethod');

  const shippingCost = deliveryMethod === 'shipping' ? 15 : 0;
  const recargoFinanciero = paymentProvider === 'mercadopago' ? total * MP_SURCHARGE_RATE : 0;
  const totalFinalCalculado = total + shippingCost + recargoFinanciero;

  const handleCulqiTokenSuccess = useCallback(async (tokenOrOrderId: string) => {
    const pedidoActual = pedidoGuardadoRef.current;
    if (!pedidoActual) {
      toast.error('No se encontró una orden previa activa para cobrar.');
      return;
    }

    startTransition(async () => {
      try {
        const resultadoCargo = await procesarCargoCulqiAction(pedidoActual.orderNumber, tokenOrOrderId);

        if (resultadoCargo.success) {
          toast.success('Pago confirmado exitosamente.');
          clearCart();
          router.push(`/checkout-result/success/${pedidoActual.orderNumber}`);
        } else {
          toast.error(resultadoCargo.message || 'El pago fue rechazado.');
          router.push(`/checkout-result/failure?order=${pedidoActual.orderNumber}`);
        }
      } catch {
        toast.error('Error al procesar la confirmación del pago.');
      }
    });
  }, [clearCart, router]);

  const { isScriptLoaded, isProcessing: isCulqiProcessing, openCulqiModal, handleScriptLoad, handleScriptError } = useCulqi({
    onSuccess: handleCulqiTokenSuccess,
  });

  const onSubmit = async (formData: CheckoutFormData) => {
    if (cart.length === 0) {
      toast.error('Tu carrito está vacío.');
      return;
    }

    const parsed = checkoutSchema.safeParse(formData);

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        methods.setError(issue.path.join('.') as Path<CheckoutFormData>, {
          type: 'manual',
          message: issue.message,
        });
      });
      toast.error('Por favor, completa los campos obligatorios.');
      document.querySelector('[aria-invalid="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const shippingAddress = formData.deliveryMethod === 'pickup'
      ? {
        departamento: 'Ica', provincia: 'Chincha', distrito: 'Sunampe',
        direccion: 'Av. Oscar R. Benavides 456 (Recojo en Tienda)', numero: '', pisoDpto: '', referencia: 'Oficina Central GoPhone',
      }
      : formData.shippingAddress;

    const orderPayload = {
      ...parsed.data,
      shippingAddress,
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

    startTransition(async () => {
      // 🚀 VERIFICAR SI YA HAY UNA ORDEN CREADA ACTIVA PARA NO DUPLICAR
      let pedidoCreado = pedidoGuardadoRef.current;
      let culqiOrderIdExtraido: string | undefined = undefined;

      // Solo si NO hay orden guardada previamente (o si la pasarela cambió), llamamos al backend para crear.
      if (!pedidoCreado || pedidoCreado.payment.provider !== formData.payment.provider) {
        const response = await crearPedidoAction(orderPayload);

        if (!response.success || !response.data) {
          toast.error(response.message || 'No se pudo crear el pedido.');
          return;
        }

        pedidoCreado = response.data.pedido;
        pedidoGuardadoRef.current = pedidoCreado;
        culqiOrderIdExtraido = response.data.culqiOrderId || undefined;
      } else {
        // Si ya teníamos la orden, simplemente extraemos su ID de la pasarela que guardó el backend antes.
        culqiOrderIdExtraido = pedidoCreado.payment.gatewayOrderId && pedidoCreado.payment.gatewayOrderId.startsWith('ord_')
          ? pedidoCreado.payment.gatewayOrderId
          : undefined;
      }

      if (formData.payment.provider === 'culqi') {
        const amountInCents = Math.round(totalFinalCalculado * 100);

        openCulqiModal(
          amountInCents,
          { email: formData.customerProfile.email },
          pedidoCreado.orderNumber,
          culqiOrderIdExtraido
        );

      } else if (formData.payment.provider === 'mercadopago') {
        clearCart();
        // NOTA: Para no romper MP, si cambian de pasarela a MP, el backend genera uno nuevo arriba.
        // Aquí no se guarda `initPoint` en el ref, así que si ya estaba creado MP, habría que refactorizarlo un poco
        // pero por ahora enfoquémonos en Culqi que es el que falla.
        if (pedidoCreado.payment.gatewayOrderId?.includes('http')) {
          window.location.href = pedidoCreado.payment.gatewayOrderId;
        } else {
          // En caso de emergencia, reenviamos para que genere el link de nuevo (Solo aplica si el usuario baila entre MP y Culqi)
          const responseFallback = await crearPedidoAction(orderPayload);
          if (responseFallback.success && responseFallback.data?.initPoint) {
            window.location.href = responseFallback.data.initPoint;
          }
        }
      } else {
        toast.success('Pedido registrado correctamente.');
        clearCart();
        router.push(`/checkout-v2/success/${pedidoCreado.orderNumber}`);
      }
    });
  };

  const isCulqiWaiting = paymentProvider === 'culqi' && !isScriptLoaded;
  const isFormLocked = isPending || isCulqiProcessing || cart.length === 0 || isCulqiWaiting;

  return (
    <FormProvider {...methods}>
      <Script
        src="https://js.culqi.com/checkout-js"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
        onError={handleScriptError}
      />

      {/* Contenedor Principal Split-Screen */}
      <div className="w-full flex flex-col lg:flex-row lg:min-h-[calc(100vh-73px)]">

        {/* Acordeón Móvil (Solo visible en pantallas pequeñas) */}
        <div className="block lg:hidden w-full bg-slate-50 border-b border-slate-200">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="summary" className="border-b-0">
              <AccordionTrigger className="px-4 py-4 hover:no-underline transition-colors">
                <div className="flex items-center justify-between w-full pr-2 text-sm">
                  <div className="flex items-center gap-2 font-medium text-blue-600">
                    <ShoppingBag size={18} />
                    <span>Mostrar resumen del pedido</span>
                  </div>
                  <div className="font-semibold text-slate-900 text-base">
                    <span>S/ {totalFinalCalculado.toFixed(2)}</span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-4 pb-6 bg-white border-t border-slate-200">
                <OrderSummary />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Columna Izquierda (Formulario) */}
        <div className="w-full lg:w-1/2 xl:w-[55%] bg-white flex justify-center lg:justify-end lg:border-r lg:border-slate-200">
          <div className="w-full max-w-xl px-4 sm:px-6 lg:pr-12 xl:pr-16 py-8 lg:py-12">
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8 lg:space-y-10">

              <CustomerInfo isAuth={isAuth} />
              <ShippingInfo />
              <PaymentSelector />
              <InvoiceInfo />

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isFormLocked}
                  size="lg"
                  className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-base transition-colors gap-2 shadow-sm"
                >
                  {isPending || isCulqiProcessing ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Procesando pago seguro...</span>
                    </>
                  ) : isCulqiWaiting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Cargando pasarela...</span>
                    </>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Lock size={18} className="text-blue-100" />
                      <span>Pagar ahora • S/ {totalFinalCalculado.toFixed(2)}</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Columna Derecha (Resumen - Solo visible en Desktop) */}
        <div className="hidden lg:flex w-full lg:w-1/2 xl:w-[45%] bg-slate-50 justify-start">
          <div className="w-full max-w-lg px-6 lg:pl-12 xl:pl-16 py-12 relative">
            <div className="sticky top-12">
              <OrderSummary />
            </div>
          </div>
        </div>

      </div>
    </FormProvider>
  );
}