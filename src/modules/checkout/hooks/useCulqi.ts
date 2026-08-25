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
  CulqiCheckoutConstructor,
  ICulqiGlobalObject,
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
    console.log('✅ [Culqi Hook] Script cargado en DOM.');
    setIsScriptLoaded(true);
  }, []);

  const handleScriptError = useCallback(() => {
    toast.error('No se pudo conectar con los servidores de Culqi.');
  }, []);

  const closeCulqiModal = useCallback(() => {
    try {
      if (checkoutRef.current?.close) {
        checkoutRef.current.close();
      } else if (window.Culqi?.close) {
        window.Culqi.close();
      }
    } catch (e) {
      console.warn('⚠️ Error al cerrar modal de Culqi:', e);
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
    if (tokenHandledRef.current) return;
    tokenHandledRef.current = true;
    closeCulqiModal();
    setIsProcessing(false);

    const message = errorObj.user_message || errorObj.merchant_message || 'Transacción denegada.';
    toast.error(message);
    if (onErrorRef.current) onErrorRef.current(message);
  }, [closeCulqiModal]);

  const openCulqiModal = useCallback(
    (amountInCents: number, clientData: ICulqiClient, orderNumber?: string, culqiOrderId?: string) => {
      const publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY;
      if (!publicKey) {
        toast.error('Llave pública de Culqi no configurada.');
        return;
      }

      tokenHandledRef.current = false;
      setIsProcessing(true);

      const config: CulqiCheckoutConfig = {
        settings: {
          title: orderNumber ? `Orden #${orderNumber}` : 'NeoShop',
          currency: 'PEN',
          amount: amountInCents,
          ...(culqiOrderId && { order: culqiOrderId }), // Se inyecta la orden limpia
        },
        client: clientData,
        options: DEFAULT_OPTIONS,
      };

      const CheckoutConstructor: CulqiCheckoutConstructor | undefined = window.CulqiCheckout || window.CulqiCheckout2;

      if (CheckoutConstructor) {
        const checkout = new CheckoutConstructor(publicKey, config);
        checkout.culqi = () => {
          if (checkout.token) {
            handleSuccessReceived(checkout.token.id);
            checkout.token = null;
          } else if (checkout.order) {
            handleSuccessReceived(checkout.order.id);
            checkout.order = null;
          } else if (checkout.error) {
            handleErrorReceived(checkout.error);
            checkout.error = null;
          } else if (checkout.closeEvent) {
            setIsProcessing(false);
            checkout.closeEvent = false;
          }
        };
        checkoutRef.current = checkout;
        checkout.open();
        return;
      }

      // Fallback global
      const globalCulqi: ICulqiGlobalObject | undefined = window.Culqi;
      if (globalCulqi) {
        window.CULQI_PUBLIC_KEY = publicKey;
        globalCulqi.publicKey = publicKey;
        globalCulqi.settings(config.settings);
        globalCulqi.options(DEFAULT_OPTIONS);

        window.culqi = () => {
          if (globalCulqi.token) {
            handleSuccessReceived(globalCulqi.token.id);
            globalCulqi.token = null;
          } else if (globalCulqi.order) {
            handleSuccessReceived(globalCulqi.order.id);
            globalCulqi.order = null;
          } else if (globalCulqi.error) {
            handleErrorReceived(globalCulqi.error);
            globalCulqi.error = null;
          } else if (globalCulqi.closeEvent) {
            setIsProcessing(false);
            globalCulqi.closeEvent = false;
          }
        };
        globalCulqi.open();
        return;
      }

      setIsProcessing(false);
      toast.error('La pasarela de pago se está inicializando, intenta de nuevo.');
    },
    [handleSuccessReceived, handleErrorReceived]
  );

  return { isScriptLoaded, isProcessing, openCulqiModal, handleScriptLoad, handleScriptError };
}