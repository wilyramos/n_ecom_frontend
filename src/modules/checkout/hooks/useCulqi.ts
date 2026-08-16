// File: frontend/src/modules/checkout/hooks/useCulqi.ts
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import {
  ICulqiClient,
  ICulqiOptions,
  ICulqiCheckoutInstance,
  CulqiCheckoutConfig,
  ICulqiError,
} from '@/src/types/culqi';

interface UseCulqiProps {
  onSuccess: (tokenOrOrderId: string) => void;
  onError?: (error: string) => void;
}

const DEFAULT_OPTIONS: ICulqiOptions = {
  lang: 'es',
  installments: true,
  modal: true,
  paymentMethods: {
    tarjeta: true,
    yape: true, 
    billetera: true, 
    bancaMovil: true,
    agente: true,
    cuotealo: true,
  },
  paymentMethodsSort: ['tarjeta', 'yape', 'billetera', 'bancaMovil', 'agente', 'cuotealo'],
};

export function useCulqi({ onSuccess, onError }: UseCulqiProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const checkoutRef = useRef<ICulqiCheckoutInstance | null>(null);
  const tokenHandledRef = useRef<boolean>(false);

  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [onSuccess, onError]);

  const handleScriptLoad = useCallback(() => {
    setIsScriptLoaded(true);
  }, []);

  const handleScriptError = useCallback(() => {
    toast.error('No se pudo conectar con los servidores de Culqi. Verifica tu conexión.');
  }, []);

  const closeCulqiModal = useCallback(() => {
    if (checkoutRef.current) {
      try {
        checkoutRef.current.close();
      } catch (e) {
        console.warn('⚠️ [useCulqi] Error al cerrar instancia de Checkout:', e);
      }
    }
  }, []);

  const handleSuccessReceived = useCallback((id: string) => {
    if (tokenHandledRef.current) return;
    tokenHandledRef.current = true;

    closeCulqiModal();
    setIsProcessing(false);
    onSuccessRef.current(id);
  }, [closeCulqiModal]);

  const handleErrorReceived = useCallback((errorObj: ICulqiError) => {
    tokenHandledRef.current = true;
    closeCulqiModal();
    setIsProcessing(false);

    const message = errorObj.user_message || errorObj.merchant_message || 'Transacción denegada por la entidad bancaria.';
    toast.error(message);
    if (onErrorRef.current) onErrorRef.current(message);
  }, [closeCulqiModal]);

  const openCulqiModal = useCallback(
    (amountInCents: number, clientData: ICulqiClient, orderNumber?: string, culqiOrderId?: string) => {
      const publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY;

      if (!publicKey || !window.CulqiCheckout2) {
        toast.error('La pasarela de pago no está disponible temporalmente.');
        return;
      }

      tokenHandledRef.current = false;
      setIsProcessing(true);

      try {
        const config: CulqiCheckoutConfig = {
          settings: {
            title: orderNumber ? `Orden ${orderNumber}` : 'NeoShop',
            currency: 'PEN',
            amount: amountInCents,
            ...(culqiOrderId && { order: culqiOrderId }),
          },
          client: {
            email: clientData.email,
          },
          options: DEFAULT_OPTIONS,
        };

        const checkout = new window.CulqiCheckout2(publicKey, config);

        checkout.culqi = () => {
          if (checkout.closeEvent) {
            console.log('🚫 [Culqi Hook] Modal cerrado por el usuario.');
            setIsProcessing(false);
            checkout.closeEvent = false;

            if (culqiOrderId) {
              handleSuccessReceived(culqiOrderId);
            }
          } else if (checkout.token) {
            handleSuccessReceived(checkout.token.id);
            checkout.token = null;
          } else if (checkout.order) {
            handleSuccessReceived(checkout.order.id);
            checkout.order = null;
          } else if (checkout.error) {
            handleErrorReceived(checkout.error);
            checkout.error = null;
          }
        };

        checkoutRef.current = checkout;
        checkout.open();
      } catch (err) {
        console.error('💥 [Culqi Hook] Error al desplegar Checkout:', err);
        setIsProcessing(false);
        toast.error('Error al desplegar la ventana de pago.');
      }
    },
    [handleSuccessReceived, handleErrorReceived]
  );

  return {
    isScriptLoaded,
    isProcessing,
    openCulqiModal,
    handleScriptLoad,
    handleScriptError,
  };
}