// File: frontend/src/modules/checkout/actions/checkout.actions.ts

'use server';

import { checkoutSchema, CheckoutFormData } from '../schemas/checkout.schema';
import { cookies } from 'next/headers';
import { ICrearPedidoResponse, IPedido } from '../types/pedido.types';

interface ICrearPedidoActionInput extends CheckoutFormData {
  items: Array<{
    productId: string;
    variantId?: string;
    variantAttributes?: Record<string, string>;
    quantity: number;
    price: number;
    nombre: string;
    imagen?: string;
  }>;
  shippingCost: number;
  currency?: string;
}

export interface IParameters3DS {
  eci?: string;
  xid?: string;
  cavv?: string;
  protocolVersion?: string;
  directoryServerTransactionId?: string;
  [key: string]: unknown;
}

export interface ICargoCulqiData {
  status: 'approved' | 'requires_3ds' | 'pending';
  pedido: IPedido;
  paymentCode?: string;
}

export interface IProcesarCargoCulqiResponse {
  success: boolean;
  message?: string;
  data?: ICargoCulqiData;
}

interface IBackendResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export async function crearPedidoAction(
  data: ICrearPedidoActionInput
): Promise<ICrearPedidoResponse> {
  const parsed = checkoutSchema.safeParse(data);

  if (!parsed.success) {
    const errorMsg = parsed.error.issues.map((i) => i.message).join(', ');
    return { success: false, message: `Datos del formulario inválidos: ${errorMsg}` };
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('ecommerce-token')?.value;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:4000/api';
    const endpoint = `${apiUrl}/pedidos`;

    const payload = {
      customerProfile: parsed.data.customerProfile,
      deliveryMethod: parsed.data.deliveryMethod,
      shippingAddress: data.shippingAddress,
      invoiceInfo: parsed.data.invoiceInfo?.type === 'factura' ? parsed.data.invoiceInfo : undefined,
      items: data.items,
      shippingCost: data.shippingCost ?? 0,
      currency: data.currency || 'PEN',
      payment: {
        provider: parsed.data.payment.provider,
        method: parsed.data.payment.method || parsed.data.payment.provider,
        paymentCode: parsed.data.payment.paymentCode,
      },
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const result = (await response.json()) as IBackendResponse<{
      pedido: IPedido;
      initPoint?: string | null;
      culqiOrderId?: string | null;
    }>;

    if (!response.ok || !result.data) {
      return { success: false, message: result.message || 'Error al registrar el pedido.' };
    }

    return {
      success: true,
      data: {
        pedido: result.data.pedido,
        initPoint: result.data.initPoint || null,
        culqiOrderId: result.data.culqiOrderId || null,
      },
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Fallo de conexión con el servidor.';
    console.error('💥 [Server Action Error]:', errorMessage);
    return { success: false, message: 'Fallo de conexión con el servidor.' };
  }
}

export async function procesarCargoCulqiAction(
  orderNumber: string,
  culqiToken: string,
  parameters3DS?: IParameters3DS,
  deviceFingerPrintId?: string,
  installments?: number
): Promise<IProcesarCargoCulqiResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('ecommerce-token')?.value;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:4000/api';

    const response = await fetch(`${apiUrl}/pedidos/culqi-charge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        orderNumber,
        culqiToken,
        parameters3DS,
        deviceFingerPrintId,
        installments: typeof installments === 'number' && installments > 0 ? installments : 1,
      }),
      cache: 'no-store',
    });

    const result = (await response.json()) as IBackendResponse<ICargoCulqiData>;

    if (!response.ok) {
      return { success: false, message: result.message || 'La pasarela rechazó la transacción.' };
    }

    return { success: true, data: result.data };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error de conexión al procesar el cobro.';
    console.error('💥 [procesarCargoCulqiAction Error]:', errorMessage);
    return { success: false, message: 'Error de conexión al procesar el cobro.' };
  }
}

export async function cancelarPedidoAction(orderNumber: string): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('ecommerce-token')?.value;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:4000/api';

    await fetch(`${apiUrl}/pedidos/${orderNumber}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: 'no-store',
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('💥 [cancelarPedidoAction Error]:', errorMessage);
  }
}