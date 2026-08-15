'use server';

import { checkoutSchema, CheckoutFormData } from '../schemas/checkout.schema';
import { cookies } from 'next/headers';
import { ICrearPedidoResponse } from '../types/pedido.types';

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
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const result = await response.json();

    if (!response.ok) {
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
  } catch (error) {
    console.error('💥 [Server Action Error]:', error);
    return { success: false, message: 'Fallo de conexión con el servidor.' };
  }
}

export async function procesarCargoCulqiAction(orderNumber: string, culqiToken: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('ecommerce-token')?.value;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:4000/api';

    const response = await fetch(`${apiUrl}/pedidos/culqi-charge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ orderNumber, culqiToken }),
      cache: 'no-store',
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || 'La pasarela rechazó la transacción.' };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error('💥 [procesarCargoCulqiAction Error]:', error);
    return { success: false, message: 'Error de conexión al procesar el cobro.' };
  }
}