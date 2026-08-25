// File: frontend/src/modules/checkout/actions/admin-pedidos.actions.ts

'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { EstadoPedido, IPedido } from '@/src/modules/checkout/types/pedido.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:4000/api';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const ESTADOS_VALIDOS = [
  'awaiting_payment',
  'processing',
  'shipped',
  'delivered',
  'canceled',
  'paid_but_out_of_stock',
] as const;

const updateStatusSchema = z.object({
  pedidoId: z.string().regex(objectIdRegex, { message: 'Identificador de pedido inválido.' }),
  newStatus: z.enum(ESTADOS_VALIDOS, { message: 'El estado seleccionado no es válido.' }),
});

const updateBulkStatusSchema = z.object({
  pedidoIds: z
    .array(z.string().regex(objectIdRegex, { message: 'Uno de los identificadores es inválido.' }))
    .min(1, { message: 'Debe seleccionar al menos un pedido.' })
    .max(50, { message: 'No se pueden actualizar más de 50 pedidos por operación.' }),
  newStatus: z.enum(ESTADOS_VALIDOS, { message: 'El estado seleccionado no es válido.' }),
});

async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('ecommerce-token')?.value;
  return token || null;
}

export async function updateAdminPedidoStatusAction(
  pedidoId: string,
  newStatus: EstadoPedido
): Promise<{ success: boolean; message?: string; data?: IPedido }> {
  try {
    const validation = updateStatusSchema.safeParse({ pedidoId, newStatus });
    if (!validation.success) {
      return {
        success: false,
        message: validation.error.issues[0]?.message || 'Datos de actualización inválidos.',
      };
    }

    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: 'Sesión expirada o permisos insuficientes.' };
    }

    const res = await fetch(`${API_URL}/pedidos/${validation.data.pedidoId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: validation.data.newStatus }),
      cache: 'no-store',
    });

    const responseData = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: responseData.message || 'No se pudo actualizar el estado en el servidor.',
      };
    }

    revalidatePath('/admin/pedidos');
    revalidatePath(`/admin/pedidos/${validation.data.pedidoId}`);

    return {
      success: true,
      data: responseData.data,
      message: 'Estado del pedido actualizado exitosamente.',
    };
  } catch (error) {
    console.error('[updateAdminPedidoStatusAction Error]:', error);
    return { success: false, message: 'Fallo de red al conectar con el servidor.' };
  }
}

export async function updateBulkAdminPedidoStatusAction(
  pedidoIds: string[],
  newStatus: EstadoPedido
): Promise<{ success: boolean; message?: string; updatedCount?: number }> {
  try {
    const validation = updateBulkStatusSchema.safeParse({ pedidoIds, newStatus });
    if (!validation.success) {
      return {
        success: false,
        message: validation.error.issues[0]?.message || 'Parámetros masivos inválidos.',
      };
    }

    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: 'Sesión expirada o permisos insuficientes.' };
    }

    const updatePromises = validation.data.pedidoIds.map(async (id) => {
      try {
        const res = await fetch(`${API_URL}/pedidos/${id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: validation.data.newStatus }),
          cache: 'no-store',
        });
        return res.ok;
      } catch {
        return false;
      }
    });

    const results = await Promise.all(updatePromises);
    const successCount = results.filter(Boolean).length;

    revalidatePath('/admin/pedidos');

    if (successCount === 0) {
      return {
        success: false,
        message: 'No se pudo procesar la actualización para los pedidos seleccionados.',
      };
    }

    return {
      success: true,
      updatedCount: successCount,
      message: `Se actualizaron correctamente ${successCount} de ${validation.data.pedidoIds.length} pedidos.`,
    };
  } catch (error) {
    console.error('[updateBulkAdminPedidoStatusAction Error]:', error);
    return { success: false, message: 'Error interno al procesar la actualización masiva.' };
  }
}