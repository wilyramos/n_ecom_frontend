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
  onClose?: () => void;
}

type CulqiInstance = ICulqiCheckoutInstance | ICulqiGlobalObject;

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

export function useCulqi({ onSuccess, onError, onClose }: UseCulqiProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return Boolean(window.CulqiCheckout || window.CulqiCheckout2 || window.Culqi);
    }
    return false;
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const checkoutRef = useRef<ICulqiCheckoutInstance | null>(null);
  const tokenHandledRef = useRef<boolean>(false);

  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
    onCloseRef.current = onClose;
  }, [onSuccess, onError, onClose]);

  useEffect(() => {
    if (!isScriptLoaded && typeof window !== 'undefined') {
      if (window.CulqiCheckout || window.CulqiCheckout2 || window.Culqi) {
        setIsScriptLoaded(true);
      }
    }
  }, [isScriptLoaded]);

  const handleScriptLoad = useCallback(() => {
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
    } catch (e: unknown) {
      console.warn('⚠️ Error al cerrar modal de Culqi:', e);
    }
  }, []);

  const handleSuccessReceived = useCallback(
    (id: string) => {
      if (tokenHandledRef.current) return;
      tokenHandledRef.current = true;
      closeCulqiModal();
      setIsProcessing(false);
      onSuccessRef.current(id);
    },
    [closeCulqiModal]
  );

  const handleErrorReceived = useCallback(
    (errorObj: ICulqiError) => {
      if (tokenHandledRef.current) return;
      tokenHandledRef.current = true;
      closeCulqiModal();
      setIsProcessing(false);

      const message = errorObj.user_message || errorObj.merchant_message || 'Transacción denegada.';
      toast.error(message);
      if (onErrorRef.current) onErrorRef.current(message);
    },
    [closeCulqiModal]
  );

  const handleCloseReceived = useCallback(() => {
    if (tokenHandledRef.current) return;
    setIsProcessing(false);
    if (onCloseRef.current) onCloseRef.current();
  }, []);

  useEffect(() => {
    if (!isProcessing) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        let payload: unknown = event.data;

        if (typeof payload === 'string') {
          try {
            payload = JSON.parse(payload) as unknown;
          } catch {
            // Se mantiene como string si no es JSON serializado
          }
        }

        const data = typeof payload === 'object' && payload !== null ? (payload as Record<string, unknown>) : null;

        const isCloseAction =
          payload === 'checkout_close' ||
          payload === 'close' ||
          data?.action === 'close' ||
          data?.type === 'culqi.close' ||
          data?.event === 'checkout_closed' ||
          data?.name === 'checkout_close';

        if (isCloseAction) {
          handleCloseReceived();
        }
      } catch (e: unknown) {
        console.warn('Error leyendo postMessage de Culqi:', e);
      }
    };

    window.addEventListener('message', handleMessage);

    const interval = setInterval(() => {
      const culqiContainer =
        document.getElementById('culqi-container') ||
        document.querySelector('.culqi-checkout-container') ||
        document.querySelector('iframe[src*="culqi.com"]');

      if (!culqiContainer && isProcessing && !tokenHandledRef.current) {
        handleCloseReceived();
      }
    }, 600);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearInterval(interval);
    };
  }, [isProcessing, handleCloseReceived]);

  const openCulqiModal = useCallback(
    (amountInCents: number, clientData: ICulqiClient, orderNumber?: string, culqiOrderId?: string) => {
      const publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY;
      if (!publicKey) {
        toast.error('Llave pública de Culqi no configurada.');
        return;
      }

      // 🔴 LIMPIEZA FORZADA DE DOM PARA EVITAR REUSO DE ÓRDENES ANTIGUAS EN CULQI V4
      const existingContainer = document.getElementById('culqi-container') || document.querySelector('.culqi-checkout-container');
      if (existingContainer) {
        existingContainer.remove();
      }
      
      // Limpiar rastro global
      if (window.Culqi) {
        window.Culqi.order = null;
        window.Culqi.token = null;
      }

      tokenHandledRef.current = false;
      setIsProcessing(true);

      const config: CulqiCheckoutConfig = {
        settings: {
          title: orderNumber ? `Orden #${orderNumber}` : 'NeoShop',
          currency: 'PEN',
          amount: amountInCents,
          ...(culqiOrderId && { order: culqiOrderId }),
        },
        client: clientData,
        options: DEFAULT_OPTIONS,
      };

      const eventHandler = (instance: CulqiInstance) => {
        try {
          if (instance.token) {
            handleSuccessReceived(instance.token.id);
            instance.token = null;
          } else if (instance.order) {
            handleSuccessReceived(instance.order.id);
            instance.order = null;
          } else if (instance.error) {
            handleErrorReceived(instance.error);
            instance.error = null;
          } else if (instance.closeEvent) {
            handleCloseReceived();
            instance.closeEvent = false;
          }
        } catch (error: unknown) {
          console.error('Error en callback culqi:', error);
          handleCloseReceived();
        }
      };

      const CheckoutConstructor: CulqiCheckoutConstructor | undefined =
        window.CulqiCheckout || window.CulqiCheckout2;

      if (CheckoutConstructor) {
        const checkout = new CheckoutConstructor(publicKey, config);
        checkout.culqi = () => eventHandler(checkout);
        checkoutRef.current = checkout;
        checkout.open();
        return;
      }

      const globalCulqi: ICulqiGlobalObject | undefined = window.Culqi;
      if (globalCulqi) {
        window.CULQI_PUBLIC_KEY = publicKey;
        globalCulqi.publicKey = publicKey;
        globalCulqi.settings(config.settings);
        globalCulqi.options(DEFAULT_OPTIONS);

        window.culqi = () => eventHandler(globalCulqi);
        globalCulqi.open();
        return;
      }

      setIsProcessing(false);
      toast.error('La pasarela de pago se está inicializando, intenta de nuevo.');
    },
    [handleSuccessReceived, handleErrorReceived, handleCloseReceived]
  );

  return { isScriptLoaded, isProcessing, openCulqiModal, handleScriptLoad, handleScriptError };
}