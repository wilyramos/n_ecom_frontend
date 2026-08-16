// frontend/src/modules/tickets/admin-tickets.actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { ITicket } from './ticket.types';
import { ticketFormSchema } from './ticket.schema';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('ecommerce-token')?.value;
}

export async function createTicketAction(formData: unknown): Promise<{
  success: boolean;
  message?: string;
  data?: ITicket;
}> {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: 'Sesión no autorizada o expirada.' };
    }

    const parsed = ticketFormSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || 'Datos de formulario inválidos.',
      };
    }

    const res = await fetch(`${API_URL}/tickets/convertir`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(parsed.data),
      cache: 'no-store',
    });

    const responseData = await res.json();

    if (!res.ok || !responseData.success) {
      return {
        success: false,
        message: responseData.message || 'Error al guardar la nota de venta.',
      };
    }

    revalidatePath('/admin/tickets');
    return { success: true, data: responseData.data };
  } catch (error) {
    console.error('[createTicketAction Error]:', error);
    return { success: false, message: 'Error en la conexión con el servidor.' };
  }
}

export async function updateTicketAction(id: string, formData: unknown): Promise<{
  success: boolean;
  message?: string;
  data?: ITicket;
}> {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: 'Sesión no autorizada o expirada.' };
    }

    const parsed = ticketFormSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || 'Datos de formulario inválidos.',
      };
    }

    const res = await fetch(`${API_URL}/tickets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(parsed.data),
      cache: 'no-store',
    });

    const responseData = await res.json();

    if (!res.ok || !responseData.success) {
      return {
        success: false,
        message: responseData.message || 'Error al actualizar el comprobante.',
      };
    }

    revalidatePath('/admin/tickets');
    return { success: true, data: responseData.data };
  } catch (error) {
    console.error('[updateTicketAction Error]:', error);
    return { success: false, message: 'Error en la conexión con el servidor.' };
  }
}

export async function deleteTicketAction(id: string): Promise<{
  success: boolean;
  message?: string;
}> {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { success: false, message: 'Sesión no autorizada.' };
    }

    const res = await fetch(`${API_URL}/tickets/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const responseData = await res.json();
      return { success: false, message: responseData.message || 'No se pudo eliminar.' };
    }

    revalidatePath('/admin/tickets');
    return { success: true, message: 'Registro eliminado correctamente.' };
  } catch (error) {
    console.error('[deleteTicketAction Error]:', error);
    return { success: false, message: 'Error de red.' };
  }
}