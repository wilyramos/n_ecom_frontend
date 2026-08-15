'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { EstadoPedido, IPedido } from '@/src/modules/checkout/types/pedido.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

/**
 * Obtiene el token de sesión almacenado en cookies seguras
 */
async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('ecommerce-token')?.value;
}

/**
 * Server Action: Actualiza el estado logístico de un pedido individual
 */
export async function updateAdminPedidoStatusAction(
  pedidoId: string,
  newStatus: EstadoPedido
): Promise<{ success: boolean; message?: string; data?: IPedido }> {
  try {
    const token = await getAuthToken();

    if (!token) {
      return { success: false, message: 'Sesión expirada o usuario no autenticado.' };
    }

    const res = await fetch(`${API_URL}/pedidos/${pedidoId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
      cache: 'no-store',
    });

    const responseData = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: responseData.message || 'No se pudo actualizar el estado en el servidor.',
      };
    }

    // Revalidar las rutas afectadas en la caché de Next.js
    revalidatePath('/admin/pedidos');
    revalidatePath(`/admin/pedidos/${pedidoId}`);

    return { success: true, data: responseData.data };
  } catch (error) {
    console.error('[updateAdminPedidoStatusAction Error]:', error);
    return { success: false, message: 'Fallo de red al conectar con el servidor.' };
  }
}

/**
 * Server Action: Actualiza el estado de MÚLTIPLES pedidos en conjunto (Bulk Update)
 * Dispara en el backend los eventos correspondientes (ej. envío de email individual).
 */
export async function updateBulkAdminPedidoStatusAction(
  pedidoIds: string[],
  newStatus: EstadoPedido
): Promise<{ success: boolean; message?: string; updatedCount?: number }> {
  try {
    const token = await getAuthToken();

    if (!token) {
      return { success: false, message: 'Sesión expirada o usuario no autenticado.' };
    }

    if (!pedidoIds || pedidoIds.length === 0) {
      return { success: false, message: 'Debe seleccionar al menos un pedido.' };
    }

    // Procesamiento paralelo de actualizaciones masivas
    const results = await Promise.all(
      pedidoIds.map((id) =>
        fetch(`${API_URL}/pedidos/${id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
          cache: 'no-store',
        })
      )
    );

    const successCount = results.filter((r) => r.ok).length;

    // Revalidar la vista de pedidos
    revalidatePath('/admin/pedidos');

    if (successCount === 0) {
      return {
        success: false,
        message: 'No se pudo actualizar ninguno de los pedidos seleccionados.',
      };
    }

    return {
      success: true,
      updatedCount: successCount,
      message: `Se actualizaron correctamente ${successCount} de ${pedidoIds.length} pedidos.`,
    };
  } catch (error) {
    console.error('[updateBulkAdminPedidoStatusAction Error]:', error);
    return { success: false, message: 'Ocurrió un fallo al realizar la actualización en lote.' };
  }
}