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

type ExtendedCulqiInstance = CulqiInstance & {
  charge?: { id: string } | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  order?: any; 
};

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
  
  // Rastreadores de órdenes diferidas (PagoEfectivo / CIP)
  const deferredOrderIdRef = useRef<string | null>(null);
  const providedOrderIdRef = useRef<string | null>(null); 

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
      console.warn('⚠️ [useCulqi] Error al forzar cierre del modal de Culqi:', e);
    }
  }, []);

  const handleSuccessReceived = useCallback(
    (id: string) => {
      console.log(`✅ [useCulqi] Resolviendo éxito en el frontend para ID: ${id}`);
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
      console.error('💥 [useCulqi] Modal de Culqi emitió un error:', errorObj);
      if (tokenHandledRef.current) return;
      tokenHandledRef.current = true;
      closeCulqiModal();
      setIsProcessing(false);

      const message = errorObj.user_message || 'El emisor de la tarjeta rechazó la operación.';
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

  // 🔴 ESCUCHADOR GLOBAL DE MENSAJES (postMessage)
  useEffect(() => {
    if (!isProcessing) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        let payload: unknown = event.data;

        if (typeof payload === 'string') {
          try { payload = JSON.parse(payload) as unknown; } catch {}
        }

        const data = typeof payload === 'object' && payload !== null ? (payload as Record<string, unknown>) : null;

        // 🔴 LA LÍNEA MÁGICA: Agregamos object === 'closeCheckout' a la validación
        const isCloseAction =
          payload === 'checkout_close' ||
          payload === 'close' ||
          data?.action === 'close' ||
          data?.type === 'culqi.close' ||
          data?.event === 'checkout_closed' ||
          data?.name === 'checkout_close' ||
          data?.object === 'closeCheckout'; // <--- ESTO DETECTA EL BOTÓN "DE ACUERDO"

        const isOrderSuccess = data?.action === 'order_pending' || data?.type === 'order_success' || data?.event === 'order_created';

        if (isCloseAction || isOrderSuccess) {
          // console.log(`🛑 [useCulqi postMessage] Acción de cierre/éxito detectada.`);
          const targetId = deferredOrderIdRef.current || providedOrderIdRef.current;
          
          if (targetId && targetId.startsWith('ord_')) {
            handleSuccessReceived(targetId);
          } else if (isCloseAction) {
            handleCloseReceived();
          }
        }
      } catch (e: unknown) {
        console.warn(e);
        // console.warn('⚠️ [useCulqi] Error leyendo postMessage de Culqi:', e);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isProcessing, handleCloseReceived, handleSuccessReceived]);

  // Fallback visual (Polling)
  useEffect(() => {
    if (!isProcessing) return;
    let fallbackInterval: NodeJS.Timeout;

    // Le damos 2 segundos de gracia al modal para aparecer antes de empezar a vigilar
    const timeoutId = setTimeout(() => {
      fallbackInterval = setInterval(() => {
        const culqiContainer = document.querySelector('.culqi-checkout-container') || document.getElementById('culqi-container');
        if (culqiContainer) {
          const isHidden = window.getComputedStyle(culqiContainer).display === 'none';
          if (isHidden) {
            // console.log("🕵️‍♂️ [useCulqi Fallback] El modal de Culqi se detectó oculto físicamente.");
            const targetId = deferredOrderIdRef.current || providedOrderIdRef.current;
            if (targetId && targetId.startsWith('ord_')) {
              handleSuccessReceived(targetId);
            } else {
              handleCloseReceived();
            }
            clearInterval(fallbackInterval);
          }
        }
      }, 1000);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, [isProcessing, handleCloseReceived, handleSuccessReceived]);

  const openCulqiModal = useCallback(
    (amountInCents: number, clientData: ICulqiClient, orderNumber?: string, culqiOrderId?: string) => {
      const publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY;
      if (!publicKey) {
        toast.error('Llave pública de Culqi no configurada.');
        return;
      }

      if (window.Culqi) {
        window.Culqi.order = null;
        window.Culqi.token = null;
        const extendedCulqi = window.Culqi as ExtendedCulqiInstance;
        extendedCulqi.charge = null;
      }

      tokenHandledRef.current = false;
      deferredOrderIdRef.current = null;
      providedOrderIdRef.current = culqiOrderId || null; 
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

      const eventHandler = (rawInstance: CulqiInstance) => {
        try {
          const instance = rawInstance as ExtendedCulqiInstance;

          if (instance.charge) {
            handleSuccessReceived(instance.charge.id);
            instance.charge = null;
          } 
          else if (instance.order) {
            const orderId = typeof instance.order === 'string' ? instance.order : (instance.order.id || instance.order.order_number);
            if (orderId) deferredOrderIdRef.current = orderId;
            instance.order = null; 
          } 
          else if (instance.error) {
            handleErrorReceived(instance.error);
            instance.error = null;
          } 
          else if (instance.token) {
            handleSuccessReceived(instance.token.id);
            instance.token = null;
          } 
          else if (instance.closeEvent) {
            instance.closeEvent = false;
            const targetId = deferredOrderIdRef.current || providedOrderIdRef.current;
            if (targetId && targetId.startsWith('ord_')) {
              handleSuccessReceived(targetId);
            } else {
              handleCloseReceived();
            }
          }
        } catch (error: unknown) {
          console.warn(error);
          // console.error('⚠️ [useCulqi] Error manejando evento de Culqi:', error);
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